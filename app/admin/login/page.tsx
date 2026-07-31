"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/admin-actions";
import { LogoMark } from "@/components/logo";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <form action={action} className="card w-full max-w-sm p-8">
        <div className="mb-6 flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <span className="text-lg font-bold">TemplateFlow · Админка</span>
        </div>
        <label className="mb-2 block text-sm font-semibold">Пароль администратора</label>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="input"
          placeholder="••••••••"
        />
        {state?.error && <p className="mt-3 text-sm text-red-500">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn-primary mt-5 w-full">
          {pending ? "Проверяем…" : "Войти"}
        </button>
      </form>
    </main>
  );
}
