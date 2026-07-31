import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { getDb, Product } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const db = getDb();
  const products = (
    cat === "obsidian" || cat === "excel"
      ? db.prepare("SELECT * FROM products WHERE active = 1 AND category = ? ORDER BY id").all(cat)
      : db.prepare("SELECT * FROM products WHERE active = 1 ORDER BY category, id").all()
  ) as Product[];

  const tabs = [
    { key: undefined, label: "Все шаблоны" },
    { key: "obsidian", label: "Obsidian" },
    { key: "excel", label: "Excel" },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-[1320px] px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Каталог шаблонов</h1>
        <p className="mt-2 text-muted">
          Готовые системы для Obsidian и профессиональные таблицы Excel.
        </p>

        <div className="mt-7 flex gap-2">
          {tabs.map((t) => {
            const active = cat === t.key || (!cat && !t.key);
            return (
              <Link
                key={t.label}
                href={t.key ? `/templates?cat=${t.key}` : "/templates"}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-brand text-white shadow-md shadow-brand/30"
                    : "bg-surface text-muted hover:text-ink"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
