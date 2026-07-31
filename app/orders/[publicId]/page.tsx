import { notFound } from "next/navigation";
import Link from "next/link";
import crypto from "crypto";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icons";
import { getOrderByPublicId, getOrderItems } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { publicId } = await params;
  const { key } = await searchParams;
  const order = getOrderByPublicId(publicId);
  if (!order || !key || !safeEqual(key, order.access_key)) notFound();

  const items = getOrderItems(order.id);
  const paid = order.status === "paid";

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-[760px] px-6 py-14">
        <div className="card p-9 text-center">
          {paid ? (
            <>
              <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-excel-soft text-excel">
                <Icon name="check" className="h-8 w-8" />
              </span>
              <h1 className="text-2xl font-extrabold sm:text-3xl">Заказ оплачен — спасибо!</h1>
              <p className="mt-3 text-muted">
                Заказ <b>{order.public_id}</b> на {formatPrice(order.total)}. Ссылки также
                отправлены на <b>{order.email}</b>.
              </p>
            </>
          ) : (
            <>
              <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Icon name="clock" className="h-8 w-8" />
              </span>
              <h1 className="text-2xl font-extrabold sm:text-3xl">Ожидаем оплату</h1>
              <p className="mt-3 text-muted">
                Заказ <b>{order.public_id}</b> создан, но еще не оплачен. Если вы уже оплатили —
                обновите страницу через минуту.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {items.map((i) => (
            <div key={i.id} className="card flex flex-wrap items-center gap-4 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon name="file" className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <div className="font-bold">{i.title}</div>
                <div className="text-sm text-muted">{formatPrice(i.price)}</div>
              </div>
              {paid && i.download_token ? (
                <a href={`/api/download/${i.download_token}`} className="btn-primary !px-5 !py-2.5 text-sm">
                  <Icon name="download" className="h-4.5 w-4.5" /> Скачать
                </a>
              ) : (
                <span className="text-sm text-muted">Доступно после оплаты</span>
              )}
            </div>
          ))}
        </div>

        {paid && (
          <p className="mt-8 rounded-2xl bg-brand-soft/60 p-5 text-center text-sm leading-relaxed text-ink/75">
            Сохраните ссылку на эту страницу — она бессрочная. Когда мы обновляем шаблон,
            по тем же ссылкам вы скачиваете актуальную версию бесплатно.
          </p>
        )}

        <div className="mt-8 text-center">
          <Link href="/templates" className="font-semibold text-brand hover:underline">
            ← Вернуться в каталог
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
