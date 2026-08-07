import { DeliveryTable } from "components/delivery-table";
import { PageShell, Section } from "components/page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Aqualux delivery windows by destination, tracked shipping rates, and our 30-day returns policy for planted aquarium gear.",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingReturnsPage() {
  return (
    <PageShell
      eyebrow="Policies"
      title="Shipping & returns."
      intro="Fast dispatch, tracked delivery, and a no-drama 30-day return window on unused items."
    >
      <Section heading="Where we ship & how long it takes">
        <DeliveryTable />
      </Section>
      <Section heading="Why combining an order is cheaper">
        <p>
          Freight is charged by weight, not by line item, so one order of four
          things costs far less to ship than four orders of one. On a single
          small item, shipping can be nearly half the order value; across four it
          falls to under a quarter. That is also why the free-shipping threshold
          exists rather than a blanket free-shipping claim we would have to fund
          out of margin.
        </p>
        <p>
          We cannot ship pressurised CO2 gas cylinders as they are classified as
          dangerous goods. All other items in our range, including CO2
          regulators, diffusers, drop checkers, and tubing, ship without
          restriction.
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
