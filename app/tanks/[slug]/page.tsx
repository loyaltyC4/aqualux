import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "components/layout/footer";
import { SpecGrid } from "components/tanks/spec-grid";
import { getProduct } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import { pageMeta } from "lib/seo";
import { baseUrl } from "lib/utils";
import { TANKS, TANKS_UPDATED, getTank, tankFaq, type Pick } from "lib/tanks";

export function generateStaticParams() {
  return TANKS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTank(slug);
  if (!t) return {};
  const name = t.name
    .split(" (")[0]!
    .replace(/\b[a-z]/g, (c) => c.toUpperCase());
  const title = `${name} Planted Tank Setup: Light, Heater, Substrate`;
  return pageMeta({
    title,
    description: `${t.name} planted tank (${t.cm[0]}x${t.cm[1]}x${t.cm[2]} cm): ${t.substrate[1]!.litres} L of substrate, a ${t.heater.watts} W heater, ${t.flowLph[0]}-${t.flowLph[1]} L/h of flow, and the light that fits.`,
    path: `/tanks/${t.slug}`,
    type: "article",
  });
}

type Resolved = Pick & { product: Product };

async function resolve(picks: (Pick | null)[]): Promise<Resolved[]> {
  const out = await Promise.all(
    picks.map(async (p) => {
      if (!p) return null;
      const product = await getProduct(p.handle);
      return product ? { ...p, product } : null;
    }),
  );
  return out.filter((x): x is Resolved => x !== null);
}

function PickRow({ pick, role }: { pick: Resolved; role: string }) {
  const price = Math.round(
    parseFloat(
      (pick.variant &&
        pick.product.variants.find((v) => v.title === pick.variant)?.price
          .amount) ||
        pick.product.priceRange.minVariantPrice.amount,
    ),
  );
  return (
    <Link
      href={`/product/${pick.product.handle}`}
      className="group grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-[var(--aq-line)] transition-shadow duration-500 hover:shadow-[0_20px_40px_-28px_rgba(15,29,24,0.35)]"
    >
      <div className="relative h-[72px] w-[72px] overflow-hidden rounded-xl bg-[var(--aq-raised)]">
        {pick.product.featuredImage?.url ? (
          <Image
            src={pick.product.featuredImage.url}
            alt={pick.product.title}
            fill
            sizes="72px"
            className="object-contain p-1.5 mix-blend-multiply"
          />
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--aq-muted)]">{role}</p>
        <p className="mt-0.5 truncate text-[15px] font-semibold group-hover:text-[#2f6a37]">
          {pick.product.title}
        </p>
        <p className="mt-0.5 text-sm leading-snug text-[var(--aq-muted)]">
          {pick.why}
        </p>
      </div>
      <p className="aq-spec pr-2 text-sm">${price}</p>
    </Link>
  );
}

