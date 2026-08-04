import { PageShell, Section } from "components/page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions that apply when you order from Aqualux, covering pricing, orders, delivery, dangerous goods restrictions and returns.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of service."
      intro="By ordering from Aqualux you agree to the following."
    >
      <Section heading="Orders & pricing">
        <p>
          All prices are in AUD and include applicable product pricing shown at
          checkout. We reserve the right to correct pricing errors and to cancel
          and refund any order affected by an obvious mistake.
        </p>
      </Section>
      <Section heading="Payment">
        <p>
          Payments are processed securely by Stripe. Placing an order authorizes
          us to charge your chosen payment method for the order total, including
          shipping.
        </p>
      </Section>
      <Section heading="Returns">
        <p>
          Returns are governed by our Shipping &amp; Returns policy. Please read
          it before purchasing clearance items, which may be final sale.
        </p>
      </Section>
      <Section heading="Product use">
        <p>
          Aqualux products are hobby and aquascaping items intended for use in
          freshwater planted aquariums. Follow manufacturer guidance for
          electrical equipment and CO2 systems. We do not supply pressurised CO2
          gas cylinders. Small parts and liquid reagents should be kept away from
          young children.
        </p>
      </Section>
    </PageShell>
  );
}
