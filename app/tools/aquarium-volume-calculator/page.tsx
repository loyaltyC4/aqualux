import Link from "next/link";
import Footer from "components/layout/footer";
import { VolumeCalculator } from "components/tools/calculators";
import { pageMeta } from "lib/seo";
import { baseUrl } from "lib/utils";

export const metadata = pageMeta({
  title: "Aquarium Volume Calculator: Gallons and Litres",
  description: "Work out how many gallons or litres your fish tank holds from length, width and height, in inches or cm. Includes round tanks and the real water volume after substrate.",
  path: "/tools/aquarium-volume-calculator",
});

const FAQ = [{"q": "How many litres is a 20 gallon tank?", "a": "About 76 litres by glass volume (20 × 3.785). Expect 60 to 68 litres of water once substrate and decor are in."}, {"q": "How heavy is a full aquarium?", "a": "Water weighs about 1 kg per litre (8.3 lb per US gallon). Add roughly 10% for glass, substrate and rock. A 29 gallon tank comes to about 150 kg, which is why it needs a proper stand."}, {"q": "How do I measure a bow-front or corner tank?", "a": "Measure the widest point front to back and treat it as a rectangle, then take off about 10%. For an exact figure, fill it with a measured jug or check the maker's spec sheet."}];
const BODY = [{"h": "How to work out tank volume by hand", "p": "Multiply length by width by height. In inches, divide by 231 for US gallons. In centimetres, divide by 1,000 for litres. A 30 × 12 × 16 inch tank is 5,760 cubic inches, which is 24.9 US gallons, close to the 29 gallons on the box only once you include the trim and rounding the manufacturers use."}, {"h": "Why the real number is lower", "p": "Glass thickness, the water line sitting below the rim, substrate, rock and wood all take space. In a planted tank with a 3 inch sloped bed the water volume is often 10 to 20% below the glass volume. Use the lower figure for medication and fertiliser doses, and the higher one for filter and heater sizing."}];
const LINKS = [{"href": "/tanks", "label": "Planted tank guides by size"}, {"href": "/tools/substrate-calculator", "label": "Substrate calculator"}, {"href": "/tools/aquarium-heater-size-calculator", "label": "Heater size calculator"}];

export default function Page() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Aquarium volume calculator", url: `${baseUrl}/tools/aquarium-volume-calculator`,
      applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${baseUrl}/tools` },
      { "@type": "ListItem", position: 3, name: "Aquarium volume calculator", item: `${baseUrl}/tools/aquarium-volume-calculator` } ] },
  ];
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <p className="text-sm text-[var(--aq-muted)]"><Link href="/tools" className="underline underline-offset-2">Tools</Link></p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">{"Aquarium volume calculator"}</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-[var(--aq-muted)]">{"Enter the tank's outer dimensions. You get gallons, litres and an estimate of the water actually in the tank once substrate and hardscape are in."}</p>
        <div className="mt-10"><VolumeCalculator /></div>
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
