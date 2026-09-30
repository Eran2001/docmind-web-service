import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE } from "@/configs/constants";
import { AUTH_ROUTES, routes } from "@/configs/routes";
import { isExpired } from "@/lib/api/jwt";

const PROTECTED = ["/collections", "/evals", "/usage", "/settings", "/admin"];

// Signed in = a readable, unexpired access token in the cookie. The signature can't be checked here (the secret lives in the API);
// the client confirms the session with GET /auth/me right after, and any 401 sends the user back to /login.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  const signedIn = !!token && !isExpired(token);

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
