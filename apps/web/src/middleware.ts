import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/configs/constants";
import { AUTH_ROUTES, routes } from "@/configs/routes";

const PROTECTED = ["/collections", "/evals", "/usage", "/settings", "/admin"];

// Cookie presence only; the API validates the tokens. A live refresh cookie counts as signed in
// because the access cookie expires first and the client refreshes it on the next 401.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const signedIn = req.cookies.has(ACCESS_COOKIE) || req.cookies.has(REFRESH_COOKIE);

  if (!signedIn && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = req.nextUrl.clone();
    url.pathname = routes.login;
    url.search = `?next=${encodeURIComponent(pathname + req.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }

  if (signedIn && AUTH_ROUTES.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = routes.collections;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/collections/:path*", "/evals/:path*", "/usage/:path*", "/settings", "/admin/:path*"],
};
