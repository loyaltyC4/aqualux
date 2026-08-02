import { PageShell, Section } from "components/page-shell";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Aqualux",
  description:
    "Aqualux is a curated shop for planted freshwater aquariums, stocking lighting, CO2 systems, aquascaping tools, substrate, hardscape, and water testing gear.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Gear for planted aquariums."
      intro="Aqualux exists for one reason: a well-curated range of planted-tank gear chosen on real specifications, not marketing copy. Every product is here because it works in a living aquascape."
    >
      <Section heading="Curated, not manufactured">
        <p>
          We don&apos;t manufacture. We curate. Every product here is chosen,
          ordered, and checked by us before it goes in the catalogue. We tell
          you plainly what something is and what it isn&apos;t. No invented
          engineering claims, no inflated spec sheets.
        </p>
        <p>
          Selection is based on measurable criteria: PAR output and spectrum for
          lighting, build quality and consistency for CO2 equipment, material
          and balance for aquascaping tools.
        </p>
      </Section>
      <Section heading="For hobbyists and aquascapers">
        <p>
          Some planted-tank keepers want a straightforward setup they can rely
          on from day one. Others want to dial in every variable, from substrate
          composition to CO2 drop-checker colour, and build an aquascape that is
          unmistakably theirs. We stock for both.
        </p>
        <p>
          The five categories cover what a planted tank actually needs: full-spectrum
          LED lighting, CO2 systems, aquascaping tools, substrate and hardscape,
          and water testing. One place, no padding.
        </p>
      </Section>
      <Section heading="What every order includes">
        <p>
          Fast dispatch in 1-2 business days, tracked shipping, and a 30-day
          return window on unused items in original packaging if something is not
          right. Note that we cannot ship pressurised CO2 gas cylinders as they
          are classified as dangerous goods. We carry everything else in the CO2
          chain: regulators, diffusers, drop checkers, and tubing.
        </p>
        <p></p>
      </Section>
    </PageShell>
  );
}
