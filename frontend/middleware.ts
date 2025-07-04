import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This is a simple client-side auth check
  // In a real app, you'd validate JWT tokens here
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // For protected routes, we'll let the client-side handle the redirect
  // since we're using localStorage for demo purposes
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
