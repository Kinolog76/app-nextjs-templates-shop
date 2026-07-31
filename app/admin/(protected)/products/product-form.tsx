import { Product, ProductImage } from "@/lib/db";
import { deleteSlideAction, saveProductAction } from "@/lib/admin-actions";

export function ProductForm({
  product,
  slides = [],
}: {
  product?: Product;
  slides?: ProductImage[];
}) {
  return (
    <div className="max-w-2xl space-y-6">
      <form action={saveProductAction} className="card space-y-5 p-8">
        {product && <input type="hidden" name="id" value={product.id} />}
        <input type="hidden" name="current_preview" value={product?.preview ?? ""} />
        <input type="hidden" name="current_file" value={product?.file_path ?? ""} />
        <input type="hidden" name="current_file_name" value={product?.file_name ?? ""} />

        <div>
          <label className="mb-1.5 block text-sm font-semibold">Название *</label>
          <input name="title" required defaultValue={product?.title} className="input" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Категория</label>
            <select name="category" defaultValue={product?.category ?? "obsidian"} className="input">
              <option value="obsidian">Obsidian</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Тег (напр. «Финансы»)</label>
            <input name="tag" defaultValue={product?.tag} className="input" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Цена, ₴</label>
            <input name="price" type="number" min="0" defaultValue={product?.price ?? 990} className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Slug (URL)</label>
            <input name="slug" defaultValue={product?.slug} placeholder="автоматически" className="input" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">Короткое описание (карточка)</label>
          <textarea name="description" rows={2} defaultValue={product?.description} className="input" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Описание страницы товара — Markdown
          </label>
          <textarea
            name="long_description"
            rows={10}
            defaultValue={product?.long_description}
            className="input font-mono !text-sm"
            placeholder={"## Что внутри\n\n- Пункт списка\n- **Жирный**, *курсив*\n\n> Цитата"}
          />
          <p className="mt-1.5 text-xs text-muted">
            Поддерживается Markdown: заголовки ##, списки, **жирный**, ссылки, таблицы, цитаты, код.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Превью (карточка в каталоге)</label>
            <input name="preview_file" type="file" accept="image/*,.svg" className="input" />
            {product?.preview && (
              <p className="mt-1.5 text-xs text-muted">Сейчас: {product.preview}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Файл товара (zip)</label>
            <input name="product_file" type="file" className="input" />
            {product?.file_name && (
              <p className="mt-1.5 text-xs text-muted">Сейчас: {product.file_name}</p>
            )}
            <p className="mt-1.5 text-xs text-muted">
              Хранится приватно, отдается только по ссылкам оплаченных заказов. Замена файла =
              обновление для всех покупателей.
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Добавить слайды галереи (можно несколько)
          </label>
          <input name="slide_files" type="file" accept="image/*,.svg" multiple className="input" />
          <p className="mt-1.5 text-xs text-muted">
            Слайды показываются в слайдере на странице товара. Если слайдов нет — показывается превью.
          </p>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium">
          <input
            type="checkbox"
            name="active"
            defaultChecked={product ? product.active === 1 : true}
            className="h-4 w-4 accent-brand"
          />
          Показывать в каталоге
        </label>

        <button type="submit" className="btn-primary">
          {product ? "Сохранить" : "Создать товар"}
        </button>
      </form>

      {product && slides.length > 0 && (
        <div className="card p-8">
          <h2 className="mb-4 text-lg font-bold">Слайды галереи ({slides.length})</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {slides.map((s, i) => (
              <div key={s.id} className="group relative overflow-hidden rounded-xl border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.path} alt={`Слайд ${i + 1}`} className="aspect-[16/10] w-full object-cover" />
                <span className="absolute left-2 top-2 rounded-md bg-black/50 px-2 py-0.5 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <form action={deleteSlideAction} className="absolute right-2 top-2">
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    className="rounded-md bg-red-500 px-2 py-0.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Удалить слайд"
                  >
                    Удалить
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
