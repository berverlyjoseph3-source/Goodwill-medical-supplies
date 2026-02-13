import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rate limiting
const rateLimit = new Map();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.ip || 'anonymous';
    const limit = rateLimit.get(ip) || 0;
    
    if (limit > 100) { // 100 requests per minute
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Too many requests' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    rateLimit.set(ip, limit + 1);
    setTimeout(() => rateLimit.delete(ip), 60000);
  }
  
  // Authentication check for admin routes
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request });
    
    if (!token) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    
    if (token.role !== 'ADMIN' && token.role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Authentication check for account routes
  if (pathname.startsWith('/account')) {
    const token = await getToken({ req: request });
    
    if (!token) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  // Redirect old URLs
  if (pathname === '/shop/products' || pathname === '/products') {
    return NextResponse.redirect(new URL('/shop', request.url), 301);
  }
  
  // Add trailing slash? No, remove it
  if (pathname !== '/' && pathname.endsWith('/')) {
    return NextResponse.redirect(
      new URL(pathname.slice(0, -1), request.url),
      308
    );
  }
  
  // Cache static assets
  if (pathname.match(/\.(jpg|jpeg|png|webp|avif|svg|css|js)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/account/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
