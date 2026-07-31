import Link from "next/link";
import { LogoMark } from "./logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-surface">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <span className="text-lg font-bold">TemplateFlow</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Профессиональные шаблоны для Obsidian и Excel, которые экономят ваше время.
          </p>
        </div>
        <div>
          <div className="mb-4 text-sm font-semibold">Каталог</div>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/templates?cat=obsidian" className="hover:text-brand">Шаблоны Obsidian</Link></li>
            <li><Link href="/templates?cat=excel" className="hover:text-brand">Excel таблицы</Link></li>
            <li><Link href="/templates" className="hover:text-brand">Все шаблоны</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-4 text-sm font-semibold">Покупателям</div>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/my" className="hover:text-brand">Мои покупки</Link></li>
            <li><Link href="/#trust" className="hover:text-brand">Гарантия 30 дней</Link></li>
            <li><Link href="/#why" className="hover:text-brand">Почему мы</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-4 text-sm font-semibold">Поддержка</div>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><a href="mailto:support@templateflow.local" className="hover:text-brand">support@templateflow.local</a></li>
            <li><Link href="/admin" className="hover:text-brand">Админка</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} TemplateFlow. Все права защищены.
      </div>
    </footer>
  );
}
