"use client";

import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/components/cart-context";

export function BuyButton({ product }: { product: CartItem }) {
  const { add, has } = useCart();
  const router = useRouter();
  const inCart = has(product.id);

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="btn-primary"
        onClick={() => {
          add(product);
          router.push("/cart");
        }}
      >
        Купить сейчас
      </button>
      <button
        className="btn-secondary"
        disabled={inCart}
        onClick={() => add(product)}
      >
        {inCart ? "В корзине ✓" : "В корзину"}
      </button>
    </div>
  );
}
