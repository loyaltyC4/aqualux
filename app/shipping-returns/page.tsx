import { PageShell, Section } from "components/page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Aqualux shipping times, tracked delivery, and our 30-day returns policy for planted aquarium gear.",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingReturnsPage() {
  return (
    <PageShell
      eyebrow="Policies"
      title="Shipping & returns."
      intro="Fast dispatch, tracked delivery, and a no-drama 30-day return window on unused items."
    >
      <Section heading="Dispatch & delivery">
        <p>
          Orders are packed and dispatched within 1-2 business days. Standard
          shipping typically arrives in 3-8 business days; express in 1-3. Exact
          transit time depends on your destination and is shown at checkout.
        </p>
        <p>
          Shipping is free on orders over $79. We cannot ship pressurised CO2
          gas cylinders as they are classified as dangerous goods. All other
          items in our range, including CO2 regulators, diffusers, drop
          checkers, and tubing, ship without restriction.
        </p>
      </Section>
      <Section heading="Tracking">
        <p>
          You&apos;ll receive an order confirmation by email at checkout, and a
          tracking link once your order ships. Every order is tracked from
          dispatch to delivery.
        </p>
      </Section>
      <Section heading="30-day returns">
        <p>
          Return unused items in their original packaging within 30 days of
          delivery for a refund or exchange. Start a return by emailing us with
          your order number and we&apos;ll send instructions.
        </p>
        <p>
          Clearance items are final sale unless they arrive faulty. If anything
          arrives damaged or defective, contact us within 14 days and we&apos;ll
          make it right.
        </p>
      </Section>
    </PageShell>
  );
}
