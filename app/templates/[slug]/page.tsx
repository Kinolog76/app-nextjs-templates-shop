import { notFound } from "next/navigation";
import { marked } from "marked";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icons";
import { ProductSlider } from "@/components/product-slider";
import { getDb, Product, ProductImage } from "@/lib/db";
import { BuyButton } from "./buy-button";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();
  const product = db
    .prepare("SELECT * FROM products WHERE slug = ? AND active = 1")
    .get(slug) as Product | undefined;
  if (!product) notFound();

  const images = db
    .prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort, id")
    .all(product.id) as ProductImage[];
  const slides = images.length > 0 ? images.map((i) => i.path) : [product.preview];

  const descriptionHtml = await marked.parse(product.long_description || "");
  const isExcel = product.category === "excel";
  const guarantees = [
    { icon: "zap", text: "Мгновенная доставка на email после оплаты" },
    { icon: "infinity", text: "Пожизненные обновления шаблона" },
    { icon: "shield", text: "Гарантия возврата 30 дней" },
    { icon: "lock", text: "Безопасная оплата картой" },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-[1100px] px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <ProductSlider slides={slides} alt={product.title} />

          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                isExcel ? "bg-excel-soft text-excel" : "bg-brand-soft text-brand"
              }`}
            >
              {product.tag}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">{product.title}</h1>
            <p className="mt-4 leading-relaxed text-muted">{product.description}</p>

            <div className="mt-7 text-3xl font-extrabold">{formatPrice(product.price)}</div>
            <div className="mt-5">
              <BuyButton
                product={{
                  id: product.id,
                  slug: product.slug,
                  title: product.title,
                  price: product.price,
                  category: product.category,
                }}
              />
            </div>

            <ul className="mt-8 space-y-3.5">
              {guarantees.map((g) => (
                <li key={g.text} className="flex items-center gap-3 text-sm font-medium text-ink/80">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Icon name={g.icon} className="h-4.5 w-4.5" />
                  </span>
                  {g.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {product.long_description && (
          <section className="card mt-12 p-8 lg:p-10">
            <h2 className="mb-6 text-xl font-extrabold">О шаблоне</h2>
            <div className="md-content" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
