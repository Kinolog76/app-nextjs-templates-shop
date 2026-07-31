import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDb, FILES_STORAGE, OrderItem, Order, Product } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const db = getDb();

  const item = db
    .prepare("SELECT * FROM order_items WHERE download_token = ?")
    .get(token) as OrderItem | undefined;
  if (!item) return NextResponse.json({ error: "Ссылка недействительна" }, { status: 404 });

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(item.order_id) as Order;
  if (order.status !== "paid") {
    return NextResponse.json({ error: "Заказ не оплачен" }, { status: 403 });
  }

  const product = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(item.product_id) as Product | undefined;
  if (!product || !product.file_path) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
  }

  const filePath = path.join(FILES_STORAGE, path.basename(product.file_path));
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
  }

  db.prepare("UPDATE order_items SET downloads = downloads + 1 WHERE id = ?").run(item.id);
  db.prepare("UPDATE products SET downloads = downloads + 1 WHERE id = ?").run(product.id);

  const data = fs.readFileSync(filePath);
  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
        product.file_name || path.basename(filePath)
      )}`,
      "Content-Length": String(data.length),
    },
  });
}
