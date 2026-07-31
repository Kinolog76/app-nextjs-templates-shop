import { NextResponse } from "next/server";
import { getDb, Order } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { siteUrl } from "@/lib/orders";

// Восстановление доступа к покупкам: письмо со ссылками на все оплаченные заказы.
// Ответ всегда одинаковый — не раскрываем, есть ли покупки у email.
export async function POST(req: Request) {
  const { email } = await req.json();
  const normalized = String(email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return NextResponse.json({ ok: true });
  }

  const orders = getDb()
    .prepare("SELECT * FROM orders WHERE email = ? AND status = 'paid' ORDER BY id DESC")
    .all(normalized) as Order[];

  if (orders.length > 0) {
    const base = siteUrl();
    const list = orders
      .map(
        (o) =>
          `<li>Заказ <b>${o.public_id}</b> от ${o.created_at} — <a href="${base}/orders/${o.public_id}?key=${o.access_key}">открыть и скачать</a></li>`
      )
      .join("");
    await sendMail(
      normalized,
      "Ваши покупки — TemplateFlow",
      `<h2>Ваши заказы</h2><ul>${list}</ul><p>Ссылки бессрочные, обновления шаблонов доступны по ним же.</p>`
    );
  }

  return NextResponse.json({ ok: true });
}
