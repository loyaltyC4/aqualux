import { PageShell, Section } from "components/page-shell";
import { FREE_SHIPPING_THRESHOLD } from "lib/brand";
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
      <Section heading="Where we ship">
        <p>
          We ship within Australia only. Prices are in Australian dollars and
          include GST.
        </p>
      </Section>
      <Section heading="Dispatch & delivery">
        <p>
          Orders are packed and dispatched within 1-2 business days. Most of our
          range ships direct from our supplier, so allow{" "}
          <strong>8-15 business days</strong> for delivery within Australia.
          Every order is tracked from dispatch. We would rather quote a real
          transit time than promise a fast one and miss it.
        </p>
        <p>
          Shipping is free on orders over ${FREE_SHIPPING_THRESHOLD}. Below that
          a flat rate is calculated at checkout. Because freight is charged by
          weight, combining items into one order is materially cheaper than
          ordering them separately.
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
