"use client";

import clsx from "clsx";

function Star({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill={filled ? "#f2a93b" : "none"}
      stroke={filled ? "#f2a93b" : "currentColor"}
      strokeWidth={1.4}
    >
      <path
        d="M10 1.6l2.5 5.5 5.9.6-4.5 4 1.3 5.8L10 14.9l-5.2 2.6 1.3-5.8-4.5-4 5.9-.6L10 1.6z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SIZE_CLASSES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

export function StarRating({
  value,
  size = "md",
  className,
}: {
  value: number;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}) {
  const starClass = SIZE_CLASSES[size];
  return (
    <div
      className={clsx("flex items-center gap-0.5", className)}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} filled={n <= Math.round(value)} className={starClass} />
      ))}
    </div>
  );
}

/** Interactive star picker for the review form. */
export function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="p-0.5 transition hover:scale-110"
        >
          <Star filled={n <= value} className="h-6 w-6" />
        </button>
      ))}
    </div>
  );
}
