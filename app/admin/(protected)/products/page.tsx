import Link from "next/link";
import { getDb, Product } from "@/lib/db";
import { deleteProductAction } from "@/lib/admin-actions";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function AdminProducts() {
  const products = getDb()
    .prepare("SELECT * FROM products ORDER BY category, id")
    .all() as Product[];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Товары</h1>
        <Link href="/admin/products/new" className="btn-primary !px-5 !py-2.5 text-sm">
          + Новый товар
        </Link>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Товар</th>
              <th className="px-5 py-3 font-semibold">Категория</th>
              <th className="px-5 py-3 font-semibold">Цена</th>
              <th className="px-5 py-3 font-semibold">Файл</th>
              <th className="px-5 py-3 font-semibold">Статус</th>
              <th className="px-5 py-3 font-semibold">Скачиваний</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-black/5">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.preview} alt="" className="h-10 w-16 rounded-md object-cover" />
                    <span className="font-medium">{p.title}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.category === "excel" ? "bg-excel-soft text-excel" : "bg-brand-soft text-brand"
                    }`}
                  >
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold">{formatPrice(p.price)}</td>
                <td className="px-5 py-3 text-muted">{p.file_path || "—"}</td>
                <td className="px-5 py-3">
                  {p.active ? (
                    <span className="text-excel">● активен</span>
                  ) : (
                    <span className="text-muted">○ скрыт</span>
                  )}
                </td>
                <td className="px-5 py-3">{p.downloads}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${p.id}`} className="btn-ghost !px-3 !py-1.5 text-xs">
                      Изменить
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Товар, который уже покупали, при удалении снимается с продажи (ссылки покупателей продолжают работать).
      </p>
    </>
  );
}
