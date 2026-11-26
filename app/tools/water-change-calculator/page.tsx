import Link from "next/link";
import Footer from "components/layout/footer";
import { WaterChangeCalculator } from "components/tools/calculators";
import { pageMeta } from "lib/seo";
import { baseUrl } from "lib/utils";

export const metadata = pageMeta({
  title: "Aquarium Water Change Calculator: How Much to Change",
  description: "Work out what percentage of aquarium water to change to bring nitrate down to your target, with gallons or litres. Uses the dilution formula and allows for nitrate in tap water.",
  path: "/tools/water-change-calculator",
});

const FAQ = [{"q": "How much water should I change each week?", "a": "Most planted and lightly stocked tanks do well with 25 to 30% weekly. Heavily stocked tanks, or tanks where nitrate climbs fast, often need 40 to 50%. Test nitrate before a change; the right amount is the one that keeps it under about 20 to 40 ppm."}, {"q": "How do I lower nitrate quickly?", "a": "A water change is the only quick fix. To bring 80 ppm down to 20 ppm with tap water at 0 ppm, change 75%. Do it over two days if the tank is heavily stocked, matching temperature each time."}, {"q": "What if my tap water already contains nitrate?", "a": "Enter it in the tap nitrate box. If tap water is at 20 ppm you cannot dilute below 20 ppm with it, and the calculator shows the percentage needed to reach your target from there."}, {"q": "Can I change too much water at once?", "a": "Changing 50% or less is generally safe if the new water matches temperature and is dechlorinated. Bigger single changes risk shocking fish with a pH or temperature swing, so split them."}];
const BODY = [{"h": "The formula behind it", "p": "When you replace a fraction of the tank with new water, the nitrate left is tap + (current − tap) × (1 − fraction). Solve for the fraction and you get (current − target) ÷ (current − tap). Nitrate you can test; the calculator just does the arithmetic."}, {"h": "Why a set weekly percentage is only a starting point", "p": "A planted tank takes nitrate up through the plants, a heavily stocked one produces it faster than any rule assumes. Test nitrate just before your water change a few weeks in a row: if it sits at 10 ppm, you can change less; if it reaches 40, change more or more often."}];
const LINKS = [{"href": "/tools/aquarium-volume-calculator", "label": "Aquarium volume calculator"}, {"href": "/guides/faster-water-changes", "label": "Faster water changes"}, {"href": "/guides/aquarium-water-testing-guide", "label": "Water testing guide"}, {"href": "/search/water-care", "label": "Water care products"}];

export default function Page() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Aquarium water change calculator", url: `${baseUrl}/tools/water-change-calculator`,
      applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${baseUrl}/tools` },
      { "@type": "ListItem", position: 3, name: "Aquarium water change calculator", item: `${baseUrl}/tools/water-change-calculator` } ] },
  ];
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <p className="text-sm text-[var(--aq-muted)]"><Link href="/tools" className="underline underline-offset-2">Tools</Link></p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">{"Aquarium water change calculator"}</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-[var(--aq-muted)]">{"Enter your water volume and nitrate readings. You get the percentage and volume to change to hit your target."}</p>
        <div className="mt-10"><WaterChangeCalculator /></div>
        {BODY.map((b) => (
          <section key={b.h} className="mt-14 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight">{b.h}</h2>
            <p className="mt-3 leading-7 text-[var(--aq-ink)]/80">{b.p}</p>
          </section>
        ))}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Quick answers</h2>
          <dl className="mt-4 divide-y divide-[var(--aq-line)]">
            {FAQ.map((f) => (
              <div key={f.q} className="py-4">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1.5 leading-7 text-[var(--aq-ink)]/80">{f.a}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="text-[#2f6a37] underline underline-offset-2">{l.label}</Link></li>
            ))}
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
}
