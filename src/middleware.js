import { NextResponse } from "next/server";

import { getAdminCookieName, verifyAdminToken } from "./lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(getAdminCookieName())?.value;
  const isValid = await verifyAdminToken(token);

  if (pathname.startsWith("/api/admin")) {
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!isValid) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
