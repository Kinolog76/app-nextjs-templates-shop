import Link from "next/link";
import { getDb, Product } from "@/lib/db";
import { ProductCard } from "../product-card";
import { Icon } from "../icons";

function SectionHead({
  icon,
  title,
  subtitle,
  href,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  accent: "brand" | "excel";
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-4">
        {icon}
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
          <p className="mt-1.5 text-muted">{subtitle}</p>
        </div>
      </div>
      <Link
        href={href}
        className={`flex items-center gap-2 font-semibold ${
          accent === "excel" ? "text-excel" : "text-brand"
        } hover:underline`}
      >
        Смотреть все <Icon name="arrowRight" className="h-4.5 w-4.5" />
      </Link>
    </div>
  );
}

export function Showcase() {
  const db = getDb();
  const obsidian = db
    .prepare("SELECT * FROM products WHERE category = 'obsidian' AND active = 1 ORDER BY id LIMIT 3")
    .all() as Product[];
  const excel = db
    .prepare("SELECT * FROM products WHERE category = 'excel' AND active = 1 ORDER BY id LIMIT 3")
    .all() as Product[];

  return (
    <section id="templates" className="mx-auto max-w-[1320px] space-y-20 px-6 pb-24">
      <div>
        <SectionHead
          icon={
            <svg viewBox="0 0 40 40" className="h-12 w-12" aria-hidden>
              <path d="M20 3l13 11-13 23L7 14 20 3z" fill="url(#obs)" />
              <defs>
                <linearGradient id="obs" x1="7" y1="3" x2="33" y2="37">
                  <stop stopColor="#7c5cff" />
                  <stop offset="1" stopColor="#5b3fff" />
                </linearGradient>
              </defs>
            </svg>
          }
          title="Шаблоны Obsidian"
          subtitle="Готовые шаблоны для управления знаниями, проектами и заметками в Obsidian."
          href="/templates?cat=obsidian"
          accent="brand"
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {obsidian.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <div>
        <SectionHead
          icon={
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#22c55e] to-[#15803d] text-xl font-extrabold text-white">
              X
            </span>
          }
          title="Excel таблицы"
          subtitle="Профессиональные таблицы для анализа данных, бюджетирования и автоматизации."
          href="/templates?cat=excel"
          accent="excel"
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {excel.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