export default async function TankPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getTank(slug);
  if (!t) notFound();

  const [light, filter, co2, extras] = await Promise.all([
    resolve([t.light]),
    resolve([t.filter]),
    resolve([t.co2Pick]),
    resolve(t.extras),
  ]);
  const faq = tankFaq(t);
  const others = TANKS.filter((x) => x.slug !== t.slug);
  const url = `${baseUrl}/tanks/${t.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${t.name} planted tank setup`,
      description: t.summary,
      dateModified: TANKS_UPDATED,
      datePublished: TANKS_UPDATED,
      mainEntityOfPage: url,
      image: [`${baseUrl}/opengraph-image`],
      author: { "@type": "Organization", name: "Lush Aquarium", url: baseUrl },
      publisher: {
        "@type": "Organization",
        name: "Lush Aquarium",
        url: baseUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tank setups",
          item: `${baseUrl}/tanks`,
        },
        { "@type": "ListItem", position: 3, name: t.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const [ci, wi, hi] = t.dims;

  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {jsonLd.map((j, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }}
        />
      ))}
      <article className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--aq-muted)]">
          <Link href="/tanks" className="hover:text-[#2f6a37]">
            Tank setups
          </Link>
          <span className="px-2">/</span>
          <span>{t.name}</span>
        </nav>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
          {t.name} planted tank setup
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-[var(--aq-muted)]">
          {t.summary}
        </p>

        <div className="mt-10">
          <SpecGrid
            items={[
              {
                label: "Dimensions",
                value: `${t.cm[0]}x${t.cm[1]}x${t.cm[2]} cm`,
                note: `${ci} x ${wi} x ${hi} in outer`,
              },
              {
                label: "Water volume",
                value: `${t.netL} L`,
                note: `${t.grossL} L (${t.grossGal} gal) gross, less substrate and rock`,
              },
              {
                label: "Substrate, 3 in average",
                value: `${t.substrate[1]!.litres} L`,
                note: `${t.substrate[1]!.soilKg} kg aqua soil or ${t.substrate[1]!.sandKg} kg sand`,
              },
              {
                label: "Heater",
                value: `${t.heater.watts} W`,
                note: t.heater.perGal,
              },
              {
                label: "Filter flow",
                value: `${t.flowLph[0]}-${t.flowLph[1]}`,
                note: "litres per hour, 4-6x turnover",
              },
              {
                label: "Light timer",
                value: t.photoperiod,
                note:
                  t.co2 === "recommended" ? "with CO2 running" : "without CO2",
              },
            ]}
          />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                Lighting
              </h2>
              <p className="mt-3 max-w-[65ch] leading-7 text-[var(--aq-ink)]/85">
                {t.lightNote}
              </p>
              {light[0] ? (
                <div className="mt-5">
                  <PickRow pick={light[0]} role="Fits this tank" />
                </div>
              ) : (
                <p className="mt-4 text-sm">
                  <Link
                    href="/search/lighting"
                    className="text-[#2f6a37] underline underline-offset-2"
                  >
                    See all planted tank lights
                  </Link>
                </p>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                Filtration
              </h2>
              <p className="mt-3 max-w-[65ch] leading-7 text-[var(--aq-ink)]/85">
                {t.filterNote}
              </p>
              {filter[0] ? (
                <div className="mt-5">
                  <PickRow pick={filter[0]} role="Right-sized filter" />
                </div>
              ) : null}
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">CO2</h2>
              <p className="mt-3 max-w-[65ch] leading-7 text-[var(--aq-ink)]/85">
                {t.co2Note}
              </p>
              {co2[0] ? (
                <div className="mt-5">
                  <PickRow pick={co2[0]} role="CO2 option" />
                </div>
              ) : null}
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                Substrate by depth
              </h2>
              <p className="mt-3 max-w-[65ch] leading-7 text-[var(--aq-ink)]/85">
                Slope it: shallower at the front glass, deeper at the back. The
                average depth is what sets how much you buy.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {t.substrate.map((s) => (
                  <div
                    key={s.depthIn}
                    className="rounded-2xl bg-white p-4 ring-1 ring-[var(--aq-line)]"
                  >
                    <p className="text-sm text-[var(--aq-muted)]">
                      {s.depthIn} in average
                    </p>
                    <p className="aq-spec mt-1 text-2xl">{s.litres} L</p>
                    <p className="mt-1 text-xs text-[var(--aq-muted)]">
                      {s.soilKg} kg soil, {s.sandKg} kg sand
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm">
                <Link
                  href="/tools/substrate-calculator"
                  className="text-[#2f6a37] underline underline-offset-2"
                >
                  Custom tank? Use the substrate calculator
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                What to plant
              </h2>
              <p className="mt-3 text-[var(--aq-muted)]">Suits: {t.style}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {t.plants.map((p) => (
                  <li
                    key={p}
                    className="rounded-xl bg-[var(--aq-raised)] px-4 py-3 text-[15px]"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                Fish and shrimp
              </h2>
              <p className="mt-3 max-w-[65ch] leading-7 text-[var(--aq-ink)]/85">
                {t.stocking}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                Mistakes that cost people this tank
              </h2>
              <ol className="mt-4 space-y-4">
                {t.pitfalls.map((p, i) => (
                  <li
                    key={p}
                    className="grid grid-cols-[2rem_1fr] gap-2 leading-7"
                  >
                    <span className="aq-spec text-[#2f6a37]">{i + 1}</span>
                    <span className="text-[var(--aq-ink)]/85">{p}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                Quick answers
              </h2>
              <dl className="mt-4 divide-y divide-[var(--aq-line)]">
                {faq.map((f) => (
                  <div key={f.q} className="py-4">
                    <dt className="font-semibold">{f.q}</dt>
                    <dd className="mt-1.5 leading-7 text-[var(--aq-ink)]/80">
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-lg font-semibold tracking-tight">
              The rest of the build
            </h2>
            <div className="mt-4 space-y-3">
              {extras.map((e) => (
                <PickRow
                  key={e.handle}
                  pick={e}
                  role={
                    e.product.title.split(" ")[0] === "Aqua"
                      ? "Substrate"
                      : "Also needed"
                  }
                />
              ))}
            </div>
            <nav aria-label="Other tank sizes" className="mt-10">
              <h2 className="text-lg font-semibold tracking-tight">
                Other tank sizes
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/tanks/${o.slug}`}
                    className="rounded-full border border-[var(--aq-line)] bg-white px-3.5 py-1.5 text-sm hover:border-[#2f6a37] hover:text-[#2f6a37]"
                  >
                    {o.short}
                  </Link>
                ))}
              </div>
            </nav>
          </aside>
        </div>
      </article>
      <Footer />
    </div>
  );
}
