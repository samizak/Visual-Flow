import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './utils/superbase/middleware';

export async function middleware(request: NextRequest) {
  // Update the session
  const response = await updateSession(request);
  
  // Get the pathname
  const { pathname } = request.nextUrl;
  
  // Check if the user is authenticated
  const authCookie = request.cookies.get('sb-auth-token');
  const isAuthenticated = !!authCookie;
  
  // Protected routes
  const protectedRoutes = ['/protected', '/editor'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Redirect authenticated users from login/signup to dashboard
  if ((pathname === '/auth/login' || pathname === '/auth/signup') && isAuthenticated) {
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
