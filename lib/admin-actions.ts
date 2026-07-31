"use server";

import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getDb, FILES_STORAGE } from "./db";
import { ADMIN_COOKIE, checkPassword, isAdmin, makeSessionToken } from "./auth";

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) {
    return { error: "Неверный пароль" };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, makeSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

function slugify(s: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
    й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
    у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y",
    ь: "", э: "e", ю: "yu", я: "ya",
  };
  return s
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function saveUpload(file: File, dir: string, prefix: string): Promise<string> {
  const ext = path.extname(file.name) || "";
  const name = `${prefix}-${Date.now()}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, name), buf);
  return name;
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();

  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "obsidian");
  const tag = String(formData.get("tag") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const longDescription = String(formData.get("long_description") || "").trim();
  const price = Math.max(0, Math.round(Number(formData.get("price") || 0)));
  const active = formData.get("active") ? 1 : 0;
  let slug = String(formData.get("slug") || "").trim() || slugify(title);

  if (!title) throw new Error("Название обязательно");

  // превью-картинка → public/previews (публично), файл товара → storage/files (приватно)
  let preview = String(formData.get("current_preview") || "");
  const previewFile = formData.get("preview_file") as File | null;
  if (previewFile && previewFile.size > 0) {
    const dir = path.join(process.cwd(), "public", "previews");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    preview = "/previews/" + (await saveUpload(previewFile, dir, slug || "preview"));
  }

  let filePath = String(formData.get("current_file") || "");
  let fileName = String(formData.get("current_file_name") || "");
  const productFile = formData.get("product_file") as File | null;
  if (productFile && productFile.size > 0) {
    filePath = await saveUpload(productFile, FILES_STORAGE, slug || "file");
    fileName = productFile.name;
  }

  let productId = id;
  if (id) {
    db.prepare(
      `UPDATE products SET slug=?, title=?, category=?, tag=?, description=?, long_description=?,
       price=?, preview=?, file_path=?, file_name=?, active=?, updated_at=datetime('now') WHERE id=?`
    ).run(slug, title, category, tag, description, longDescription, price, preview, filePath, fileName, active, id);
  } else {
    const exists = db.prepare("SELECT 1 FROM products WHERE slug = ?").get(slug);
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;
    productId = db
      .prepare(
        `INSERT INTO products (slug, title, category, tag, description, long_description, price, preview, file_path, file_name, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(slug, title, category, tag, description, longDescription, price, preview, filePath, fileName, active)
      .lastInsertRowid as number;
  }

  // слайды галереи → public/slides, записи в product_images
  const slideFiles = formData.getAll("slide_files") as File[];
  if (slideFiles.some((f) => f && f.size > 0)) {
    const dir = path.join(process.cwd(), "public", "slides");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const maxSort = (
      db.prepare("SELECT COALESCE(MAX(sort),0) AS m FROM product_images WHERE product_id = ?").get(productId) as { m: number }
    ).m;
    let sort = maxSort;
    const insertImage = db.prepare(
      "INSERT INTO product_images (product_id, path, sort) VALUES (?, ?, ?)"
    );
    for (const f of slideFiles) {
      if (!f || f.size === 0) continue;
      const name = await saveUpload(f, dir, `${slug || "slide"}-${++sort}`);
      insertImage.run(productId, "/slides/" + name, sort);
    }
  }

  revalidatePath("/");
  revalidatePath("/templates");
  redirect(`/admin/products/${productId}`);
}

export async function deleteSlideAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const db = getDb();
  const img = db.prepare("SELECT * FROM product_images WHERE id = ?").get(id) as
    | { id: number; product_id: number; path: string }
    | undefined;
  if (img) {
    db.prepare("DELETE FROM product_images WHERE id = ?").run(id);
    const file = path.join(process.cwd(), "public", "slides", path.basename(img.path));
    if (img.path.startsWith("/slides/") && fs.existsSync(file)) fs.unlinkSync(file);
    revalidatePath(`/admin/products/${img.product_id}`);
    revalidatePath("/templates");
  }
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const db = getDb();
  const used = db.prepare("SELECT 1 FROM order_items WHERE product_id = ? LIMIT 1").get(id);
  if (used) {
    // товар покупали — не удаляем (сломались бы доставки), а снимаем с продажи
    db.prepare("UPDATE products SET active = 0 WHERE id = ?").run(id);
  } else {
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
  }
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/templates");
}

export async function markOrderPaidAction(formData: FormData) {
  await requireAdmin();
  const publicId = String(formData.get("public_id") || "");
  const { getOrderByPublicId, markOrderPaid } = await import("./orders");
  const order = getOrderByPublicId(publicId);
  if (order && order.status === "pending") await markOrderPaid(order, "manual-admin");
  revalidatePath("/admin/orders");
}
