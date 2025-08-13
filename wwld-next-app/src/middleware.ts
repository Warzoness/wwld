// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Chỉ áp cho /admin (đã cấu hình matcher bên dưới)
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = req.cookies.get("session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/authenticate/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = String(payload.role || "").trim();
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/403", req.url));
    }
    return NextResponse.next();
  } catch {
    // token hết hạn/không hợp lệ
    return NextResponse.redirect(new URL("/authenticate/login", req.url));
  }
}

// Chỉ match /admin để tránh tác dụng phụ
export const config = {
  matcher: ["/admin/:path*"],
};
