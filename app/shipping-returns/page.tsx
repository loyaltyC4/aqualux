import { PageShell, Section } from "components/page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Aqualux shipping times, worldwide delivery, and our 30-day returns policy.",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingReturnsPage() {
  return (
    <PageShell
      eyebrow="Policies"
      title="Shipping & returns."
      intro="Fast dispatch, worldwide delivery, and a no-drama 30-day return window."
    >
      <Section heading="Dispatch & delivery">
        <p>
          Orders are packed and dispatched within 1-2 business days. Standard
          shipping typically arrives in 3-8 business days; express in 1-3. Exact
          transit time depends on your destination and is shown at checkout.
        </p>
        <p>
          We ship worldwide. Any import duties or taxes for international orders
          are the responsibility of the recipient and are not collected at
          checkout.
        </p>
      </Section>
      <Section heading="Tracking">
        <p>
          You&apos;ll receive an order confirmation by email at checkout, and a
          tracking link once your order ships. A free sticker sheet is included
          in every box.
        </p>
      </Section>
      <Section heading="30-day returns">
        <p>
          Not feeling your setup? Return unused items in their original
          condition within 30 days of delivery for a refund or exchange. Start a
          return by emailing us with your order number and we&apos;ll send
          instructions.
        </p>
        <p>
          Custom-pressed decks and clearance items are final sale unless they
          arrive faulty. If anything arrives damaged or defective, contact us
          within 14 days and we&apos;ll make it right.
        </p>
      </Section>
    </PageShell>
  );
}
