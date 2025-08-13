// app/api/auth/set-session/route.ts
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  // client gửi: { user: { id, role, fullname, ... } }
  const { user } = await req.json();

  // ký JWT (chỉ nhét thông tin cần thiết)
  const token = await new SignJWT({
    sub: String(user.id),
    role: user.role,
    fullname: user.fullname, // nếu cần
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const res = NextResponse.json({ ok: true });

  // đặt cookie "session"
  res.cookies.set("session", token, {
    httpOnly: true,                     // an toàn hơn (client JS không đọc được)
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // chỉ bật ở https
    path: "/",
    maxAge: 60 * 60 * 24 * 30,         // 30 ngày
  });

  // (tuỳ chọn) đặt thêm cookie role công khai để UI đọc nhanh:
  res.cookies.set("role", user.role, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
