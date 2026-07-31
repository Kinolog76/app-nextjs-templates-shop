"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icons";

export default function MyPurchasesPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/my/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-[520px] flex-col justify-center px-6 py-14">
        <div className="card p-9">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Icon name="download" className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-extrabold">Мои покупки</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Укажите email, который вы использовали при оплате — мы отправим письмо со
            ссылками на все ваши заказы и файлы.
          </p>

          {sent ? (
            <div className="mt-6 rounded-xl bg-excel-soft p-4 text-sm text-excel">
              Если на этот email были покупки — письмо со ссылками уже в пути. Проверьте
              почту (и папку «Спам»).
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
              <button type="submit" disabled={loading} className="btn-primary mt-4 w-full">
                {loading ? "Отправляем…" : "Получить ссылки"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
