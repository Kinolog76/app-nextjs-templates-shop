import Link from "next/link";
import { Icon } from "../icons";

function Gem({ className, from, to }: { className: string; from: string; to: string }) {
  const id = `g${from.slice(1)}${to.slice(1)}`;
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path d="M20 2l14 12-14 24L6 14 20 2z" fill={`url(#${id})`} opacity="0.9" />
      <path d="M20 2l14 12H6L20 2z" fill="#fff" opacity="0.25" />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="40" y2="40">
          <stop stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GraphView() {
  const nodes = [
    [30, 30, 5], [80, 18, 4], [130, 42, 6], [178, 22, 4], [50, 75, 7],
    [110, 88, 5], [160, 70, 4], [200, 60, 5], [25, 120, 4], [85, 130, 6],
    [145, 118, 4], [190, 108, 5], [60, 160, 4], [120, 165, 5], [175, 150, 4],
  ] as const;
  const edges = [
    [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [6, 7], [4, 8], [8, 9],
    [9, 10], [10, 11], [9, 12], [12, 13], [13, 14], [5, 10], [2, 6],
  ];
  return (
    <svg viewBox="0 0 220 190" className="h-full w-full">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="#c4b5fd" strokeWidth="1"
        />
      ))}
      {nodes.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 3 === 0 ? "#5b3fff" : "#8b7cf6"} />
      ))}
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface to-white">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-6 pb-16 pt-14 lg:grid-cols-2 lg:gap-8">
        {/* Левая часть */}
        <div className="fade-up">
          <span className="pill">
            <Icon name="badge" className="h-4 w-4" />
            Готовые решения для продуктивности
          </span>

          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.08] tracking-tight sm:text-[3.4rem]">
            Шаблоны, которые
            <br />
            <span className="bg-gradient-to-r from-brand to-[#4f6bff] bg-clip-text text-transparent">
              экономят ваше время
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Профессиональные шаблоны для Obsidian и Excel, которые помогут вам работать
            эффективнее, системнее и достигать большего.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/templates" className="btn-primary">
              Смотреть шаблоны
              <Icon name="arrowRight" className="h-4.5 w-4.5" />
            </Link>
            <Link href="/#quality" className="btn-secondary">
              Как это работает
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-ink/75">
            <span className="flex items-center gap-2">
              <Icon name="zap" className="h-4.5 w-4.5 text-brand" /> Мгновенная загрузка
            </span>
            <span className="flex items-center gap-2">
              <Icon name="refresh" className="h-4.5 w-4.5 text-brand" /> Постоянные обновления
            </span>
            <span className="flex items-center gap-2">
              <Icon name="shield" className="h-4.5 w-4.5 text-brand" /> Без подписки
            </span>
          </div>
        </div>

        {/* Правая часть — mockup-композиция */}
        <div className="relative hidden min-h-[520px] lg:block">
          <div className="absolute -left-6 top-6 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-56 w-56 rounded-full bg-excel/10 blur-3xl" />

          <Gem className="absolute -top-2 left-10 h-9 w-9" from="#a5b4fc" to="#818cf8" />
          <Gem className="absolute right-2 top-4 h-8 w-8" from="#c4b5fd" to="#a78bfa" />
          <Gem className="absolute right-8 top-40 h-14 w-14 drop-shadow-lg" from="#6c4dff" to="#5b3fff" />
          <Gem className="absolute bottom-24 left-2 h-9 w-9" from="#4ade80" to="#16a34a" />

          {/* Obsidian card */}
          <div className="card absolute left-8 top-10 w-[420px] p-5 shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">Obsidian шаблон</span>
              <span className="flex gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-black/10" />
                <i className="h-2.5 w-2.5 rounded-full bg-black/10" />
                <i className="h-2.5 w-2.5 rounded-full bg-black/10" />
              </span>
            </div>
            <div className="flex gap-4">
              <div className="w-28 shrink-0 space-y-2 rounded-xl bg-surface p-3 text-[0.72rem] font-medium text-muted">
                {["Вложения", "Заметки", "Проекты", "Ресурсы", "Архив", "Шаблоны"].map((s) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-sm bg-brand/50" /> {s}
                  </div>
                ))}
              </div>
              <div className="h-44 flex-1">
                <GraphView />
              </div>
            </div>
          </div>

          {/* Excel card */}
          <div className="card absolute bottom-6 right-0 w-[340px] p-5 shadow-lift">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-excel font-bold text-white">
                X
              </span>
              <span className="font-semibold">Excel таблица</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-black/5 p-3">
                <div className="mb-2 text-[0.7rem] font-semibold text-muted">Обзор проекта</div>
                <svg viewBox="0 0 80 80" className="mx-auto h-20 w-20">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#e8f7ee" strokeWidth="12" />
                  <circle
                    cx="40" cy="40" r="30" fill="none" stroke="#16a34a" strokeWidth="12"
                    strokeDasharray="141 188" strokeLinecap="round" transform="rotate(-90 40 40)"
                  />
                  <text x="40" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill="#101223">
                    75%
                  </text>
                </svg>
              </div>
              <div className="rounded-xl border border-black/5 p-3">
                <div className="mb-2 text-[0.7rem] font-semibold text-muted">Обзор задач</div>
                <svg viewBox="0 0 90 80" className="h-20 w-full">
                  {[18, 34, 12, 40, 26, 48, 30].map((h, i) => (
                    <rect
                      key={i} x={6 + i * 12} y={70 - h} width="7" height={h} rx="2"
                      fill={i % 2 ? "#4ade80" : "#16a34a"}
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="card absolute bottom-40 left-0 flex items-center gap-3 px-5 py-4 shadow-lift">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-excel-soft text-excel">
              <Icon name="clock" className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xs text-muted">Экономия</div>
              <div className="font-bold leading-tight">10+ часов</div>
              <div className="text-xs text-muted">каждую неделю</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
