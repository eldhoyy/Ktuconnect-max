import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { adminCookie, createAdminSessionToken } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: Request) {
  const limit = rateLimit(`admin-login:${clientIp(request)}`, { limit: 5, windowMs: 15 * 60_000, blockMs: 15 * 60_000 });
  if (!limit.allowed) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!body || typeof body !== "object" || !("email" in body) || !("password" in body)) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (email.length > 254 || password.length > 256 || !safeEqual(email.toLowerCase(), expectedEmail.toLowerCase()) || !safeEqual(password, expectedPassword)) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie.name, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: adminCookie.maxAge,
  });
  return response;
}
