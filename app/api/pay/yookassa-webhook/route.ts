import { NextResponse } from "next/server";
import { getOrderByPublicId, markOrderPaid } from "@/lib/orders";

/**
 * Webhook ЮKassa: настройте в личном кабинете уведомление
 * payment.succeeded на {SITE_URL}/api/pay/yookassa-webhook.
 * Подлинность проверяем повторным запросом платежа к API ЮKassa
 * (рекомендованный способ: не доверять телу webhook напрямую).
 */
export async function POST(req: Request) {
  try {
    const event = await req.json();
    if (event?.event !== "payment.succeeded") return NextResponse.json({ ok: true });

    const paymentId = event?.object?.id as string | undefined;
    const publicId = event?.object?.metadata?.order_public_id as string | undefined;
    if (!paymentId || !publicId) return NextResponse.json({ ok: true });

    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    if (!shopId || !secretKey) return NextResponse.json({ ok: false }, { status: 500 });

    const res = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      headers: {
        Authorization: "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
      },
    });
    if (!res.ok) return NextResponse.json({ ok: false }, { status: 502 });
    const payment = await res.json();

    if (
      payment.status === "succeeded" &&
      payment.metadata?.order_public_id === publicId
    ) {
      const order = getOrderByPublicId(publicId);
      if (order && Number(payment.amount?.value) === order.total) {
        await markOrderPaid(order, paymentId);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("yookassa webhook", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
