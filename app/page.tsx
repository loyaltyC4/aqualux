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
import { GUIDES_META } from "lib/guides";

export const metadata = {
  title: {
    absolute:
      "Lush Aquarium | Planted Tank Lighting, CO2 & Aquascaping Gear in Australia",
  },
  description:
    "Planted aquarium lighting, CO2 systems, aquascaping tools and water test kits, chosen on real specs. Free shipping over $99 in Australia and NZ, tracked delivery worldwide.",
  alternates: { canonical: "/" },
};

const price = (p: Product) => parseFloat(p.priceRange.minVariantPrice.amount);

const USP: [typeof TruckIcon, string, string][] = [
  [TruckIcon, "Free shipping", `over $${FREE_SHIPPING_THRESHOLD} to AU & NZ`],
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

  const tiles = BENTO_ORDER.map((h) =>
    COLLECTIONS.find((c) => c.handle === h),
  ).filter((c): c is (typeof COLLECTIONS)[number] => Boolean(c));

  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {/* ── HERO: the tank is the photograph ─────────────
          No scroll-reveal here: the H1 and image are the LCP candidates and
          must paint immediately. */}
      <section className="relative overflow-hidden bg-[#041213] text-white">
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="/brand/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041213] via-[#041213]/55 to-transparent lg:via-transparent" />
        </div>
        <div className="relative mx-auto flex w-full max-w-[1400px] flex-col px-6 pt-14 md:min-h-[min(80vh,740px)] md:justify-center md:px-12 md:py-24">
          <div className="relative z-10 max-w-[33rem]">
            <h1 className="text-[2.5rem] font-semibold leading-[1.03] md:text-6xl lg:text-[4.3rem]">
              Everything your planted tank needs to grow.
            </h1>
            <p className="mt-6 max-w-[30rem] text-base leading-relaxed text-white/70 md:text-lg">
              Full-spectrum lights, CO2 and scaping tools chosen on real specs.
              Free shipping over ${FREE_SHIPPING_THRESHOLD} in Australia and NZ.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/search/lighting"
                className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-semibold text-[var(--aq-ink)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
              >
                Shop lighting
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2f6a37] text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
                  <Arrow />
                </span>
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium text-white/80 underline decoration-white/30 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white"
              >
                Browse all {total} products
              </Link>
            </div>
          </div>

          {/* Mobile: the tank sits under the copy instead of behind it. */}
          <div className="relative -mx-6 mt-10 aspect-[5/4] md:hidden">
            <Image
              src="/brand/hero.jpg"
              alt="A planted aquascape with a grass carpet and dragon stone under a full-spectrum LED"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[78%_50%]"
            />
          </div>
        </div>
      </section>

      {/* ── USP STRIP ────────────────────────────────────── */}
      <div className="border-b border-black/[0.07] bg-white">
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

        <div className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[250px] lg:grid-cols-3">
          {tiles.map((c, i) => {
            const big = c.handle === "lighting";
            return (
              <Reveal
                key={c.handle}
                delay={i * 60}
                className={big ? `${BIG} h-full` : "h-full"}
              >
                <Link
                  href={`/search/${c.handle}`}
                  className="group relative block h-full overflow-hidden rounded-2xl bg-[#0c1a14]"
                >
                  <Image
                    src={COLLECTION_IMAGE[c.handle] ?? "/brand/hero.jpg"}
                    alt=""
                    fill
                    sizes={
                      big
                        ? "(min-width:1024px) 66vw, 100vw"
                        : "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    }
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                    <div>
                      <h3
                        className={
                          big
                            ? "text-2xl font-semibold text-white md:text-4xl"
                            : "text-lg font-semibold text-white md:text-xl"
                        }
                      >
                        {c.title}
                      </h3>
                      <p className="aq-spec mt-1 text-[13px] text-white/65">
                        {counts[c.handle]}{" "}
                        {counts[c.handle] === 1 ? "product" : "products"}
                      </p>
                    </div>
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-[var(--aq-ink)]">
                      <Arrow />
                    </span>
                  </div>
                </Link>
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
