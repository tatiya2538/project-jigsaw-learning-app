import { NextResponse } from "next/server";

import {
  checkAdminPassword,
  createAdminToken,
  getAdminCookieName,
  getAdminCookieOptions,
} from "../../../../lib/auth";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const password = String(body.password || "");

  if (!checkAdminPassword(password)) {
    return NextResponse.json(
      { error: "รหัสผ่านไม่ถูกต้อง" },
      { status: 401 },
    );
  }

  const token = await createAdminToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), token, getAdminCookieOptions());
  return response;
}
