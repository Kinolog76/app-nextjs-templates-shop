import { getDb, Order } from "@/lib/db";
import { markOrderPaidAction } from "@/lib/admin-actions";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

type OrderRow = Order & { items: string };

export default function AdminOrders() {
  const orders = getDb()
    .prepare(
      `SELECT o.*, GROUP_CONCAT(oi.title, ', ') AS items
       FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
       GROUP BY o.id ORDER BY o.id DESC LIMIT 200`
    )
    .all() as OrderRow[];

  const badge: Record<string, string> = {
    paid: "bg-excel-soft text-excel",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-50 text-red-500",
  };
  const label: Record<string, string> = {
    paid: "оплачен",
    pending: "ожидает",
    cancelled: "отменен",
  };

  return (
    <>
      <h1 className="text-2xl font-extrabold">Заказы</h1>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">№</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Состав</th>
              <th className="px-5 py-3 font-semibold">Сумма</th>
              <th className="px-5 py-3 font-semibold">Статус</th>
              <th className="px-5 py-3 font-semibold">Создан</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-6 text-center text-muted">Заказов пока нет</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-black/5 align-top">
                <td className="px-5 py-3 font-mono font-semibold">{o.public_id}</td>
                <td className="px-5 py-3">{o.email}</td>
                <td className="max-w-[260px] px-5 py-3 text-muted">{o.items}</td>
                <td className="px-5 py-3 font-semibold">{formatPrice(o.total)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge[o.status]}`}>
                    {label[o.status]}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted">{o.created_at}</td>
                <td className="px-5 py-3">
                  {o.status === "pending" && (
                    <form action={markOrderPaidAction}>
                      <input type="hidden" name="public_id" value={o.public_id} />
                      <button className="btn-ghost !px-3 !py-1.5 text-xs">
                        Отметить оплаченным
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        «Отметить оплаченным» — ручная доставка: выдает ссылки и шлет письмо (например, при
        оплате переводом).
      </p>
    </>
  );
}
