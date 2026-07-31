import crypto from "crypto";
import { Order } from "./db";
import { siteUrl } from "./orders";

/**
 * Платежная абстракция.
 *
 * mock     — встроенная тестовая платежка: редирект на /pay/[id],
 *            где «оплата» подтверждается кнопкой. Работает из коробки.
 * yookassa — реальная ЮKassa: создаем платеж через API, редиректим на
 *            confirmation_url, оплату подтверждает webhook
 *            /api/pay/yookassa-webhook (событие payment.succeeded).
 *            Включается через env: PAYMENT_PROVIDER=yookassa + ключи.
 */
export type PaymentStart = { paymentUrl: string };

const MOCK_SECRET = () => process.env.AUTH_SECRET || "dev-secret";

export function mockSignature(publicId: string): string {
  return crypto.createHmac("sha256", MOCK_SECRET()).update(`pay:${publicId}`).digest("hex").slice(0, 32);
}

export async function startPayment(order: Order): Promise<PaymentStart> {
  const provider = process.env.PAYMENT_PROVIDER || "mock";

  if (provider === "yookassa") {
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    if (!shopId || !secretKey) throw new Error("YooKassa не настроена: нет YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY");

    const res = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": `order-${order.public_id}`,
        Authorization: "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: { value: order.total.toFixed(2), currency: "UAH" },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: `${siteUrl()}/orders/${order.public_id}?key=${order.access_key}`,
        },
        description: `Заказ ${order.public_id} — TemplateFlow`,
        metadata: { order_public_id: order.public_id },
        receipt: {
          customer: { email: order.email },
          items: [
            {
              description: `Цифровые шаблоны, заказ ${order.public_id}`,
              quantity: 1,
              amount: { value: order.total.toFixed(2), currency: "UAH" },
              vat_code: 1,
              payment_subject: "service",
              payment_mode: "full_payment",
            },
          ],
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`YooKassa error ${res.status}: ${text}`);
    }
    const payment = (await res.json()) as {
      id: string;
      confirmation: { confirmation_url: string };
    };
    return { paymentUrl: payment.confirmation.confirmation_url };
  }

  // mock
  return { paymentUrl: `/pay/${order.public_id}?sig=${mockSignature(order.public_id)}` };
}
