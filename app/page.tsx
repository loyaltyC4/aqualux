import Image from "next/image";
import Link from "next/link";
import Footer from "components/layout/footer";
import { ProductCard } from "components/product-card";
import { Reveal } from "components/reveal";
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
  COLLECTION_IMAGE,
  FREE_SHIPPING_THRESHOLD,
} from "lib/brand";

export const metadata = {
  title: "Planted Aquarium Lighting, CO2 & Aquascaping Tools",
  description:
    "Planted aquarium lighting, CO2 systems, aquascaping tools and water test kits, shipped worldwide from a curated range chosen on real specs, with delivery windows quoted per destination.",
  alternates: { canonical: "/" },
};

const price = (p: Product) => parseFloat(p.priceRange.minVariantPrice.amount);

const USP: [typeof TruckIcon, string, string][] = [
  [TruckIcon, "Free shipping", `over $${FREE_SHIPPING_THRESHOLD} to AU & NZ`],
  [ArrowPathIcon, "30-day returns", "unused, in packaging"],
  [
    ClipboardDocumentCheckIcon,
    "Real specs",
    "PAR, spectrum, dimensions",
  ],
  [GlobeAltIcon, "Ships worldwide", "tracked, dispatched in 1-2 days"],
];

export default async function HomePage() {
  // Derived from COLLECTIONS rather than listed by hand — the hardcoded
  // five-collection version silently excluded Filtration from both the tile
  // counts and the "All N products" figure the moment it was added.
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
  // Distinct products: a handle can legitimately sit in more than one
  // collection, so counting the fetches would double-count it.
  const total = new Set(fetched.flat().map((p) => p.handle)).size;

  const lighting = byHandle["lighting"] ?? [];
  const co2 = byHandle["co2"] ?? [];

  const bundles = [...lighting, ...co2]
    .filter((p) => p.handle.includes("bundle"))
    .sort((a, b) => price(a) - price(b));
  const heroLights = lighting
    .filter((p) => !p.handle.includes("bundle"))
    .sort((a, b) => price(a) - price(b));

  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {/* ── HERO — typography-led, light ─────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 pb-16 pt-14 md:px-12 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-[#0e7490]/25 bg-[#0e7490]/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#0e7490]">
                Planted tank specialists
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] md:text-6xl lg:text-[4.1rem]">
                Grow the tank
                <br />
                you keep{" "}
                <em className="not-italic text-[#0e7490]">redrawing</em>
                <span className="text-[#0e7490]">.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--aq-muted)] md:text-lg">
                Lighting, CO2 and tools for planted aquariums, chosen on specs
                instead of marketing.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/search/lighting"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#0e7490] py-2 pl-6 pr-2 text-sm font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#155e75] active:scale-[0.98]"
                >
                  Shop lighting
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:scale-105">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                    >
                      <path
                        d="M5 12h13M13 6l6 6-6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/search"
                  className="rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-[var(--aq-ink)] transition-colors duration-300 hover:border-[#0e7490]/50 hover:text-[#0e7490]"
                >
                  All {total} products
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={120} className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-black/10 shadow-[0_30px_60px_-35px_rgba(19,42,53,0.4)]">
              <Image
                src="/brand/hero.jpg"
                alt="A planted freshwater aquascape lit by a full-spectrum LED bar"
                fill
                priority
                sizes="(min-width:1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TRUST / USP BAR ──────────────────────────────── */}
      <div className="border-y border-black/10 bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px px-6 md:grid-cols-4 md:px-12">
          {USP.map(([Icon, t, d]) => (
            <div key={t} className="flex items-start gap-3 py-6 md:py-7">
              <Icon
                aria-hidden
                className="mt-0.5 h-5 w-5 flex-none text-[#0e7490]"
              />
              <div>
                <p className="text-sm font-medium text-[var(--aq-ink)]">{t}</p>
                <p className="mt-1 text-[13px] text-[var(--aq-muted)]">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORY TILES — uniform image, label below ──── */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <Reveal>
          <h2 className="max-w-lg text-3xl font-semibold leading-tight md:text-5xl">
            Everything a planted tank actually needs.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.handle} delay={i * 60}>
              <Link
                href={`/search/${c.handle}`}
                className="group block overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-[#0e7490]/40 hover:shadow-[0_20px_45px_-24px_rgba(19,42,53,0.28)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <Image
                    src={COLLECTION_IMAGE[c.handle] ?? "/brand/hero.jpg"}
                    alt={c.title}
                    fill
                    sizes="(min-width:768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-black/5 p-5">
                  <div>
                    <h3 className="text-base font-semibold md:text-lg">
                      {c.title}
                    </h3>
                    <p className="aq-spec mt-1 text-[13px] text-[var(--aq-muted)]">
                      {counts[c.handle]}{" "}
                      {counts[c.handle] === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-black/10 text-[var(--aq-ink)] transition-colors duration-300 group-hover:border-[#0e7490] group-hover:bg-[#0e7490] group-hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                    >
                      <path
                        d="M5 12h13M13 6l6 6-6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── BUNDLES (editorial split on a tinted band) ───── */}
      {bundles.length > 0 && (
        <section className="border-y border-black/5 bg-[var(--aq-raised)]">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-20 md:grid-cols-[0.85fr_1.15fr] md:px-12 md:py-28">
            <Reveal>
              <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
                Start with a kit,
                <br />
                not a shopping list.
              </h2>
              <p className="mt-5 max-w-sm text-[var(--aq-muted)]">
                The parts that work together, priced below buying them
                separately. Everything is listed individually too.
              </p>
              <Link
                href="/search"
                className="mt-8 inline-block text-sm font-medium text-[#0e7490] underline-offset-4 hover:underline"
              >
                Browse everything
              </Link>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {bundles.map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
                  <ProductCard
                    product={p}
                    badge="Bundle"
                    sizes="(min-width:768px) 32vw, 90vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LIGHTING RAIL (horizontal scroll) ────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <h2 className="max-w-md text-3xl font-semibold leading-tight md:text-5xl">
              Light is the variable that decides everything.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <Link
              href="/search/lighting"
              className="text-sm font-medium text-[var(--aq-muted)] transition-colors hover:text-[#0e7490]"
            >
              All lighting
            </Link>
          </Reveal>
        </div>
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none]">
          {heroLights.map((p, i) => (
            <div
              key={p.id}
              className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[27%]"
            >
              <Reveal delay={i * 60}>
                <ProductCard
                  product={p}
                  badge={i === 0 ? "Best seller" : undefined}
                  sizes="(min-width:1024px) 27vw, 80vw"
                />
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* ── WELCOME OFFER (centered band) ────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 pb-20 md:px-12 md:pb-28">
        <Reveal>
          <div className="rounded-3xl border border-black/10 bg-white px-8 py-14 text-center shadow-[0_20px_45px_-30px_rgba(19,42,53,0.25)] md:px-16">
            <h2 className="mx-auto max-w-lg text-3xl font-semibold leading-tight md:text-4xl">
              Get 10% off your first order.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[var(--aq-muted)]">
              New gear, restocks and scaping guides. No spam, unsubscribe
              anytime.
            </p>
            <div className="mt-8">
              <NewsletterForm source="homepage" />
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
