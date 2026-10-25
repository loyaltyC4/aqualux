import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES_META } from "lib/guides";
import { GUIDE_PRODUCT } from "lib/guide-products";
import { getProduct } from "lib/shopify";
import { Reveal } from "components/reveal";
import { Spotlight } from "components/spotlight";

export const metadata: Metadata = {
  title: "Aquarium Guides: Planted Tanks, Filters & Water Care",
  description:
    "Straight-talking planted aquarium guides: LED lighting for planted tanks, nano filters, faster water changes and water testing that actually means something.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage() {
  // The photo on each card is the real product the guide recommends, not an illustration.
  const shots = await Promise.all(
    GUIDES_META.map(async (g) => {
      const h = GUIDE_PRODUCT[g.slug];
      return h ? await getProduct(h) : undefined;
    }),
  );
  const [lead, ...rest] = GUIDES_META;
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-12 md:py-24">
        <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Planted aquarium guides
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--aq-muted)]">
          Written by people who keep tanks. Every guide names the gear we stock,
          and when a cheaper option is the smarter buy, it says so.
        </p>

        {lead && (
          <Reveal className="mt-12">
            <Spotlight className="rounded-[1.75rem]">
              <Link
                href={`/guides/${lead.slug}`}
                className="group grid overflow-hidden rounded-[1.75rem] bg-[var(--aq-deep)] text-white md:grid-cols-[1.1fr_0.9fr]"
              >
                <div className="flex flex-col justify-between gap-10 p-7 md:p-10">
                  <span className="aq-spec text-[12px] text-white/55">{lead.readingMinutes} min read</span>
                  <div>
                    <h2 className="text-2xl font-semibold leading-tight md:text-4xl">{lead.title}</h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">{lead.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">Read the guide <span aria-hidden>→</span></span>
                  </div>
                </div>
                {shots[0]?.featuredImage?.url && (
                  <div className="relative min-h-[240px] bg-white">
                    <Image src={shots[0].featuredImage.url} alt={shots[0].title} fill sizes="(min-width:768px) 40vw, 100vw" className="object-contain p-8 transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" />
                  </div>
                )}
              </Link>
            </Spotlight>
          </Reveal>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((g, i) => {
            const p = shots[i + 1];
            const tint = i % 3 === 0 ? "bg-[var(--aq-raised)]" : i % 3 === 1 ? "bg-white ring-1 ring-black/[0.07]" : "bg-[#e3ece2]";
            return (
              <Reveal key={g.slug} delay={(i % 3) * 70} className="h-full">
                <Spotlight className="h-full rounded-[1.5rem]">
                  <Link href={`/guides/${g.slug}`} className={`group flex h-full flex-col overflow-hidden rounded-[1.5rem] ${tint}`}>
                    <div className="relative aspect-[5/3]">
                      {p?.featuredImage?.url && (
                        <Image src={p.featuredImage.url} alt={p.title} fill sizes="(min-width:1024px) 26vw, (min-width:640px) 45vw, 90vw" className="object-contain p-6 mix-blend-multiply transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6 pt-0">
                      <h2 className="text-[17px] font-semibold leading-snug">{g.title}</h2>
                      <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-[var(--aq-muted)]">{g.description}</p>
                      <span className="aq-spec mt-auto pt-4 text-[12px] text-[var(--aq-muted)]">{g.readingMinutes} min read</span>
                    </div>
                  </Link>
                </Spotlight>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
