import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
  '/executive',
  '/students',
  '/attendance',
  '/finance',
  '/sarpras',
  '/documents',
  '/calendar',
  '/chat',
  '/settings',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const userSessionCookie = request.cookies.get('user_session_token')?.value;

  // 1. Jika user mengakses root "/" -> Paksa Redirect ke "/login"
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Jika user mencoba membuka rute terproteksi tanpa sesi login
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !userSessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Jika user yang sudah login membuka halaman "/login", arahkan ke dashboard
  if (pathname === '/login' && userSessionCookie) {
    try {
      const parsedSession = JSON.parse(userSessionCookie);
      if (parsedSession.role === 'guru') {
        return NextResponse.redirect(new URL('/attendance', request.url));
      } else {
        return NextResponse.redirect(new URL('/executive', request.url));
      }
    } catch (e) {
      console.error(e);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/executive/:path*',
    '/students/:path*',
    '/attendance/:path*',
    '/finance/:path*',
    '/sarpras/:path*',
    '/documents/:path*',
    '/calendar/:path*',
    '/chat/:path*',
    '/settings/:path*',
  ],
};