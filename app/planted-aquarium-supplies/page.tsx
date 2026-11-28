import Link from "next/link";
import Footer from "components/layout/footer";
import { pageMeta } from "lib/seo";
import { ZONES, deliveryWindow } from "lib/shipping";
import { COUNTRIES } from "lib/countries";

export const metadata = pageMeta({
  title: "Planted Aquarium Supplies Shipped Worldwide",
  description: "Planted aquarium lights, CO2, tools and substrate shipped to 40+ countries. Delivery times, flat rates and free-shipping thresholds by region, plus plug and voltage guides.",
  path: "/planted-aquarium-supplies",
});

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Page() {
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">Planted aquarium supplies, shipped worldwide</h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-[var(--aq-muted)]">One store, five shipping zones. Pick your country for the exact delivery window, import tax notes, plug and voltage guide and tank sizes in your units.</p>
        <div className="mt-10 overflow-x-auto rounded-2xl bg-white ring-1 ring-[var(--aq-line)]">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-[var(--aq-muted)]"><tr><th className="px-5 py-3 font-medium">Zone</th><th className="px-5 py-3 font-medium">Delivery</th><th className="px-5 py-3 font-medium">Flat rate</th><th className="px-5 py-3 font-medium">Free over</th></tr></thead>
            <tbody className="aq-spec">
              {ZONES.map((z) => { const w = deliveryWindow(z); return (
                <tr key={z.id} className="border-t border-[var(--aq-line)]"><td className="px-5 py-3 font-sans">{z.label}</td><td className="px-5 py-3">{w.min}-{w.max} business days</td><td className="px-5 py-3">${z.rate.toFixed(2)}</td><td className="px-5 py-3">${z.freeOver}</td></tr>
              ); })}
            </tbody>
          </table>
        </div>
        <h2 className="mt-14 text-2xl font-semibold tracking-tight">Choose your country</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {COUNTRIES.map((c) => (<li key={c.slug}><Link href={`/planted-aquarium-supplies/${c.slug}`} className="block rounded-xl border border-[var(--aq-line)] bg-white px-4 py-3 text-sm font-medium hover:border-[#2f6a37]">{cap(c.name)}</Link></li>))}
        </ul>
        <p className="mt-8 text-sm text-[var(--aq-muted)]">Elsewhere? See the <Link href="/shipping-returns" className="text-[#2f6a37] underline underline-offset-2">shipping and returns policy</Link> for the rest-of-world zone. Prices are in US dollars.</p>
      </div>
      <Footer />
    </div>
  );
}
