import Link from "next/link";
import { getDb } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const db = getDb();
  const revenue = (db.prepare("SELECT COALESCE(SUM(total),0) AS v FROM orders WHERE status='paid'").get() as { v: number }).v;
  const paidOrders = (db.prepare("SELECT COUNT(*) AS v FROM orders WHERE status='paid'").get() as { v: number }).v;
  const pendingOrders = (db.prepare("SELECT COUNT(*) AS v FROM orders WHERE status='pending'").get() as { v: number }).v;
  const products = (db.prepare("SELECT COUNT(*) AS v FROM products WHERE active=1").get() as { v: number }).v;
  const downloads = (db.prepare("SELECT COALESCE(SUM(downloads),0) AS v FROM products").get() as { v: number }).v;

  const top = db
    .prepare(
      `SELECT p.title, COUNT(oi.id) AS sales, COALESCE(SUM(oi.price),0) AS revenue
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id AND o.status = 'paid'
       JOIN products p ON p.id = oi.product_id
       GROUP BY p.id ORDER BY sales DESC LIMIT 5`
    )
    .all() as { title: string; sales: number; revenue: number }[];

  const stats = [
    { label: "Выручка", value: formatPrice(revenue) },
    { label: "Оплаченных заказов", value: String(paidOrders) },
    { label: "Ожидают оплаты", value: String(pendingOrders) },
    { label: "Активных товаров", value: String(products) },
    { label: "Скачиваний", value: String(downloads) },
  ];

  return (
    <>
      <h1 className="text-2xl font-extrabold">Дашборд</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-sm text-muted">{s.label}</div>
            <div className="mt-1.5 text-2xl font-extrabold">{s.value}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold">Топ продаж</h2>
      <div className="card mt-4 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Товар</th>
              <th className="px-5 py-3 font-semibold">Продаж</th>
              <th className="px-5 py-3 font-semibold">Выручка</th>
            </tr>
          </thead>
          <tbody>
            {top.length === 0 && (
              <tr><td colSpan={3} className="px-5 py-6 text-center text-muted">Продаж пока нет</td></tr>
            )}
            {top.map((t) => (
              <tr key={t.title} className="border-t border-black/5">
                <td className="px-5 py-3 font-medium">{t.title}</td>
                <td className="px-5 py-3">{t.sales}</td>
                <td className="px-5 py-3">{formatPrice(t.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/admin/products/new" className="btn-primary">+ Новый товар</Link>
        <Link href="/admin/orders" className="btn-secondary">Заказы</Link>
      </div>
    </>
  );
}
