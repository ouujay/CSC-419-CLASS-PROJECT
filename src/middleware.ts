// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: Log incoming request path
  console.log('Middleware triggered:', request.nextUrl.pathname);

  // You can also modify headers, cookies, etc.
  const response = NextResponse.next();

  // Optionally: Set custom headers
  response.headers.set('x-powered-by', 'Osisi');

  return response;
}

// Optional: Apply to specific routes only
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
