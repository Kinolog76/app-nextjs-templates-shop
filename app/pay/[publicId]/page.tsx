import { notFound, redirect } from "next/navigation";
import { getOrderByPublicId, getOrderItems } from "@/lib/orders";
import { LogoMark } from "@/components/logo";
import { formatPrice } from "@/lib/format";
import { PayForm } from "./pay-form";

export const dynamic = "force-dynamic";

export default async function MockPayPage({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ sig?: string }>;
}) {
  const { publicId } = await params;
  const { sig } = await searchParams;
  const order = getOrderByPublicId(publicId);
  if (!order || !sig) notFound();
  if (order.status === "paid") {
    redirect(`/orders/${order.public_id}?key=${order.access_key}`);
  }
  const items = getOrderItems(order.id);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="font-bold">TemplateFlow Pay</span>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Тестовый режим
          </span>
        </div>

        <p className="text-sm text-muted">Заказ {order.public_id}</p>
        <ul className="mt-3 space-y-2 border-b border-black/5 pb-4">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between text-sm">
              <span>{i.title}</span>
              <span className="font-semibold">{formatPrice(i.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between">
          <span className="text-muted">К оплате</span>
          <span className="text-2xl font-extrabold">{formatPrice(order.total)}</span>
        </div>

        <PayForm publicId={order.public_id} sig={sig} />

        <p className="mt-5 text-center text-xs leading-relaxed text-muted">
          Это встроенная тестовая платежка. В боевом режиме здесь будет страница
          ЮKassa (PAYMENT_PROVIDER=yookassa).
        </p>
      </div>
    </main>
  );
}
