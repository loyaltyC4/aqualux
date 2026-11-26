import Link from "next/link";
import Footer from "components/layout/footer";
import { Co2Calculator } from "components/tools/calculators";
import { pageMeta } from "lib/seo";
import { baseUrl } from "lib/utils";

export const metadata = pageMeta({
  title: "Aquarium CO2 Calculator: ppm from KH and pH",
  description: "Find the CO2 level in your planted tank from KH and pH using the standard formula, see the pH to aim for at 30 ppm, and why a drop checker is the better daily check.",
  path: "/tools/co2-ppm-calculator",
});

const FAQ = [{"q": "How much CO2 should a planted tank have?", "a": "Around 20 to 30 ppm is the usual target for a high-tech planted tank. Below that, demanding plants and carpets grow slowly; well above it, fish gasp at the surface."}, {"q": "What is the 1 pH drop rule?", "a": "Leave a cup of tank water out for 24 hours so it loses its CO2, measure its pH, then aim for the tank to sit about 1.0 pH lower by lights-on. A 1.0 drop is roughly a tenfold rise in CO2, landing near 30 ppm in most tanks."}, {"q": "Is a drop checker more accurate than a pH test?", "a": "For day-to-day use, yes, because its sealed reference solution is not affected by the other buffers in your tank. It reacts about two hours behind the tank, so read it near the end of the photoperiod."}];
const BODY = [{"h": "The formula", "p": "CO2 (ppm) = 3 × KH (dKH) × 10^(7 − pH). Each full drop in pH means ten times more CO2 at the same KH. That is why a fall of 1.0 pH unit from degassed water to lights-on is the usual target: it puts most tanks close to 30 ppm."}, {"h": "When the number is wrong", "p": "The formula assumes carbonate is the only thing buffering the water. Phosphate-based buffers, tannins from driftwood, peat and fresh aqua soil all lower pH without adding CO2, so the calculator reads high. Use it to understand the relationship, and a drop checker with 4 dKH reference solution for the daily check: green is roughly on target, blue is low, yellow is too much."}];
const LINKS = [{"href": "/search/co2", "label": "Aquarium CO2 systems"}, {"href": "/product/glass-drop-checker-4dkh-solution", "label": "Glass drop checker with 4 dKH solution"}, {"href": "/guides/pressurised-co2-setup-guide", "label": "Pressurised CO2 setup guide"}];

export default function Page() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Aquarium CO2 calculator (KH and pH)", url: `${baseUrl}/tools/co2-ppm-calculator`,
      applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${baseUrl}/tools` },
      { "@type": "ListItem", position: 3, name: "Aquarium CO2 calculator (KH and pH)", item: `${baseUrl}/tools/co2-ppm-calculator` } ] },
  ];
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <p className="text-sm text-[var(--aq-muted)]"><Link href="/tools" className="underline underline-offset-2">Tools</Link></p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">{"Aquarium CO2 calculator (KH and pH)"}</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-[var(--aq-muted)]">{"Enter your KH and the pH with CO2 running. The calculator uses the standard KH/pH relationship to estimate dissolved CO2 in ppm."}</p>
        <div className="mt-10"><Co2Calculator /></div>
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
