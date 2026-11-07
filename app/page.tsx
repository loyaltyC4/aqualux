import Image from "next/image";
import Link from "next/link";
import Footer from "components/layout/footer";
import { ProductCard } from "components/product-card";
import { Reveal } from "components/reveal";
import { Spotlight } from "components/spotlight";
import { NewsletterForm } from "components/newsletter-form";
import {
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  GlobeAltIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { getCollectionProducts } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import {
  COLLECTIONS,
  FREE_SHIPPING_THRESHOLD,
} from "lib/brand";
import { GUIDES_META } from "lib/guides";
import { TANKS } from "lib/tanks";
import { pageMeta } from "lib/seo";

export const metadata = pageMeta({
  title: "Lush Aquarium | Planted Tank Lighting, CO2 & Aquascaping",
  absoluteTitle: true,
  description: `Planted aquarium lighting, CO2 systems, aquascaping tools and water test kits, chosen on real specs. Free shipping over $${FREE_SHIPPING_THRESHOLD} to the US and Canada.`,
  path: "/",
});

const price = (p: Product) => parseFloat(p.priceRange.minVariantPrice.amount);

const USP: [typeof TruckIcon, string, string][] = [
  [TruckIcon, "Free shipping", `over $${FREE_SHIPPING_THRESHOLD} to US & Canada`],
  [ArrowPathIcon, "30-day returns", "unused, in packaging"],
  [ClipboardDocumentCheckIcon, "Real specs", "PAR, spectrum, dimensions"],
  [GlobeAltIcon, "Ships worldwide", "tracked, dispatched in 1-2 days"],
];

// Bento order. Lighting is the anchor category (it decides whether plants grow
// at all), so it takes the 2x2 cell; the other five fill a 3x3 grid exactly.
const BENTO_ORDER = [
  "lighting",
  "co2",
  "tools",
  "hardscape",
  "testing",
  "filtration",
];
const BIG = "sm:col-span-2 lg:col-span-2 lg:row-span-2";

const Arrow = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden
  >
    <path
      d="M5 12h13M13 6l6 6-6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default async function HomePage() {
  // Derived from COLLECTIONS rather than listed by hand, so a new collection
  // is counted in the tiles and the "All N products" figure automatically.
  const fetched = await Promise.all(
    COLLECTIONS.map((c) => getCollectionProducts({ collection: c.handle })),
  );
  const byHandle: Record<string, Product[]> = {};
  COLLECTIONS.forEach((c, i) => {
    byHandle[c.handle] = fetched[i] ?? [];
  });

  const counts: Record<string, number> = Object.fromEntries(
    COLLECTIONS.map((c) => [c.handle, byHandle[c.handle]!.length]),
  );
  // Distinct products: a handle can sit in more than one collection.
  const total = new Set(fetched.flat().map((p) => p.handle)).size;

  const lighting = byHandle["lighting"] ?? [];
  const co2 = byHandle["co2"] ?? [];

  const bundles = [...lighting, ...co2]
    .filter((p) => p.handle.includes("bundle"))
    .sort((a, b) => price(a) - price(b));
  // Curated lights (photographed, with real spec tables) lead the rail;
  // newer supplier imports follow. Within each group, cheapest first.
  const hasSpecs = (p: Product) => (p.specs?.length ?? 0) > 0;
  const heroLights = lighting
    .filter((p) => !p.handle.includes("bundle"))
    .sort(
      (a, b) =>
        Number(hasSpecs(b)) - Number(hasSpecs(a)) || price(a) - price(b),
    );

  // Hero display case: the three best-documented lights (real photo + spec table), cheapest first.
  const showcase = heroLights.filter((p) => p.featuredImage?.url && hasSpecs(p)).slice(0, 3);

  // Each category tile shows a REAL product photo from that category (best-documented first),
  // never a rendered or generated image.
  const shotFor = (handle: string) => {
    const list = (byHandle[handle] ?? []).filter((p) => p.featuredImage?.url);
    return (
      [...list].sort((a, b) => Number(hasSpecs(b)) - Number(hasSpecs(a)) || price(b) - price(a))[0] ?? null
    );
  };

  const tiles = BENTO_ORDER.map((h) =>
    COLLECTIONS.find((c) => c.handle === h),
  ).filter((c): c is (typeof COLLECTIONS)[number] => Boolean(c));

  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {/* ── HERO: a lit planted tank at night ─────────────────
          Full-bleed photo of a planted tank under a bar light, so the first
          thing a visitor sees is the result the products produce. Entrance
          stagger, gradient headline word and the notched-arrow product cards
          are adapted from the 21st.dev "Commerce Hero" (bankkroll), rebuilt
          in plain CSS so the H1 (LCP) never waits on JavaScript. Light rays
          and bubbles are CSS-only and switch off under reduced motion. */}
      <section className="relative isolate overflow-hidden bg-[#06110c] text-white">
        <Image
          src="/brand/hero.jpg"
          alt="Planted aquarium with stem plants, a grass carpet and seiryu stone under a full-spectrum LED bar"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[78%_center] opacity-90 max-lg:opacity-55"
        />
        {/* Fade the dark wall behind the copy; keep the tank lit. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#06110c_0%,rgba(6,17,12,0.92)_32%,rgba(6,17,12,0.25)_62%,transparent_80%),linear-gradient(0deg,#06110c_0%,transparent_38%)] max-lg:bg-[linear-gradient(0deg,#06110c_8%,rgba(6,17,12,0.7)_55%,rgba(6,17,12,0.35)_100%)]"
        />
        <div aria-hidden className="aq-rays -z-10" />
        <div aria-hidden className="aq-bubbles -z-10">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>

        <div className="mx-auto flex min-h-[min(88dvh,820px)] w-full max-w-[1400px] flex-col justify-center px-6 pb-40 pt-20 md:px-12 md:pb-48 md:pt-24">
          <div className="max-w-[36rem]">
            <p className="aq-in inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-2.5 pr-4 text-[13px] text-white/80 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8fe07a] opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8fe07a]" />
              </span>
              {total} products for planted tanks, picked on real specs
            </p>
            <h1
              className="aq-in mt-7 text-[2.75rem] font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[4.75rem]"
              style={{ "--d": "80ms" } as React.CSSProperties}
            >
              Everything your planted tank needs to{" "}
              <span className="bg-[linear-gradient(100deg,#c6f08a_0%,#7fd46b_45%,#f3c46b_100%)] bg-clip-text pb-1 italic text-transparent">
                grow.
              </span>
            </h1>
            <p
              className="aq-in mt-6 max-w-[32rem] text-base leading-relaxed text-white/70 md:text-lg"
              style={{ "--d": "160ms" } as React.CSSProperties}
            >
              Full-spectrum lights, CO2 and scaping tools sized to your tank.
              Free shipping over ${FREE_SHIPPING_THRESHOLD} to the US and Canada.
            </p>
            <div
              className="aq-in mt-10 flex flex-wrap items-center gap-x-4 gap-y-4"
              style={{ "--d": "240ms" } as React.CSSProperties}
            >
              <Link
                href="/search/lighting"
                className="group inline-flex items-center gap-3 rounded-full bg-[#8fe07a] py-2 pl-6 pr-2 text-sm font-semibold text-[#06110c] shadow-[0_0_0_1px_rgba(143,224,122,0.4),0_18px_50px_-12px_rgba(143,224,122,0.55)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_0_1px_rgba(143,224,122,0.6),0_22px_60px_-10px_rgba(143,224,122,0.75)] active:scale-[0.98]"
              >
                Shop lighting
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06110c] text-[#8fe07a] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
                  <Arrow />
                </span>
              </Link>
              <Link
                href="/tanks"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/[0.08]"
              >
                Plan by tank size
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED LIGHTS: overlap the hero edge ───────────── */}
      <div className="relative z-10 mx-auto -mt-32 max-w-[1400px] px-6 md:-mt-36 md:px-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
          {showcase.map((p, i) => {
            const spec = p.specs?.[0];
            return (
              <Link
                key={p.id}
                href={`/product/${p.handle}`}
                className="aq-in group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-white p-3 pr-16 shadow-[0_30px_60px_-30px_rgba(6,17,12,0.55)] ring-1 ring-black/[0.05] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:flex-col sm:items-stretch sm:p-4 sm:pr-4"
                style={{ "--d": `${320 + i * 90}ms` } as React.CSSProperties}
              >
                <div className="relative aspect-square w-24 flex-none overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_35%,#ffffff,#e4ece1_70%)] sm:w-full sm:aspect-[5/3]">
                  {p.featuredImage?.url && (
                    <Image
                      src={p.featuredImage.url}
                      alt={p.featuredImage.altText || p.title}
                      fill
                      priority
                      sizes="(min-width:640px) 30vw, 96px"
                      className="object-contain p-3 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                  )}
                </div>
                <div className="min-w-0 sm:px-1 sm:pb-1 sm:pr-14">
                  <p className="line-clamp-2 text-sm font-medium leading-snug text-[var(--aq-ink)]">{p.title}</p>
                  <div className="mt-1.5 flex items-baseline gap-3">
                    <span className="aq-spec text-base font-semibold text-[var(--aq-ink)]">${Math.round(price(p))}</span>
                    {spec && <span className="aq-spec truncate text-xs text-[var(--aq-muted)]">{spec.value}</span>}
                  </div>
                </div>
                {/* Notched corner with arrow (21st.dev Commerce Hero tile). */}
                <span className="absolute bottom-0 right-0 flex h-14 w-14 items-center justify-center rounded-tl-2xl bg-[var(--aq-canvas)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--aq-raised)] text-[var(--aq-ink)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:bg-[#2f6a37] group-hover:text-white">
                    <Arrow />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── USP STRIP ────────────────────────────────────── */}
      <div className="mt-14 border-y border-black/[0.07] bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 px-6 md:grid-cols-4 md:px-12">
          {USP.map(([Icon, t, d]) => (
            <div key={t} className="flex items-start gap-3 py-6 md:py-7">
              <Icon
                aria-hidden
                className="mt-0.5 h-5 w-5 flex-none text-[#2f6a37]"
              />
              <div>
                <p className="text-sm font-medium text-[var(--aq-ink)]">{t}</p>
                <p className="mt-1 text-[13px] text-[var(--aq-muted)]">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PLAN BY TANK SIZE ───────────────────────────────
          Each outline is drawn to scale from the tank's real dimensions, so
          the row doubles as a size comparison. Links feed the /tanks pages. */}
      <section className="mx-auto max-w-[1400px] px-6 pt-20 md:px-12 md:pt-28">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
            Start from the tank you already own.
          </h2>
          <p className="mt-4 max-w-[52ch] leading-relaxed text-[var(--aq-muted)]">
            Pick a size for the light that fits, heater wattage, filter flow and
            how much substrate to buy.
          </p>
        </Reveal>
        <div className="-mx-6 mt-10 flex snap-x snap-mandatory items-end gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:px-0 lg:grid-cols-8">
          {TANKS.map((t) => {
            const scale = 2.4; // px per inch on both axes, so outlines are true to scale (48 in = 115 px)
            return (
              <Link
                key={t.slug}
                href={`/tanks/${t.slug}`}
                className="group flex w-40 shrink-0 snap-start flex-col rounded-2xl bg-white p-4 ring-1 ring-[var(--aq-line)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:ring-[#2f6a37]/40 md:w-auto"
              >
                <div className="flex h-[92px] items-end justify-center">
                  <div
                    aria-hidden
                    className="relative max-w-full rounded-[3px] border-[1.5px] border-[var(--aq-ink)]/70 bg-[linear-gradient(to_top,#2f6a37_0,#2f6a37_14%,rgba(47,106,55,0.08)_14%)] transition-colors group-hover:border-[#2f6a37]"
                    style={{ width: `${t.dims[0] * scale}px`, height: `${t.dims[2] * scale}px` }}
                  />
                </div>
                <p className="mt-4 text-[15px] font-semibold leading-tight">{t.name.split(" (")[0]}</p>
                <p className="aq-spec mt-1 text-[12px] text-[var(--aq-muted)]">
                  {t.netL} L
                </p>
              </Link>
            );
          })}
        </div>
        <Link
          href="/tools/substrate-calculator"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6a37]"
        >
          Other size? Substrate calculator <Arrow />
        </Link>
      </section>

      {/* ── CATEGORY BENTO ───────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
              Light, gas, tools, stone. Built up one piece at a time.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <Link
              href="/search"
              className="text-sm font-medium text-[var(--aq-muted)] transition-colors hover:text-[#2f6a37]"
            >
              Shop all {total}
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[240px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[270px] lg:grid-cols-3">
          {tiles.map((c, i) => {
            const big = c.handle === "lighting";
            const shot = shotFor(c.handle);
            // Background variety on purpose: pale moss, white, deep green. Never six identical cards.
            const dark = c.handle === "co2" || c.handle === "testing";
            const surface = dark
              ? "bg-[var(--aq-deep)] text-white"
              : i % 2 === 0
                ? "bg-[var(--aq-raised)] text-[var(--aq-ink)]"
                : "bg-white text-[var(--aq-ink)] ring-1 ring-black/[0.07]";
            return (
              <Reveal
                key={c.handle}
                delay={i * 60}
                className={big ? `${BIG} h-full` : "h-full"}
              >
                <Spotlight className="h-full rounded-[1.75rem]" tint={dark ? "160 220 160" : "47 106 55"}>
                  <Link
                    href={`/search/${c.handle}`}
                    className={`group relative flex h-full overflow-hidden rounded-[1.75rem] ${surface}`}
                  >
                    {shot?.featuredImage?.url && (
                      <div className={`absolute ${big ? "inset-y-0 right-0 w-[62%]" : "inset-y-0 right-0 w-[52%]"}`}>
                        <Image
                          src={shot.featuredImage.url}
                          alt={shot.featuredImage.altText || shot.title}
                          fill
                          sizes={big ? "(min-width:1024px) 40vw, 80vw" : "(min-width:1024px) 18vw, 40vw"}
                          className={`object-contain p-6 transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] ${dark ? "rounded-2xl bg-white p-4 m-5 !h-[calc(100%-2.5rem)] !w-[calc(100%-2.5rem)]" : "mix-blend-multiply"}`}
                        />
                      </div>
                    )}
                    <div className="relative z-10 flex h-full max-w-[52%] flex-col justify-between p-6 md:p-7">
                      <span className="aq-spec text-[12px] opacity-60">
                        {counts[c.handle]} {counts[c.handle] === 1 ? "product" : "products"}
                      </span>
                      <div>
                        <h3 className={big ? "text-2xl font-semibold leading-tight md:text-4xl" : "text-lg font-semibold leading-snug md:text-xl"}>
                          {c.title}
                        </h3>
                        <span className={`mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 ${dark ? "bg-white/15 text-white" : "bg-[var(--aq-ink)] text-white"}`}>
                          <Arrow />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Spotlight>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── KITS ─────────────────────────────────────────── */}
      {bundles.length > 0 && (
        <section className="border-y border-black/[0.06] bg-white">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-20 md:grid-cols-[0.85fr_1.15fr] md:px-12 md:py-28">
            <Reveal>
              <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
                Start with a kit, not a shopping list.
              </h2>
              <p className="mt-5 max-w-sm leading-relaxed text-[var(--aq-muted)]">
                Parts sized to work together, priced below buying them one by
                one. Everything in a kit is also sold on its own.
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {bundles.map((p, i) => (
                <Reveal key={p.id} delay={i * 90} className="h-full">
                  <ProductCard
                    product={p}
                    badge="Kit"
                    sizes="(min-width:768px) 32vw, 90vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LIGHTING RAIL ────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <h2 className="max-w-md text-3xl font-semibold leading-tight md:text-5xl">
              Light decides what your plants can do.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <Link
              href="/search/lighting"
              className="text-sm font-medium text-[var(--aq-muted)] transition-colors hover:text-[#2f6a37]"
            >
              All lighting
            </Link>
          </Reveal>
        </div>
        <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:mx-0 md:px-0">
          {heroLights.map((p, i) => (
            <div
              key={p.id}
              className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[24%]"
            >
              <Reveal delay={i * 60} className="h-full">
                <ProductCard
                  product={p}
                  sizes="(min-width:1024px) 24vw, 78vw"
                />
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* ── GUIDES ───────────────────────────────────────── */}
      {GUIDES_META.length > 0 && (
        <section className="border-t border-black/[0.07]">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-12 md:py-24">
            <Reveal>
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                Guides from people who keep tanks.
              </h2>
              <p className="mt-4 max-w-sm leading-relaxed text-[var(--aq-muted)]">
                When a cheaper option is the smarter buy, the guide says so.
              </p>
              <Link
                href="/guides"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6a37]"
              >
                All guides <Arrow />
              </Link>
            </Reveal>
            <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
              {GUIDES_META.slice(0, 4).map((g, i) => (
                <Reveal key={g.slug} delay={i * 60}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="group flex items-start justify-between gap-6 py-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-[#2f6a37]">
                        {g.title}
                      </h3>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--aq-muted)]">
                        {g.description}
                      </p>
                    </div>
                    <span className="aq-spec mt-1 flex-none text-[12px] text-[var(--aq-muted)]">
                      {g.readingMinutes} min
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WELCOME OFFER ────────────────────────────────── */}
      <section className="bg-[var(--aq-deep)] text-white">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-20 md:grid-cols-2 md:px-12 md:py-24">
          <Reveal>
            <h2 className="max-w-md text-3xl font-semibold leading-tight md:text-5xl">
              10% off your first order.
            </h2>
            <p className="mt-4 max-w-md text-white/65">
              Restocks, new gear and scaping guides. Unsubscribe whenever you
              like.
            </p>
          </Reveal>
          <Reveal
            delay={80}
            className="md:justify-self-end md:w-full md:max-w-sm"
          >
            <NewsletterForm source="homepage" />
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
