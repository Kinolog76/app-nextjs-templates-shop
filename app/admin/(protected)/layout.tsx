import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/admin-actions";
import { LogoMark } from "@/components/logo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-8 px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="font-bold">Админка</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-muted">
            <Link href="/admin" className="hover:text-brand">Дашборд</Link>
            <Link href="/admin/products" className="hover:text-brand">Товары</Link>
            <Link href="/admin/orders" className="hover:text-brand">Заказы</Link>
            <Link href="/" className="hover:text-brand">← Сайт</Link>
          </nav>
          <form action={logoutAction} className="ml-auto">
            <button className="btn-ghost">Выйти</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-6 py-10">{children}</main>
    </div>
  );
}
