"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StarPicker, StarRating } from "components/star-rating";
import type { Review } from "lib/reviews";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

export function ReviewsSection({
  productHandle,
  initialReviews,
  initialAverage,
  initialCount,
}: {
  productHandle: string;
  initialReviews: Review[];
  initialAverage: number;
  initialCount: number;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [average, setAverage] = useState(initialAverage);
  const [count, setCount] = useState(initialCount);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (body.trim().length < 10) {
      toast.error("Tell us a bit more (10+ characters).");
      return;
    }
    if (!authorName.trim()) {
      toast.error("Add your name.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productHandle,
          rating,
          title,
          body,
          authorName,
        }),
      });
      const data = await res.json();
      if (res.status === 503) {
        toast.error("Reviews aren't open yet", {
          description: "Check back soon / we're setting this up.",
        });
      } else if (!res.ok) {
        toast.error("Couldn't post your review", {
          description: "Please check your review and try again.",
        });
      } else {
        const newReview: Review = data.review;
        setReviews((prev) => [newReview, ...prev]);
        setCount((c) => c + 1);
        setAverage(
          (avgPrev) => (avgPrev * count + newReview.rating) / (count + 1),
        );
        setFormOpen(false);
        setTitle("");
        setBody("");
        setAuthorName("");
        setRating(5);
        toast.success("Thanks for your review!");
      }
    } catch {
      toast.error("Network error / please try again.");
    }
    setSubmitting(false);
  }

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-[#0d1618] p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Reviews</h2>
          {count > 0 ? (
            <div className="mt-2 flex items-center gap-3">
              <StarRating value={average} size="lg" />
              <span className="text-sm text-neutral-400">
                {average.toFixed(1)} out of 5 · {count} review
                {count === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-neutral-400">
              No reviews yet / be the first to share how it rides.
            </p>
          )}
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold transition hover:border-[#f2a93b] hover:text-[#f2a93b]"
        >
          {formOpen
            ? "Cancel"
            : count > 0
              ? "Write a review"
              : "Write the first review"}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Your rating
            </label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Your name
            </label>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={80}
              placeholder="e.g. Alex R."
              className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-[#eceae4] placeholder:text-neutral-500 focus:border-[#f2a93b]/60"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Title (optional)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Sum it up in a few words"
              className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-[#eceae4] placeholder:text-neutral-500 focus:border-[#f2a93b]/60"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Your review
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="How does it ride? What did you set it up with?"
              className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-[#eceae4] placeholder:text-neutral-500 focus:border-[#f2a93b]/60"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-[#f2a93b] px-6 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? "Posting…" : "Post review"}
          </button>
        </form>
      )}

      {reviews.length > 0 && (
        <ul className="mt-6 divide-y divide-white/10">
          {reviews.map((r) => (
            <li key={r.id} className="py-5">
              <div className="flex items-center justify-between gap-3">
                <StarRating value={r.rating} />
                <span className="text-xs text-neutral-500">
                  {timeAgo(r.createdAt)}
                </span>
              </div>
              {r.title && (
                <h3 className="mt-2 font-medium text-[#eceae4]">{r.title}</h3>
              )}
              <p className="mt-1 text-sm leading-relaxed text-neutral-300">
                {r.body}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                <span>{r.authorName}</span>
                {r.verifiedPurchase && (
                  <span className="rounded-full bg-[#f2a93b]/10 px-2 py-0.5 text-[#f2a93b]">
                    Verified purchase
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
