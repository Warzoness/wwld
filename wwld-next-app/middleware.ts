import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    const role = req.cookies.get('role')?.value; // hoặc decode JWT
    if (!role) {
      return NextResponse.redirect(new URL('/authenticate/login', req.url));
    }
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
