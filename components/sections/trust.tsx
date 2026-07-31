import Link from "next/link";
import { Icon } from "../icons";
import { LogoMark } from "../logo";

const logos = ["mindful studio", "NEXORA", "FlowLab", "DATAWAVE", "LeadCraft", "STRUCTURA"];

const trustCards = [
  {
    icon: "download",
    color: "bg-brand-soft text-brand",
    title: "5000+ скачиваний",
    text: "Наши шаблоны помогают тысячам пользователей работать быстрее и системнее.",
  },
  {
    icon: "star",
    color: "bg-brand-soft text-brand-2",
    title: "4.9/5 рейтинг",
    text: "Высокая оценка качества, пользы и удобства шаблонов.",
  },
  {
    icon: "shield",
    color: "bg-excel-soft text-excel",
    title: "30 дней гарантия",
    text: "Если шаблон не подойдет — вернем деньги без лишних вопросов.",
  },
  {
    icon: "infinity",
    color: "bg-excel-soft text-excel",
    title: "Пожизненные обновления",
    text: "Все будущие улучшения и обновления входят в стоимость.",
  },
  {
    icon: "lock",
    color: "bg-brand-soft text-brand",
    title: "Безопасная оплата",
    text: "Оплата защищена. Поддерживаются карты и популярные платежные сервисы.",
  },
  {
    icon: "zap",
    color: "bg-brand-soft text-brand-2",
    title: "Мгновенная доставка",
    text: "Сразу после оплаты вы получаете доступ к файлам и инструкциям.",
  },
];

const whyUs = [
  "Практичные шаблоны из реального опыта",
  "Экономят время и повышают продуктивность",
  "Подходят для бизнеса и личных задач",
  "Регулярные обновления и новые шаблоны",
  "Без подписки — платите один раз",
];

function BannerGem({ className, from, to }: { className: string; from: string; to: string }) {
  const id = `bg${from.slice(1)}`;
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <path d="M30 3l21 18-21 36-21-36L30 3z" fill={`url(#${id})`} />
      <path d="M30 3l21 18H9L30 3z" fill="#fff" opacity="0.3" />
      <defs>
        <linearGradient id={id} x1="9" y1="3" x2="51" y2="57">
          <stop stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Trust() {
  return (
    <section id="trust" className="mx-auto max-w-[1320px] space-y-7 px-6 pb-24">
      {/* Нам доверяют */}
      <div className="card px-8 py-10 text-center">
        <h2 className="mb-8 text-2xl font-extrabold tracking-tight">Нам доверяют</h2>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {logos.map((l, i) => (
            <span key={l} className="flex items-center gap-10">
              <span className="text-lg font-bold tracking-wide text-[#64748b]">{l}</span>
              {i < logos.length - 1 && <span className="hidden h-6 w-px bg-black/10 lg:block" />}
            </span>
          ))}
        </div>
      </div>

      {/* 6 trust-карточек */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {trustCards.map((c) => (
          <div key={c.title} className="card flex items-start gap-5 p-8">
            <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${c.color}`}>
              <Icon name={c.icon} className="h-8 w-8" />
            </span>
            <div>
              <h3 className="mb-2 text-lg font-bold">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Почему выбирают нас + баннер */}
      <div id="why" className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <div className="card p-8">
          <h3 className="mb-6 text-xl font-extrabold">Почему выбирают нас?</h3>
          <ul>
            {whyUs.map((w, i) => (
              <li
                key={w}
                className={`flex items-center gap-3 py-3.5 text-sm font-medium ${
                  i < whyUs.length - 1 ? "border-b border-black/5" : ""
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="card relative overflow-hidden bg-gradient-to-br from-[#f4f1ff] via-white to-[#ece7ff] p-8 lg:p-10">
          <BannerGem className="absolute -right-2 top-6 h-32 w-32 drop-shadow-xl" from="#7c5cff" to="#5b3fff" />
          <BannerGem className="absolute bottom-6 right-40 h-14 w-14" from="#4ade80" to="#16a34a" />
          <BannerGem className="absolute right-48 top-10 h-8 w-8 opacity-60" from="#c4b5fd" to="#a78bfa" />
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden>
            <path d="M-20 260 Q 300 140, 620 240" stroke="#c4b5fd" fill="none" strokeWidth="1.5" />
            <path d="M-20 300 Q 320 180, 620 290" stroke="#ddd6fe" fill="none" strokeWidth="1.5" />
          </svg>

          <div className="relative max-w-md">
            <LogoMark className="mb-5 h-9 w-9" />
            <h3 className="text-2xl font-extrabold leading-snug sm:text-[1.7rem]">
              Сосредоточьтесь на главном —{" "}
              <span className="bg-gradient-to-r from-brand to-[#4f6bff] bg-clip-text text-transparent">
                мы позаботимся о структуре.
              </span>
            </h3>
            <p className="mt-4 leading-relaxed text-muted">
              Готовые шаблоны помогают быстрее запускать работу, наводить порядок в задачах
              и принимать решения на основе данных.
            </p>
          </div>
        </div>
      </div>

      {/* Нижний CTA */}
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-[#5b3fff] to-[#4f6bff] p-8 text-white lg:p-10">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-15" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden>
          <path d="M-20 180 Q 400 40, 820 160" stroke="#fff" fill="none" strokeWidth="1.5" />
          <path d="M-20 220 Q 420 90, 820 210" stroke="#fff" fill="none" strokeWidth="1.5" />
          <circle cx="700" cy="40" r="90" stroke="#fff" fill="none" />
        </svg>
        <div className="relative flex flex-wrap items-center gap-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <LogoMark className="h-9 w-9" />
          </span>
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold sm:text-3xl">
              Готовы сэкономить время уже сегодня?
            </h3>
            <p className="mt-1.5 text-white/80">Выберите шаблон и начните работать эффективнее.</p>
          </div>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-brand shadow-lg transition hover:-translate-y-0.5"
          >
            Смотреть все шаблоны <Icon name="arrowRight" className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
