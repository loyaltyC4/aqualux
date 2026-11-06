import Link from "next/link";
import Footer from "components/layout/footer";
import { SubstrateCalculator } from "components/tanks/substrate-calculator";
import { pageMeta } from "lib/seo";
import { baseUrl } from "lib/utils";
import { TANKS } from "lib/tanks";

export const metadata = pageMeta({
  title: "Aquarium Substrate Calculator (Litres, kg and lb)",
  description:
    "How much aquarium substrate do you need? Enter tank length, depth and slope to get litres of aqua soil or sand, in kilograms and pounds. Includes standard tank sizes.",
  path: "/tools/substrate-calculator",
});

const FAQ = [
  {
    q: "How deep should planted tank substrate be?",
    a: "About 2 inches (5 cm) at the front glass rising to 3 to 4 inches (7.5 to 10 cm) at the back. Rooted plants like swords and crypts need the depth; the slope also makes a small tank look deeper.",
  },
  {
    q: "How much does aquarium substrate weigh per litre?",
    a: "Fired aqua soil weighs about 1.0 kg per litre. Aquarium sand and fine gravel are heavier, about 1.5 kg per litre. Bag weights vary by brand, so buy by volume when the bag lists litres.",
  },
  {
    q: "How do I calculate substrate for my aquarium?",
    a: "Multiply length by front-to-back width by the average depth (front depth plus back depth, divided by two). In inches, divide the result by 61 to get litres.",
  },
];

export default function SubstrateCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Aquarium substrate calculator",
      url: `${baseUrl}/tools/substrate-calculator`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {jsonLd.map((j, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }}
        />
      ))}
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
          Aquarium substrate calculator
        </h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-[var(--aq-muted)]">
          Set your tank size and slope. You get litres to buy, and the weight in
          aqua soil or sand.
        </p>
        <div className="mt-10">
          <SubstrateCalculator />
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Standard tank sizes
          </h2>
          <p className="mt-2 text-[var(--aq-muted)]">
            At a 3 inch average depth.
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl bg-white ring-1 ring-[var(--aq-line)]">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[var(--aq-muted)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Tank</th>
                  <th className="px-5 py-3 font-medium">Footprint</th>
                  <th className="px-5 py-3 font-medium">Litres</th>
                  <th className="px-5 py-3 font-medium">Aqua soil</th>
                  <th className="px-5 py-3 font-medium">Sand</th>
                </tr>
              </thead>
              <tbody className="aq-spec">
                {TANKS.map((t) => (
                  <tr key={t.slug} className="border-t border-[var(--aq-line)]">
                    <td className="px-5 py-3 font-sans">
                      <Link
                        href={`/tanks/${t.slug}`}
                        className="text-[#2f6a37] underline underline-offset-2"
                      >
                        {t.name.split(" (")[0]}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      {t.cm[0]}x{t.cm[1]} cm
                    </td>
                    <td className="px-5 py-3">{t.substrate[1]!.litres} L</td>
                    <td className="px-5 py-3">{t.substrate[1]!.soilKg} kg</td>
                    <td className="px-5 py-3">{t.substrate[1]!.sandKg} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            Quick answers
          </h2>
          <dl className="mt-4 divide-y divide-[var(--aq-line)]">
            {FAQ.map((f) => (
              <div key={f.q} className="py-4">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1.5 leading-7 text-[var(--aq-ink)]/80">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm">
            <Link
              href="/product/aqua-soil-planted-substrate"
              className="text-[#2f6a37] underline underline-offset-2"
            >
              Shop aqua soil for planted tanks
            </Link>
            <span className="px-2 text-[var(--aq-muted)]">or</span>
            <Link
              href="/guides/cheapest-aquarium-substrate"
              className="text-[#2f6a37] underline underline-offset-2"
            >
              read the cheapest substrate guide
            </Link>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
