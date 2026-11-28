import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "components/layout/footer";
import { pageMeta } from "lib/seo";
import { baseUrl } from "lib/utils";
import { TANKS } from "lib/tanks";
import { DISPATCH_MIN_DAYS, DISPATCH_MAX_DAYS } from "lib/shipping";
import { COUNTRIES, EUROPE_PLUGS, ASIA_ROWS, countryBySlug, countryZone, countryWindow, fmtVolume } from "lib/countries";

export const dynamicParams = false;

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }));
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const place = (name: string) => name.replace(/^the /, "");

export async function generateMetadata(props: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await props.params;
  const c = countryBySlug(country);
  if (!c) return notFound();
  const z = countryZone(c);
  const w = countryWindow(c);
  return pageMeta({
    title: `Planted Aquarium Supplies Shipped to ${place(c.name)}`,
    description: `Planted aquarium lights, CO2, tools and substrate shipped to ${c.name}: ${w.min}-${w.max} business days, $${z.rate.toFixed(2)} flat rate, free over $${z.freeOver}. ${c.voltage} plug and tax guide.`,
    path: `/planted-aquarium-supplies/${c.slug}`,
  });
}

export default async function CountryPage(props: { params: Promise<{ country: string }> }) {
  const { country } = await props.params;
  const c = countryBySlug(country);
  if (!c) notFound();
  const z = countryZone(c);
  const w = countryWindow(c);
  const name = c.name;
  const Name = cap(name);
  const others = COUNTRIES.filter((x) => x.slug !== c.slug);
  const ampVolts = c.slug === "asia" ? ["100 V", "230 V"] : [c.voltage];
  const unitsLabel = c.units === "us" ? "US gallons" : c.units === "metric-us" ? "litres and US gallons" : c.units === "metric-uk" ? "litres and imperial gallons" : "litres";

  const faq = [
    { q: `How long does delivery to ${name} take?`, a: `Allow ${w.min} to ${w.max} business days in total, tracked. The window is wider than the carrier's own quote on purpose, to cover supplier handling and customs.` },
    { q: `How much is shipping to ${name}?`, a: `A flat $${z.rate.toFixed(2)} per order, and free when the order is $${z.freeOver} or more. Prices are in US dollars.` },
    { q: `Will I pay import tax or duty in ${name}?`, a: `${c.taxNote} We do not collect it at checkout. ${z.note}` },
    { q: `Will the lights, pumps and heaters work on the electricity supply in ${name}?`, a: `${c.powerNote} Before you order any mains-powered item, check the plug and rating on its product page, or message us and we will confirm.` },
  ];

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Planted aquarium supplies", item: `${baseUrl}/planted-aquarium-supplies` },
      { "@type": "ListItem", position: 3, name: `Shipping to ${place(name)}`, item: `${baseUrl}/planted-aquarium-supplies/${c.slug}` } ] },
  ];

  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {jsonLd.map((j, i) => (<script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />))}
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <p className="text-sm text-[var(--aq-muted)]">
          <Link href="/planted-aquarium-supplies" className="underline underline-offset-2">Planted aquarium supplies</Link> / {place(name)}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">Planted aquarium supplies delivered to {name}</h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-[var(--aq-muted)]">
          {c.angle} Lights, CO2 gear, aquascaping tools, substrate and water testing ship to {name} in {w.min} to {w.max} business days for a flat ${z.rate.toFixed(2)}, free over ${z.freeOver}.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Delivery to {name}</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-[var(--aq-line)]">
            <table className="w-full min-w-[480px] text-left text-sm">
              <tbody>
                {[
                  ["Dispatch plus transit", `${DISPATCH_MIN_DAYS}-${DISPATCH_MAX_DAYS} + ${z.minDays}-${z.maxDays} business days`],
                  ["Total from order", `${w.min}-${w.max} business days`],
                  ["Shipping", `$${z.rate.toFixed(2)} flat per order`],
                  ["Free shipping", `Orders of $${z.freeOver} or more`],
                ].map(([k, v]) => (
                  <tr key={k} className="border-t first:border-t-0 border-[var(--aq-line)]"><th className="w-1/2 px-5 py-3 font-medium">{k}</th><td className="px-5 py-3 aq-spec">{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-[var(--aq-muted)]">Zone: {z.label}. {z.note}</p>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Import tax and duty in {name}</h2>
          <p className="mt-3 leading-7 text-[var(--aq-ink)]/80">{c.taxNote} Prices on this site are in US dollars and do not include {c.tax}; we do not collect it at checkout, and the carrier or customs authority bills the recipient.</p>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Power, plugs and voltage in {name}</h2>
          <p className="mt-3 leading-7 text-[var(--aq-ink)]/80">{c.slug === "asia" ? <>{c.powerNote}</> : <>{Name} runs on <b>{c.voltage}</b> at <b>{c.hz}</b> with <b>{c.plugs.join(" and ")}</b> sockets. {c.powerNote}</>}</p>
          <p className="mt-3 leading-7 text-[var(--aq-ink)]/80">Lights, pumps, filters, heaters and feeders are the powered items in a planted tank. Check the plug, voltage range and wattage on each product page, and <Link href="/contact" className="text-[#2f6a37] underline underline-offset-2">message us before you order</Link> if anything is unclear.</p>
          <div className="mt-5 overflow-x-auto rounded-2xl bg-white ring-1 ring-[var(--aq-line)]">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-[var(--aq-muted)]"><tr><th className="px-5 py-3 font-medium">Typical device (example wattage)</th>{ampVolts.map((v) => (<th key={v} className="px-5 py-3 font-medium">Current at {v}</th>))}</tr></thead>
              <tbody className="aq-spec">
                {[["100 W heater", 100], ["20 W LED light bar", 20], ["5 W air pump", 5]].map(([label, w]) => (
                  <tr key={label as string} className="border-t border-[var(--aq-line)]"><td className="px-5 py-2.5 font-sans">{label}</td>{ampVolts.map((v) => (<td key={v} className="px-5 py-2.5">{((w as number) / parseFloat(v)).toFixed(2)} A</td>))}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-[var(--aq-muted)]">Current = power divided by voltage. The same device draws more than twice as much at 100-120 V as at 230 V, which is why a 230 V-only item will not run properly here.</p>
          {c.slug === "asia" && (
            <div className="mt-5 overflow-x-auto rounded-2xl bg-white ring-1 ring-[var(--aq-line)]">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-[var(--aq-muted)]"><tr><th className="px-5 py-3 font-medium">Destination</th><th className="px-5 py-3 font-medium">Voltage</th><th className="px-5 py-3 font-medium">Frequency</th><th className="px-5 py-3 font-medium">Plug</th><th className="px-5 py-3 font-medium">Import tax</th></tr></thead>
                <tbody>{ASIA_ROWS.map((r) => (<tr key={r.country} className="border-t border-[var(--aq-line)]"><td className="px-5 py-2.5">{r.country}</td><td className="px-5 py-2.5 aq-spec">{r.voltage}</td><td className="px-5 py-2.5 aq-spec">{r.hz}</td><td className="px-5 py-2.5 aq-spec">{r.plug}</td><td className="px-5 py-2.5">{r.tax}</td></tr>))}</tbody>
              </table>
            </div>
          )}
          {c.slug === "europe" && (
            <div className="mt-5 overflow-x-auto rounded-2xl bg-white ring-1 ring-[var(--aq-line)]">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="text-[var(--aq-muted)]"><tr><th className="px-5 py-3 font-medium">Country</th><th className="px-5 py-3 font-medium">Main plug type</th></tr></thead>
                <tbody>{EUROPE_PLUGS.map((r) => (<tr key={r.country} className="border-t border-[var(--aq-line)]"><td className="px-5 py-2.5">{r.country}</td><td className="px-5 py-2.5 aq-spec">{r.plugs}</td></tr>))}</tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Planted tank sizes in {unitsLabel}</h2>
          <p className="mt-2 max-w-[62ch] text-[var(--aq-muted)]">We do not sell tanks, so buy one locally and match it to a setup page. Each page lists the light, CO2, substrate and filter that fit that size, with the maths done.</p>
          <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-[var(--aq-line)]">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[var(--aq-muted)]"><tr><th className="px-5 py-3 font-medium">Tank</th><th className="px-5 py-3 font-medium">Outer size</th><th className="px-5 py-3 font-medium">Glass volume</th><th className="px-5 py-3 font-medium">Substrate</th></tr></thead>
              <tbody className="aq-spec">
                {TANKS.map((t) => (
                  <tr key={t.slug} className="border-t border-[var(--aq-line)]">
                    <td className="px-5 py-3 font-sans"><Link href={`/tanks/${t.slug}`} className="text-[#2f6a37] underline underline-offset-2">{t.name.split(" (")[0]}</Link></td>
                    <td className="px-5 py-3">{t.cm[0]} x {t.cm[1]} x {t.cm[2]} cm</td>
                    <td className="px-5 py-3">{fmtVolume(t.grossL, c.units)}</td>
                    <td className="px-5 py-3">{t.substrate[1]!.litres} L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-[var(--aq-muted)]">Use the <Link href="/tools/aquarium-volume-calculator" className="text-[#2f6a37] underline underline-offset-2">volume</Link> and <Link href="/tools/substrate-calculator" className="text-[#2f6a37] underline underline-offset-2">substrate</Link> calculators for any other size.</p>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Questions from {name}</h2>
          <dl className="mt-4 divide-y divide-[var(--aq-line)]">
            {faq.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold">{f.q}</dt><dd className="mt-1.5 leading-7 text-[var(--aq-ink)]/80">{f.a}</dd></div>))}
          </dl>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--aq-muted)]">We also ship to</h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
            {others.map((o) => (<li key={o.slug}><Link href={`/planted-aquarium-supplies/${o.slug}`} className="text-[#2f6a37] underline underline-offset-2">{cap(o.name)}</Link></li>))}
          </ul>
          <p className="mt-6 text-sm text-[var(--aq-muted)]">Unused items can be returned within 30 days of delivery. We cannot ship CO2 cylinders (dangerous goods) and do not sell tanks, so buy those locally.</p>
          <p className="mt-3 text-sm"><Link href="/shipping-returns" className="text-[#2f6a37] underline underline-offset-2">Full shipping and returns policy</Link></p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
