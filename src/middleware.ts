import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to validate Authentik authentication
 * Since Traefik's Authentik middleware handles authentication,
 * we just validate that the headers are present
 */
export function middleware(request: NextRequest) {
  // API routes require authentication headers
  if (request.nextUrl.pathname.startsWith('/api')) {
    const uid = request.headers.get('x-authentik-uid');
    const email = request.headers.get('x-authentik-email');

    // If no auth headers, return unauthorized
    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
