import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session cookie - check for NextAuth or our test session
  const sessionCookie = request.cookies.get('next-auth.session-token') || 
                        request.cookies.get('__Secure-next-auth.session-token') ||
                        request.cookies.get('test-session');
  
  // Protected routes that require authentication
  if (pathname.startsWith('/dashboard')) {
    // If no session exists, redirect to login page
    if (!sessionCookie) {
      const url = new URL('/login', request.url);
      // Add the current path as a redirect parameter
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // If accessing login page while already logged in, redirect to dashboard
  if ((pathname === '/login' || pathname === '/test-login') && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on specific routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/test-login',
  ],
}; 