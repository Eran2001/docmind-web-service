import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE } from "@/configs/constants";
import { AUTH_ROUTES, isProtectedPath, routes } from "@/configs/routes";
import { jwtExpiry } from "@/lib/api/jwt";

// Signed in = an access-token cookie that looks like a JWT. Its expiry is NOT checked here on purpose: an expired JWT can be
// silently refreshed, and the refresh cookie is invisible to this proxy (it is only sent to the API). The signature can't be
// checked either (the secret lives in the API). The client confirms the session with GET /auth/me, refreshes if needed,
// and any request that ends in a 401 signs the user out and sends them to /login.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  const signedIn = !!token && jwtExpiry(token) !== null;

  if (!signedIn && isProtectedPath(pathname)) {
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
