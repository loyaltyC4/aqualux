import Image from "next/image";
import Link from "next/link";
import Footer from "components/layout/footer";
import { ProductCard } from "components/product-card";
import { Reveal } from "components/reveal";
import { NewsletterForm } from "components/newsletter-form";
import { getCollectionProducts } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import { COLLECTIONS, COLLECTION_IMAGE } from "lib/brand";

export const metadata = {
  title: "Planted Aquarium Lighting, CO2 & Aquascaping Tools | Aqualux",
  description:
    "Planted aquarium lighting, CO2 systems, aquascaping tools, aqua soil and water test kits. Curated on real specs. Free worldwide shipping over $79.",
  alternates: { canonical: "/" },
};

const price = (p: Product) => parseFloat(p.priceRange.minVariantPrice.amount);

export default async function HomePage() {
  const [lighting, co2, tools, hardscape, testing] = await Promise.all([
    getCollectionProducts({ collection: "lighting" }),
    getCollectionProducts({ collection: "co2" }),
    getCollectionProducts({ collection: "tools" }),
    getCollectionProducts({ collection: "hardscape" }),
    getCollectionProducts({ collection: "testing" }),
  ]);

  const counts: Record<string, number> = {
    lighting: lighting.length,
    co2: co2.length,
    tools: tools.length,
    hardscape: hardscape.length,
    testing: testing.length,
  };
  const total =
    lighting.length +
    co2.length +
    tools.length +
    hardscape.length +
    testing.length;

  const bundles = [...lighting, ...co2]
    .filter((p) => p.handle.includes("bundle"))
    .sort((a, b) => price(a) - price(b));
  const heroLights = lighting
    .filter((p) => !p.handle.includes("bundle"))
    .sort((a, b) => price(a) - price(b));

  return (
    <div className="aq-grain bg-[var(--aq-deep)] text-[var(--aq-bone)]">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[92dvh] items-center overflow-hidden">
        <Image
          src="/brand/hero.jpg"
          alt="A planted freshwater aquascape lit by a warm full-spectrum LED bar"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg,#060d0e 0%,rgba(6,13,14,.94) 32%,rgba(6,13,14,.55) 58%,rgba(6,13,14,.12) 100%)",
          }}
        />
        <div
          aria-hidden
          className="aq-caustic pointer-events-none absolute -left-1/4 top-0 h-full w-3/4"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 30%, rgba(242,169,59,.16), transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1400px] px-6 pt-24 md:px-12">
          <div className="max-w-xl">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-[#f2a93b]/30 bg-[#f2a93b]/[0.07] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#f2a93b]">
                Planted tank specialists
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-7 text-4xl font-semibold leading-[1.04] md:text-6xl lg:text-[4.1rem]">
                Grow the tank
                <br />
                you keep{" "}
                <em className="not-italic text-[#f2a93b]">redrawing</em>
                <span className="text-[#f2a93b]">.</span>
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
                  className="group inline-flex items-center gap-3 rounded-full bg-[#f2a93b] py-2 pl-6 pr-2 text-sm font-semibold text-[#1a1205] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:brightness-[1.07] active:scale-[0.98]"
                >
                  Shop lighting
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:scale-105">
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
                  className="rounded-full border border-[var(--aq-line)] px-6 py-3 text-sm font-medium text-[var(--aq-bone)] transition-colors duration-500 hover:border-[#f2a93b]/50 hover:text-[#f2a93b]"
                >
                  All {total} products
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP (below hero, not inside it) ──────── */}
      <div className="border-y border-[var(--aq-line)] bg-[var(--aq-panel)]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px px-6 md:grid-cols-4 md:px-12">
          {[
            ["Free shipping", "on orders over $79"],
            ["30-day returns", "unused, in packaging"],
            ["Real specs", "PAR, spectrum, dimensions"],
            ["Ships in 1-2 days", "tracked worldwide"],
          ].map(([t, d]) => (
            <div key={t} className="py-6 md:py-7">
              <p className="text-sm font-medium text-[var(--aq-bone)]">{t}</p>
              <p className="mt-1 text-[13px] text-[var(--aq-muted)]">{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORY BENTO (5 items, 5 cells, asymmetric) ── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
        <Reveal>
          <h2 className="max-w-lg text-3xl font-semibold leading-tight md:text-5xl">
            Five things a planted tank actually needs.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">
          {COLLECTIONS.map((c, i) => {
            // asymmetric bento: 2 large cells, 3 smaller
            const span =
              i === 0
                ? "md:col-span-4 md:row-span-1"
                : i === 1
                  ? "md:col-span-2 md:row-span-1"
                  : "md:col-span-2 md:row-span-1";
            const tall = i === 0;
            return (
              <Reveal key={c.handle} delay={i * 70} className={span}>
                <Link
                  href={`/search/${c.handle}`}
                  className="group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-[var(--aq-line)] p-1.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#f2a93b]/35"
                  style={tall ? { minHeight: "320px" } : undefined}
                >
                  <div className="absolute inset-1.5 overflow-hidden rounded-[calc(1.75rem-0.375rem)]">
                    <Image
                      src={COLLECTION_IMAGE[c.handle] ?? "/brand/hero.jpg"}
                      alt={c.title}
                      fill
                      sizes="(min-width:768px) 45vw, 100vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060d0e] via-[#060d0e]/45 to-transparent" />
                  </div>
                  <div className="relative p-6">
                    <h3 className="text-xl font-semibold md:text-2xl">
                      {c.title}
                    </h3>
                    <p className="aq-spec mt-1 text-[13px] text-[#f2a93b]">
                      {counts[c.handle]} products
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── BUNDLES (different layout family: editorial split) ── */}
      {bundles.length > 0 && (
        <section className="border-y border-[var(--aq-line)] bg-[var(--aq-panel)]">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-24 md:grid-cols-[0.85fr_1.15fr] md:px-12 md:py-32">
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
                className="mt-8 inline-block text-sm font-medium text-[#f2a93b] underline-offset-4 hover:underline"
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

      {/* ── LIGHTING RAIL (different family: horizontal scroll) ── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <h2 className="max-w-md text-3xl font-semibold leading-tight md:text-5xl">
              Light is the variable that decides everything.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <Link
              href="/search/lighting"
              className="text-sm font-medium text-[var(--aq-muted)] transition-colors hover:text-[#f2a93b]"
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

      {/* ── WELCOME OFFER (different family: centered band) ── */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 md:px-12 md:pb-32">
        <Reveal>
          <div className="rounded-[2rem] border border-[var(--aq-line)] bg-white/[0.02] p-1.5">
            <div className="flex flex-col items-center gap-8 rounded-[calc(2rem-0.375rem)] bg-[var(--aq-panel2)] px-8 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:px-16">
              <h2 className="max-w-lg text-3xl font-semibold leading-tight md:text-4xl">
                Get 10% off your first order.
              </h2>
              <p className="max-w-md text-[var(--aq-muted)]">
                New gear, restocks and scaping guides. No spam, unsubscribe
                anytime.
              </p>
              <NewsletterForm source="homepage" />
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
