"use client";

import Link from "next/link";
import { LogoMark } from "./logo";
import { Icon } from "./icons";
import { useCart } from "./cart-context";

const nav = [
  { href: "/templates", label: "Шаблоны" },
  { href: "/templates?cat=obsidian", label: "Obsidian" },
  { href: "/templates?cat=excel", label: "Excel" },
  { href: "/#trust", label: "Подборки" },
  { href: "/#why", label: "Отзывы" },
  { href: "/my", label: "Поддержка" },
];

export function Header() {
  const { items } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[1.35rem] font-bold tracking-tight">TemplateFlow</span>
        </Link>

        <nav className="mx-auto hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="text-[0.95rem] font-medium text-ink/80 transition hover:text-brand"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Link
            href="/cart"
            className="relative rounded-xl p-2.5 text-ink/70 transition hover:bg-brand-soft hover:text-brand"
            aria-label="Корзина"
          >
            <Icon name="cart" className="h-6 w-6" />
            {items.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[0.7rem] font-bold text-white">
                {items.length}
              </span>
            )}
          </Link>
          <Link href="/my" className="btn-ghost hidden sm:inline-flex">
            Войти
          </Link>
          <Link
            href="/templates"
            className="btn-primary hidden !px-5 !py-2.5 text-sm sm:inline-flex"
          >
            Создать аккаунт
          </Link>
        </div>
      </div>
    </header>
  );
}
