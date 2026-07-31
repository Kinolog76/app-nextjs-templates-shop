import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const FILES_DIR = path.join(process.cwd(), "storage", "files");
const UPLOADS_DIR = path.join(process.cwd(), "storage", "uploads");

for (const dir of [DATA_DIR, FILES_DIR, UPLOADS_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function createDb(): Database.Database {
  const db = new Database(path.join(DATA_DIR, "shop.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('obsidian','excel')),
      tag TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      long_description TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL DEFAULT 0,
      preview TEXT NOT NULL DEFAULT '',
      file_path TEXT NOT NULL DEFAULT '',
      file_name TEXT NOT NULL DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      downloads INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_id TEXT NOT NULL UNIQUE,
      access_key TEXT NOT NULL,
      email TEXT NOT NULL,
      total INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
      provider TEXT NOT NULL DEFAULT 'mock',
      provider_payment_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      paid_at TEXT
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id),
      title TEXT NOT NULL,
      price INTEGER NOT NULL,
      download_token TEXT UNIQUE,
      downloads INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      path TEXT NOT NULL,
      sort INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_images_product ON product_images(product_id);
    CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
    CREATE INDEX IF NOT EXISTS idx_items_order ON order_items(order_id);
  `);

  seed(db);
  return db;
}

function seed(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) AS c FROM products").get() as { c: number };
  if (count.c > 0) return;

  const insert = db.prepare(`
    INSERT INTO products (slug, title, category, tag, description, long_description, price, preview, file_path, file_name)
    VALUES (@slug, @title, @category, @tag, @description, @long_description, @price, @preview, @file_path, @file_name)
  `);

  const products = [
    {
      slug: "second-brain-para",
      title: "Второй мозг (PARA)",
      category: "obsidian",
      tag: "Управление знаниями",
      description: "Полноценная система управления знаниями по методологии PARA в Obsidian.",
      long_description:
        "Готовое хранилище Obsidian, построенное по методологии PARA: Projects, Areas, Resources, Archive. Внутри — структура папок, шаблоны заметок, дашборд входящих, настроенный graph view и инструкция по внедрению за один вечер.",
      price: 1990,
      preview: "/previews/second-brain-para.svg",
      file_path: "second-brain-para.zip",
      file_name: "TemplateFlow-Второй-мозг-PARA.zip",
    },
    {
      slug: "project-planner",
      title: "Планировщик проектов",
      category: "obsidian",
      tag: "Управление проектами",
      description: "Управляйте проектами, задачами и сроками с отслеживанием прогресса.",
      long_description:
        "Система управления проектами в Obsidian: канбан и таблица проектов, статусы, прогресс-бары на Dataview, сроки, еженедельные обзоры и шаблон нового проекта. Подходит для личных задач и небольших команд.",
      price: 1690,
      preview: "/previews/project-planner.svg",
      file_path: "project-planner.zip",
      file_name: "TemplateFlow-Планировщик-проектов.zip",
    },
    {
      slug: "finance-tracker-obsidian",
      title: "Финансовый трекер",
      category: "obsidian",
      tag: "Финансы",
      description: "Отслеживайте доходы, расходы и бюджет в Obsidian. Анализ и отчеты.",
      long_description:
        "Финансовый дашборд в Obsidian: учет доходов и расходов, категории, счета, цели и автоматические отчеты на Dataview. Ежемесячные сводки, динамика расходов и структура бюджета — все в вашем локальном хранилище.",
      price: 1490,
      preview: "/previews/finance-tracker-obsidian.svg",
      file_path: "finance-tracker-obsidian.zip",
      file_name: "TemplateFlow-Финансовый-трекер.zip",
    },
    {
      slug: "budget-expenses",
      title: "Бюджет и расходы",
      category: "excel",
      tag: "Финансы",
      description: "Учет доходов, расходов, категорий и автоматические графики.",
      long_description:
        "Excel-таблица для личного и семейного бюджета: доходы, расходы, категории, сбережения, процент выполнения бюджета. Автоматические donut- и bar-графики, готовые формулы, защита от случайных правок.",
      price: 990,
      preview: "/previews/budget-expenses.svg",
      file_path: "budget-expenses.zip",
      file_name: "TemplateFlow-Бюджет-и-расходы.zip",
    },
    {
      slug: "kpi-dashboard",
      title: "Дашборд показателей",
      category: "excel",
      tag: "Аналитика",
      description: "Ключевые KPI, метрики, графики и автоматические отчеты.",
      long_description:
        "Управленческий дашборд в Excel: выручка, прибыль, клиенты, конверсия, динамика по месяцам и каналам. Все графики обновляются автоматически из листа с данными — просто вносите цифры.",
      price: 1290,
      preview: "/previews/kpi-dashboard.svg",
      file_path: "kpi-dashboard.zip",
      file_name: "TemplateFlow-Дашборд-показателей.zip",
    },
    {
      slug: "crm-clients",
      title: "CRM клиентов",
      category: "excel",
      tag: "Управление клиентами",
      description: "Учет клиентов, воронка продаж, задачи и напоминания.",
      long_description:
        "CRM в Excel: база клиентов, этапы сделки, суммы, вероятности, следующие действия и напоминания. Автоматическая воронка продаж, сводка по сделкам в работе и конверсия — без сложных систем.",
      price: 1190,
      preview: "/previews/crm-clients.svg",
      file_path: "crm-clients.zip",
      file_name: "TemplateFlow-CRM-клиентов.zip",
    },
  ];

  const tx = db.transaction(() => {
    for (const p of products) insert.run(p);
  });
  tx();
}

export function getDb(): Database.Database {
  if (!global.__db) global.__db = createDb();
  return global.__db;
}

export const FILES_STORAGE = FILES_DIR;
export const UPLOADS_STORAGE = UPLOADS_DIR;

export type Product = {
  id: number;
  slug: string;
  title: string;
  category: "obsidian" | "excel";
  tag: string;
  description: string;
  long_description: string;
  price: number;
  preview: string;
  file_path: string;
  file_name: string;
  active: number;
  downloads: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: number;
  product_id: number;
  path: string;
  sort: number;
};

export type Order = {
  id: number;
  public_id: string;
  access_key: string;
  email: string;
  total: number;
  status: "pending" | "paid" | "cancelled";
  provider: string;
  provider_payment_id: string | null;
  created_at: string;
  paid_at: string | null;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  title: string;
  price: number;
  download_token: string | null;
  downloads: number;
};
