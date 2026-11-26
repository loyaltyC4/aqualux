import Link from "next/link";
import Footer from "components/layout/footer";
import { HeaterCalculator } from "components/tools/calculators";
import { pageMeta } from "lib/seo";
import { baseUrl } from "lib/utils";

export const metadata = pageMeta({
  title: "Aquarium Heater Size Calculator: Watts per Gallon",
  description: "What size aquarium heater do you need? Enter tank volume and how far above room temperature you keep it to get watts, the nearest heater size and a two-heater option.",
  path: "/tools/aquarium-heater-size-calculator",
});

const FAQ = [{"q": "What size heater for a 29 gallon tank?", "a": "About 100 W for a typical 10°F rise above room temperature (29 × 3.5 = about 100 W). In a cold room, 150 W."}, {"q": "Can a heater be too big?", "a": "A bigger heater reaches temperature faster and the thermostat switches it off, so slight oversizing is fine. The risk is a thermostat that sticks on, so do not go far above the size you need."}, {"q": "Where should the heater go?", "a": "Near the filter outlet or in the flow, so heated water is carried around the tank, and fully below the water line unless the heater is marked as safe partly submerged."}];
const BODY = [{"h": "The rule of thumb", "p": "Most guides use 2.5 to 5 watts per US gallon. The low end is for a small temperature rise in a warm room; the high end is for a cold room or a tank kept well above it. The calculator picks a band from the temperature rise you enter."}, {"h": "One heater or two", "p": "On tanks over about 40 gallons, two heaters of half the wattage each, at opposite ends, give more even heat. If one fails off the other still holds the tank warm; if one sticks on it is less able to cook the tank on its own."}];
const LINKS = [{"href": "/search/heating", "label": "Aquarium heaters"}, {"href": "/tools/aquarium-volume-calculator", "label": "Aquarium volume calculator"}, {"href": "/tanks", "label": "Planted tanks by size"}];

export default function Page() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Aquarium heater size calculator", url: `${baseUrl}/tools/aquarium-heater-size-calculator`,
      applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${baseUrl}/tools` },
      { "@type": "ListItem", position: 3, name: "Aquarium heater size calculator", item: `${baseUrl}/tools/aquarium-heater-size-calculator` } ] },
  ];
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <p className="text-sm text-[var(--aq-muted)]"><Link href="/tools" className="underline underline-offset-2">Tools</Link></p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">{"Aquarium heater size calculator"}</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-[var(--aq-muted)]">{"Heater size depends on two things: how much water there is and how far above room temperature you hold it. Enter both to get a wattage."}</p>
        <div className="mt-10"><HeaterCalculator /></div>
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
