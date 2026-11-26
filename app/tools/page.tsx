import Link from "next/link";
import Footer from "components/layout/footer";
import { pageMeta } from "lib/seo";

export const metadata = pageMeta({
  title: "Free Aquarium Calculators",
  description: "Free aquarium calculators: substrate (soil, sand, gravel), tank volume in gallons and litres, CO2 ppm from KH and pH, and heater size in watts.",
  path: "/tools",
});

const TOOLS = [{"href": "/tools/substrate-calculator", "name": "Substrate calculator", "blurb": "Litres, kg and bags of aqua soil, sand or gravel for your tank and slope."}, {"href": "/tools/aquarium-volume-calculator", "name": "Aquarium volume calculator", "blurb": "Gallons and litres from tank dimensions, including the real water volume."}, {"href": "/tools/co2-ppm-calculator", "name": "CO2 calculator", "blurb": "Dissolved CO2 in ppm from KH and pH, and the pH to aim for."}, {"href": "/tools/water-change-calculator","name":"Water change calculator","blurb":"The percentage of water to change to bring nitrate to your target."},{"href":"/tools/aquarium-heater-size-calculator", "name": "Heater size calculator", "blurb": "Heater watts for your tank volume and room temperature."}];

export default function ToolsPage() {
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Aquarium calculators</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-[var(--aq-muted)]">Quick, free tools for setting up and running a planted tank. Each one shows the formula it uses.</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="block rounded-2xl border border-[var(--aq-line)] bg-white p-6 hover:border-[#2f6a37]">
                <p className="text-lg font-semibold">{t.name}</p>
                <p className="mt-1.5 text-sm leading-6 text-[var(--aq-muted)]">{t.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
