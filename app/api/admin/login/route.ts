import { NextRequest, NextResponse } from "next/server";
import {
  adminCookieToken,
  checkAdminPassword,
  isAdminConfigured,
  ADMIN_COOKIE_NAME,
} from "lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error: "admin_unconfigured",
        message: "Set ADMIN_ACCESS_KEY to enable the admin area.",
      },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!checkAdminPassword(body.password || "")) {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, adminCookieToken()!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
