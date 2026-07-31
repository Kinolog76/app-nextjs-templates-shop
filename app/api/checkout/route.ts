import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { startPayment } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const productIds = (Array.isArray(body.productIds) ? body.productIds : [])
      .map(Number)
      .filter((n: number) => Number.isInteger(n) && n > 0);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Укажите корректный email" }, { status: 400 });
    }
    if (productIds.length === 0) {
      return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
    }

    const order = createOrder(email, productIds);
    const { paymentUrl } = await startPayment(order);
    return NextResponse.json({ paymentUrl, orderId: order.public_id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка" },
      { status: 500 }
    );
  }
}
