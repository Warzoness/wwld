// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ví dụ: chặn khách chưa login vào /admin
  if (pathname.startsWith('/admin')) {
    const role = req.cookies.get('role')?.value
    if (!role) {
      return NextResponse.redirect(new URL('/authenticate/login', req.url))
    }
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', req.url))
    }
  }

  // cho phép đi tiếp
  return NextResponse.next()
}

// cấu hình đường match (rất quan trọng để tránh quét tất cả asset)
export const config = {
  matcher: [
    // chỉ áp cho các route cần thiết
    '/((?!_next/static|_next/image|favicon.ico|images|api/health).*)',
  ],
}
