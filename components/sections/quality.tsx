import { Icon } from "../icons";

const columns = [
  {
    icon: "search",
    title: "Ручной отбор",
    text: "Каждый шаблон проходит строгий отбор и тестирование перед публикацией.",
  },
  {
    icon: "check",
    title: "Практическая польза",
    text: "Создаём шаблоны, которые решают реальные задачи и экономят время.",
  },
  {
    icon: "refresh",
    title: "Регулярные обновления",
    text: "Шаблоны поддерживаются в актуальном состоянии и постепенно улучшаются.",
  },
  {
    icon: "heart",
    title: "Поддержка пользователей",
    text: "Мы всегда на связи и готовы помочь с любыми вопросами.",
  },
];

const stats = [
  { icon: "download", value: "5000+", label: "Скачиваний", note: "Шаблоны скачаны более 5 тысяч раз" },
  { icon: "users", value: "2500+", label: "Пользователей", note: "Доверяют и используют наши шаблоны" },
  { icon: "star", value: "4.9/5", label: "Рейтинг", note: "Средняя оценка пользователей" },
  { icon: "calendar", value: "12+", label: "Месяцев с вами", note: "Развиваемся и создаём лучшие шаблоны" },
];

export function Quality() {
  return (
    <section id="quality" className="mx-auto max-w-[1320px] px-6 pb-24">
      <div className="text-center">
        <span className="pill uppercase tracking-wide">
          <Icon name="shield" className="h-4 w-4" />
          Доверие и качество
        </span>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-[2.6rem] sm:leading-[1.15]">
          Профессиональный подход к каждому шаблону
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Мы уделяем внимание каждой детали, чтобы вы получали действительно полезные
          и качественные продукты
        </p>
      </div>

      <div className="card mt-10 grid gap-10 p-10 sm:grid-cols-2 xl:grid-cols-4">
        {columns.map((c) => (
          <div key={c.title} className="text-center">
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-2 to-brand-3 text-white shadow-lg shadow-brand/25">
              <Icon name={c.icon} className="h-7 w-7" />
            </span>
            <h3 className="mb-2 font-bold">{c.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{c.text}</p>
          </div>
        ))}
      </div>

      {/* Темный статистический блок */}
      <div className="relative mt-8 overflow-hidden rounded-card bg-gradient-to-br from-[#101123] to-[#161631] p-10 text-white lg:p-14">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
          aria-hidden
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d={`M0 ${60 + i * 40} Q 400 ${20 + i * 40}, 800 ${70 + i * 40}`}
              stroke="#fff"
              fill="none"
            />
          ))}
        </svg>

        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85">
              <Icon name="layers" className="h-3.5 w-3.5" />
              Статистика
            </span>
            <h3 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
              Нам доверяют тысячи пользователей
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-white/60">
              Присоединяйтесь к сообществу продуктивных людей, которые уже улучшили свою
              работу с нашими шаблонами.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 xl:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`text-center ${i > 0 ? "xl:border-l xl:border-white/10" : ""}`}
              >
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-3/30 text-[#b7a6ff]">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <div className="text-3xl font-extrabold">{s.value}</div>
                <div className="mt-1 font-semibold text-white/90">{s.label}</div>
                <div className="mt-1.5 text-xs leading-relaxed text-white/50">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
