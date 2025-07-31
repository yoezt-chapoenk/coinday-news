import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  // Skip middleware for login and logout pages
  if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/admin/logout') {
    return res;
  }
  
  // Check if user is authenticated for protected admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: ['/admin', '/admin/approved', '/api/admin/:path*']
};