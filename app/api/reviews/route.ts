import { NextRequest, NextResponse } from "next/server";
import { getProductReviews, submitProductReview } from "lib/reviews";
import { isSupabaseConfigured } from "lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get("handle");
  if (!handle) {
    return NextResponse.json({ error: "missing_handle" }, { status: 400 });
  }
  const summary = await getProductReviews(handle);
  return NextResponse.json(summary);
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: "reviews_unconfigured",
        message: "Reviews aren't open yet. Check back soon.",
      },
      { status: 503 },
    );
  }

  let body: {
    productHandle?: string;
    rating?: number;
    title?: string;
    body?: string;
    authorName?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const result = await submitProductReview({
    productHandle: body.productHandle || "",
    rating: Number(body.rating),
    title: body.title,
    body: body.body || "",
    authorName: body.authorName || "",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, review: result.review });
}
