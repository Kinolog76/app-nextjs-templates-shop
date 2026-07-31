import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET || "dev-secret";
const COOKIE = "tf_admin";

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function makeSessionToken(): string {
  const payload = `admin:${Date.now()}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  let payload: string;
  try {
    payload = Buffer.from(b64, "base64url").toString();
  } catch {
    return false;
  }
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  // сессия живет 7 дней
  const ts = Number(payload.split(":")[1]);
  return Number.isFinite(ts) && Date.now() - ts < 7 * 24 * 3600 * 1000;
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const ADMIN_COOKIE = COOKIE;
