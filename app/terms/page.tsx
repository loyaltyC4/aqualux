import { PageShell, Section } from "components/page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you shop with Aqualux.",
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
          All prices are in USD and include applicable product pricing shown at
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
          it before purchasing custom or clearance items, which may be final
          sale.
        </p>
      </Section>
      <Section heading="Product use">
        <p>
          Fingerboards and accessories are hobby products intended for finger
          skating on suitable surfaces. Small parts are not suitable for young
          children. Use common sense and skate responsibly.
        </p>
      </Section>
    </PageShell>
  );
}
