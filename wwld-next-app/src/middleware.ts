// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // BỎ QUA các đường auth / lỗi / asset để không bị vòng lặp
  if (
    pathname.startsWith('/authenticate') ||
    pathname.startsWith('/403') ||
    pathname.startsWith('/api/public') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const role = req.cookies.get('role')?.value
    if (!role) return NextResponse.redirect(new URL('/authenticate/login', req.url))
    if (role !== 'ADMIN') return NextResponse.redirect(new URL('/403', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'] }
// Hoặc đơn giản nhất: chỉ dùng matcher ['/admin/:path*']
