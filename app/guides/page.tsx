import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES_META } from "lib/guides";

export const metadata: Metadata = {
  title: "Aquarium Guides: Planted Tanks, Filters & Water Care",
  description:
    "Straight-talking planted aquarium guides: LED lighting for planted tanks, nano filters, faster water changes and water testing that actually means something.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Planted aquarium guides
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#0f1d18]/70">
          Written by people who keep tanks. Every guide names the gear we stock,
          and when a cheaper option is the smarter buy, it says so.
        </p>
        <div className="mt-10 divide-y divide-[#0f1d18]/10">
          {GUIDES_META.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group block py-6"
            >
              <h2 className="text-lg font-semibold tracking-tight group-hover:text-[#2f6a37]">
                {g.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#0f1d18]/70">
                {g.description}
              </p>
              <p className="mt-2 text-xs text-[#0f1d18]/50">
                {g.readingMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
