import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES_META } from "lib/guides";

export const metadata: Metadata = {
  title: "Aquarium Guides — Planted Tanks, Filters & Water Care | Lush Aquarium",
  description: "Straight-talking Australian aquarium guides: LED lighting for planted tanks, nano filters, faster water changes and water testing that actually means something.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#0e7490]">Guides</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">No fluff. Just what works.</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#132a35]/70">
          Written by people who keep tanks, for people who keep tanks. Every guide names the gear we stock — and when a cheaper option is the smarter buy, we say so.
        </p>
        <div className="mt-10 divide-y divide-[#132a35]/10">
          {GUIDES_META.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="group block py-6">
              <h2 className="text-lg font-semibold tracking-tight group-hover:text-[#0e7490]">{g.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#132a35]/70">{g.description}</p>
              <p className="mt-2 text-xs text-[#132a35]/50">{g.readingMinutes} min read</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
