import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  if (pathname.startsWith('/dashboard')) {
    // If no session cookie exists, redirect to login page
    if (!sessionId) {
      const url = new URL('/login', request.url);
      // Add the current path as a redirect parameter
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // If accessing login page while already logged in, redirect to dashboard
  if (pathname === '/login' && sessionId) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on specific routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
}; 