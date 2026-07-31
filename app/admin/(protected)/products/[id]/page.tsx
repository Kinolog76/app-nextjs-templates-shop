import { notFound } from "next/navigation";
import { getDb, Product, ProductImage } from "@/lib/db";
import { ProductForm } from "../product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getDb().prepare("SELECT * FROM products WHERE id = ?").get(Number(id)) as
    | Product
    | undefined;
  if (!product) notFound();

  const slides = getDb()
    .prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort, id")
    .all(product.id) as ProductImage[];

  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold">Редактирование: {product.title}</h1>
      <ProductForm product={product} slides={slides} />
    </>
  );
}
