"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icons";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, remove, total } = useCart();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productIds: items.map((i) => i.id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка оформления заказа");
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-[900px] px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">Корзина</h1>

        {items.length === 0 ? (
          <div className="card mt-8 p-12 text-center">
            <p className="text-muted">Корзина пуста.</p>
            <Link href="/templates" className="btn-primary mt-6 inline-flex">
              Смотреть шаблоны
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              {items.map((i) => (
                <div key={i.id} className="card flex items-center gap-4 p-5">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-white ${
                      i.category === "excel" ? "bg-excel" : "bg-brand"
                    }`}
                  >
                    {i.category === "excel" ? "X" : "◆"}
                  </span>
                  <div className="flex-1">
                    <Link href={`/templates/${i.slug}`} className="font-semibold hover:text-brand">
                      {i.title}
                    </Link>
                    <div className="text-sm text-muted">
                      {i.category === "excel" ? "Excel таблица" : "Obsidian шаблон"}
                    </div>
                  </div>
                  <span className="font-bold">{formatPrice(i.price)}</span>
                  <button
                    onClick={() => remove(i.id)}
                    className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Удалить"
                  >
                    <Icon name="trash" className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={checkout} className="card h-fit p-7">
              <h2 className="text-lg font-bold">Оформление</h2>
              <p className="mt-2 text-sm text-muted">
                Ссылки на скачивание придут на этот email сразу после оплаты.
              </p>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-4"
              />
              <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
                <span className="text-muted">Итого</span>
                <span className="text-xl font-extrabold">{formatPrice(total)}</span>
              </div>
              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
                {loading ? "Создаем заказ…" : "Перейти к оплате"}
              </button>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <Icon name="lock" className="h-3.5 w-3.5" /> Безопасная оплата · Гарантия 30 дней
              </p>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
