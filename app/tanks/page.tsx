import Link from "next/link";
import Footer from "components/layout/footer";
import { pageMeta } from "lib/seo";
import { baseUrl } from "lib/utils";
import { TANKS } from "lib/tanks";

export const metadata = pageMeta({
  title: "Planted Tank Setups by Size: 5 to 55 Gallons",
  description:
    "Pick your tank size and get the light that fits, the heater wattage, filter flow, how much substrate to buy, and plants that suit it. 5, 10, 20, 29, 40 breeder, 55 gallon and 60P.",
  path: "/tanks",
});

export default function TanksHub() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Planted tank setups by size",
    url: `${baseUrl}/tanks`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: TANKS.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${baseUrl}/tanks/${t.slug}`,
        name: `${t.name} planted tank setup`,
      })),
    },
  };
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
          Planted tank setups, by tank size.
        </h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-[var(--aq-muted)]">
          Choose the tank you have. Each page works out the light that fits,
          heater wattage, filter flow and substrate from its real dimensions.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TANKS.map((t, i) => (
            <Link
              key={t.slug}
              href={`/tanks/${t.slug}`}
              className={`group flex flex-col justify-between rounded-2xl p-6 ring-1 ring-[var(--aq-line)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-32px_rgba(15,29,24,0.4)] ${
                i === 0 || i === 5
                  ? "bg-[var(--aq-deep)] text-white ring-transparent"
                  : "bg-white"
              }`}
            >
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {t.name.split(" (")[0]}
                </p>
                <p
                  className={`aq-spec mt-1 text-sm ${i === 0 || i === 5 ? "text-white/60" : "text-[var(--aq-muted)]"}`}
                >
                  {t.cm[0]}x{t.cm[1]}x{t.cm[2]} cm, {t.netL} L
                </p>
              </div>
              <p
                className={`mt-8 text-sm leading-relaxed ${i === 0 || i === 5 ? "text-white/75" : "text-[var(--aq-muted)]"}`}
              >
                {t.style}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-14 rounded-2xl bg-[var(--aq-raised)] p-8 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Tank not listed?
            </h2>
            <p className="mt-2 text-[var(--aq-muted)]">
              Enter any length and depth and get substrate in litres and kilos.
            </p>
          </div>
          <Link
            href="/tools/substrate-calculator"
            className="mt-5 inline-flex rounded-full bg-[var(--aq-ink)] px-6 py-3 text-sm font-semibold text-white active:scale-[0.98] md:mt-0"
          >
            Open calculator
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
