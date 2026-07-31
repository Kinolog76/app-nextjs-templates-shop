import crypto from "crypto";
import { getDb, Order, OrderItem, Product } from "./db";
import { sendMail } from "./email";

export function siteUrl(): string {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function createOrder(email: string, productIds: number[]): Order {
  const db = getDb();
  const placeholders = productIds.map(() => "?").join(",");
  const products = db
    .prepare(`SELECT * FROM products WHERE id IN (${placeholders}) AND active = 1`)
    .all(...productIds) as Product[];
  if (products.length === 0) throw new Error("Корзина пуста или товары недоступны");

  const total = products.reduce((s, p) => s + p.price, 0);
  const publicId = crypto.randomBytes(6).toString("hex").toUpperCase();
  const accessKey = crypto.randomBytes(24).toString("hex");

  const orderId = db
    .prepare(
      "INSERT INTO orders (public_id, access_key, email, total, provider) VALUES (?, ?, ?, ?, ?)"
    )
    .run(publicId, accessKey, email, total, process.env.PAYMENT_PROVIDER || "mock")
    .lastInsertRowid as number;

  const insertItem = db.prepare(
    "INSERT INTO order_items (order_id, product_id, title, price) VALUES (?, ?, ?, ?)"
  );
  for (const p of products) insertItem.run(orderId, p.id, p.title, p.price);

  return db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId) as Order;
}

export function getOrderByPublicId(publicId: string): Order | undefined {
  return getDb().prepare("SELECT * FROM orders WHERE public_id = ?").get(publicId) as
    | Order
    | undefined;
}

export function getOrderItems(orderId: number): OrderItem[] {
  return getDb().prepare("SELECT * FROM order_items WHERE order_id = ?").all(orderId) as OrderItem[];
}

/**
 * Доставка: заказ помечается оплаченным, каждой позиции выдается
 * бессрочный download-токен, клиенту уходит письмо со ссылками.
 * Идемпотентно — повторный вызов (повторный webhook) ничего не ломает.
 */
export async function markOrderPaid(order: Order, providerPaymentId?: string): Promise<void> {
  const db = getDb();
  if (order.status === "paid") return;

  const tx = db.transaction(() => {
    db.prepare(
      "UPDATE orders SET status = 'paid', paid_at = datetime('now'), provider_payment_id = ? WHERE id = ? AND status = 'pending'"
    ).run(providerPaymentId ?? null, order.id);

    const items = getOrderItems(order.id);
    const setToken = db.prepare("UPDATE order_items SET download_token = ? WHERE id = ?");
    for (const item of items) {
      if (!item.download_token) setToken.run(crypto.randomBytes(24).toString("hex"), item.id);
    }
  });
  tx();

  const items = getOrderItems(order.id);
  const base = siteUrl();
  const orderUrl = `${base}/orders/${order.public_id}?key=${order.access_key}`;
  const linksHtml = items
    .map(
      (i) =>
        `<li><b>${i.title}</b> — <a href="${base}/api/download/${i.download_token}">скачать</a></li>`
    )
    .join("");

  await sendMail(
    order.email,
    `Ваш заказ ${order.public_id} — TemplateFlow`,
    `<h2>Спасибо за покупку!</h2>
     <p>Заказ <b>${order.public_id}</b> оплачен. Ваши шаблоны:</p>
     <ul>${linksHtml}</ul>
     <p>Страница заказа (сохраните ссылку — она бессрочная, обновления шаблонов доступны по ней же):<br/>
     <a href="${orderUrl}">${orderUrl}</a></p>`
  );
}
