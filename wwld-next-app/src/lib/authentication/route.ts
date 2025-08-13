// app/api/auth/set-session/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json(); // { role: "ADMIN", ... }
  const res = NextResponse.json({ ok: true });

  res.cookies.set("role", body.role, {
    path: "/",
    httpOnly: false,   // nếu bạn muốn đọc ở client; nếu chỉ middleware dùng thì có thể true
    sameSite: "lax",
    // secure: true,    // BẬT khi chạy https (Vercel); tắt khi dev localhost
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
