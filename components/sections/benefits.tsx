import { Icon } from "../icons";

const items = [
  {
    icon: "clock",
    color: "text-brand bg-brand-soft",
    title: "Экономия времени",
    text: "Готовые решения вместо рутины. Сосредоточьтесь на важном.",
  },
  {
    icon: "layers",
    color: "text-[#3b6cff] bg-[#e9efff]",
    title: "Готовая структура",
    text: "Проверенные системы и продуманные шаблоны из практики.",
  },
  {
    icon: "sliders",
    color: "text-excel bg-excel-soft",
    title: "Легко настроить",
    text: "Гибкая настройка под ваши задачи и стиль работы процесса.",
  },
  {
    icon: "users",
    color: "text-[#f59e0b] bg-[#fef3e2]",
    title: "Для бизнеса и личного",
    text: "Подходит для команды, предпринимателей и личной продуктивности.",
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-[1320px] px-6 pb-20">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((b) => (
          <div key={b.title} className="card p-7 transition hover:-translate-y-1 hover:shadow-lift">
            <span className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${b.color}`}>
              <Icon name={b.icon} className="h-7 w-7" />
            </span>
            <h3 className="mb-2 text-lg font-bold">{b.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
