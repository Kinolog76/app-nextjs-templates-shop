"use client";

import { useState } from "react";

export function PayForm({ publicId, sig }: { publicId: string; sig: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pay/mock-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId, sig }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка оплаты");
      window.location.href = data.redirect;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="space-y-3">
        <input className="input" placeholder="Номер карты" defaultValue="4242 4242 4242 4242" />
        <div className="flex gap-3">
          <input className="input" placeholder="ММ/ГГ" defaultValue="12/28" />
          <input className="input" placeholder="CVC" defaultValue="123" />
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      <button onClick={pay} disabled={loading} className="btn-primary mt-5 w-full">
        {loading ? "Обработка…" : "Оплатить"}
      </button>
    </div>
  );
}
