import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production")

// Paths that require authentication
const PROTECTED_PATHS = ["/dashboard", "/auctions/create", "/profile"]

// Paths that require specific roles
const ROLE_PROTECTED_PATHS = {
  "/admin": ["admin"],
  "/auctions/create": ["auctioneer", "admin"],
  "/auctions/manage": ["auctioneer", "admin"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if path requires authentication
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value

  // If path requires authentication and no token, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If token exists, verify it
  if (token) {
    try {
      const verified = await jwtVerify(token, JWT_SECRET)
      const user = verified.payload

      // Check role-based access
      for (const [path, roles] of Object.entries(ROLE_PROTECTED_PATHS)) {
        if (pathname.startsWith(path) && !roles.includes(user.role as string)) {
          // Redirect to unauthorized page if role doesn't match
          return NextResponse.redirect(new URL("/unauthorized", request.url))
        }
      }
    } catch (error) {
      // If token is invalid, clear it and redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auctions/create", "/auctions/manage/:path*", "/profile/:path*"],
}
