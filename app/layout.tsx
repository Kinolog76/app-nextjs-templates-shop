import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";

export const metadata: Metadata = {
  title: "TemplateFlow — шаблоны, которые экономят ваше время",
  description:
    "Профессиональные шаблоны для Obsidian и Excel: управление знаниями, проекты, финансы, аналитика и CRM. Мгновенная доставка, пожизненные обновления, без подписки.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
