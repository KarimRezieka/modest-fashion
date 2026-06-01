import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/register", "/shop", "/about", "/contact"];
const authPaths = ["/login", "/register"];
const protectedPaths = ["/profile", "/orders", "/wishlist", "/checkout"];

function isProtected(pathname: string) {
  return protectedPaths.some((p) => pathname.startsWith(p));
}

function isAuthPath(pathname: string) {
  return authPaths.some((p) => pathname === p);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieToken = request.cookies.get("refresh_token")?.value;

  const isLoggedIn = !!cookieToken;

  if (isAuthPath(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtected(pathname) && !isLoggedIn) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
