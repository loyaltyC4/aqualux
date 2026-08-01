import { getSupabase } from "./supabase";

export type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  verifiedPurchase: boolean;
  createdAt: string;
};

export type ReviewSummary = {
  reviews: Review[];
  average: number;
  count: number;
};

function rowToReview(r: any): Review {
  return {
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    authorName: r.author_name,
    verifiedPurchase: Boolean(r.verified_purchase),
    createdAt: r.created_at,
  };
}

/** Real, submitted reviews only / never seeded or fabricated. */
export async function getProductReviews(
  productHandle: string,
): Promise<ReviewSummary> {
  const supabase = getSupabase();
  if (!supabase) return { reviews: [], average: 0, count: 0 };

  const { data, error } = await supabase
    .from("fbl_reviews")
    .select("id,rating,title,body,author_name,verified_purchase,created_at")
    .eq("product_handle", productHandle)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return { reviews: [], average: 0, count: 0 };

  const reviews = data.map(rowToReview);
  const count = reviews.length;
  const average = count
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;

  return { reviews, average, count };
}

export type NewReviewInput = {
  productHandle: string;
  rating: number;
  title?: string;
  body: string;
  authorName: string;
};

export async function submitProductReview(
  input: NewReviewInput,
): Promise<{ ok: true; review: Review } | { ok: false; error: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "unconfigured" };

  const rating = Math.round(input.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "invalid_rating" };
  }
  const body = (input.body || "").trim();
  if (body.length < 10 || body.length > 2000) {
    return { ok: false, error: "invalid_body" };
  }
  const authorName = (input.authorName || "").trim().slice(0, 80);
  if (!authorName) return { ok: false, error: "invalid_author" };
  const title = (input.title || "").trim().slice(0, 120) || null;
  const productHandle = (input.productHandle || "").trim();
  if (!productHandle) return { ok: false, error: "invalid_product" };

  const { data, error } = await supabase
    .from("fbl_reviews")
    .insert({
      product_handle: productHandle,
      rating,
      title,
      body,
      author_name: authorName,
      verified_purchase: false, // no order-linking yet / always labeled honestly
      status: "published",
    })
    .select("id,rating,title,body,author_name,verified_purchase,created_at")
    .single();

  if (error || !data) return { ok: false, error: "insert_failed" };
  return { ok: true, review: rowToReview(data) };
}
