import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "lib/supabase";
import { WELCOME_DISCOUNT_CODE } from "lib/brand";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const supabase = getSupabase();

  // Deploy-safe: no DB configured yet — tell the client clearly, don't 500.
  if (!supabase) {
    return NextResponse.json(
      {
        error: "subscribe_unconfigured",
        message: "Sign-ups aren't connected yet. Check back soon.",
      },
      { status: 503 },
    );
  }

  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const { error } = await supabase.from("fbl_subscribers").upsert(
    {
      email,
      source: (body.source || "website").slice(0, 40),
      discount_code: WELCOME_DISCOUNT_CODE,
    },
    { onConflict: "email", ignoreDuplicates: true },
  );

  if (error) {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, code: WELCOME_DISCOUNT_CODE });
}
