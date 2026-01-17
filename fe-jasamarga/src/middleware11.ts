import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jasamarga_token')?.value || 
                request.cookies.get('token')?.value
  
  const protectedPaths = [
    '/dashboard',
    '/laporan-lalu-lintas',
    '/master-gerbang',
    '/profile',
    '/settings'
  ]
  
  const publicPaths = [
    '/login',
  ]
  
  const currentPath = request.nextUrl.pathname
  
  const isProtectedPath = protectedPaths.some(path => 
    currentPath === path || currentPath.startsWith(`${path}/`)
  )
  
  const isPublicPath = publicPaths.some(path => 
    currentPath === path || currentPath.startsWith(`${path}/`)
  )
  
  if (!token && isProtectedPath) {
    const loginUrl = new URL('/login', request.url)
    
    if (currentPath !== '/') {
      loginUrl.searchParams.set('callbackUrl', encodeURI(currentPath))
    }
    
    return NextResponse.redirect(loginUrl)
  }
  
  if (token && isPublicPath && currentPath === '/login') {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
    const redirectUrl = callbackUrl ? decodeURI(callbackUrl) : '/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }
  
  if (!token && currentPath === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (token && currentPath === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  const requestHeaders = new Headers(request.headers)
  
  if (token) {
    requestHeaders.set('x-auth-token', token)
  }
  
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public).*)',
  ],
}