import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // No authentication logic
  return NextResponse.next();
}

// Empty matcher since we don't need to protect any routes
export const config = {
  matcher: [],
}; 