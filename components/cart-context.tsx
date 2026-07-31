"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: number;
  slug: string;
  title: string;
  price: number;
  category: string;
};

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: number) => void;
  clear: () => void;
  has: (id: number) => boolean;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "tf_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  const add = (item: CartItem) =>
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const has = (id: number) => items.some((i) => i.id === id);
  const total = items.reduce((s, i) => s + i.price, 0);

  return <Ctx.Provider value={{ items, add, remove, clear, has, total }}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
