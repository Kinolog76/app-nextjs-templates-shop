"use client";

import Link from "next/link";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/format";

export type ProductCardData = {
  id: number;
  slug: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  price: number;
  preview: string;
};

export function ProductCard({ product, showPrice = true }: { product: ProductCardData; showPrice?: boolean }) {
  const { add, has } = useCart();
  const inCart = has(product.id);
  const isExcel = product.category === "excel";

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/templates/${product.slug}`} className="block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.preview}
          alt={product.title}
          className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <span
          className={`mb-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            isExcel ? "bg-excel-soft text-excel" : "bg-brand-soft text-brand"
          }`}
        >
          {product.tag}
        </span>
        <Link href={`/templates/${product.slug}`}>
          <h3 className="text-lg font-bold transition group-hover:text-brand">{product.title}</h3>
        </Link>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{product.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <Link href={`/templates/${product.slug}`} className="btn-ghost">
            Подробнее
          </Link>
          {showPrice && (
            <div className="flex items-center gap-3">
              <span className="font-bold">{formatPrice(product.price)}</span>
              <button
                onClick={() => add(product)}
                disabled={inCart}
                className="btn-primary !px-4 !py-2 text-sm disabled:cursor-default"
              >
                {inCart ? "В корзине ✓" : "Купить"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
