import { NextResponse } from "next/server";
import crypto from "crypto";
import { getOrderByPublicId, markOrderPaid } from "@/lib/orders";
import { mockSignature } from "@/lib/payments";

// Подтверждение оплаты в тестовой (mock) платежке
export async function POST(req: Request) {
  const { publicId, sig } = await req.json();
  const order = getOrderByPublicId(String(publicId || ""));
  if (!order) return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });

  const expected = mockSignature(order.public_id);
  const given = String(sig || "");
  if (
    given.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))
  ) {
    return NextResponse.json({ error: "Неверная подпись платежа" }, { status: 403 });
  }

  await markOrderPaid(order, `mock-${Date.now()}`);
  return NextResponse.json({
    redirect: `/orders/${order.public_id}?key=${order.access_key}`,
  });
}
