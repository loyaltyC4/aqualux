import { PageShell, Section } from "components/page-shell";
import { SUPPORT_EMAIL } from "lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Aqualux collects, uses, and protects your data.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy policy."
      intro="We keep this simple: we only collect what we need to process your order and improve the store."
    >
      <Section heading="What we collect">
        <p>
          When you place an order we collect your name, contact details,
          shipping address, and order contents. Payment card details are handled
          entirely by our payment processor, Stripe / we never see or store your
          full card number.
        </p>
      </Section>
      <Section heading="How we use it">
        <p>
          To process and ship your order, provide support, prevent fraud, and -
          only if you opt in / send occasional product news. We do not sell your
          personal data.
        </p>
      </Section>
      <Section heading="Cookies & analytics">
        <p>
          We use essential cookies to run the cart and checkout, and privacy-
          respecting analytics to understand what&apos;s working. You can clear
          cookies in your browser at any time.
        </p>
      </Section>
      <Section heading="Your rights & contact">
        <p>
          You can request access to, correction of, or deletion of your personal
          data at any time by emailing{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-[#f2a93b] hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </PageShell>
  );
}
