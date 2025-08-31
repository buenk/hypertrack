import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicRoutes = [
    "/login",
    "/signup",
    "/api/",
    "/_next/",
    "/favicon.ico",
    "/next.svg",
    "/vercel.svg",
    "/file.svg",
    "/window.svg",
    "/globe.svg",
  ];

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Allow root path (it redirects based on auth status)
  if (pathname === "/" || isPublicRoute) {
    return NextResponse.next();
  }

  // Check for session cookie (better-auth uses 'better-auth.session_token' by default)
  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie?.value) {
    // Redirect to login if no session cookie
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If session cookie exists, allow the request to proceed
  // The actual session validation will happen in the page components
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
