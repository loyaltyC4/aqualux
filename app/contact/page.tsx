import { PageShell, Section } from "components/page-shell";
import { SUPPORT_EMAIL, SOCIALS } from "lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Aqualux / product questions, order help, and wholesale enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Say hello"
      title="Get in touch."
      intro="Questions about a setup, an order, or a bulk build? We're happy to help / most emails get a reply within one business day."
    >
      <Section heading="Email">
        <p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-[#f2a93b] hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </Section>
      <Section heading="Order help">
        <p>
          Include your order number and the email you used at checkout, and
          we&apos;ll sort it fast / shipping updates, returns, or swaps.
        </p>
      </Section>
      <Section heading="Follow along">
        <p className="flex flex-wrap gap-4">
          <a
            href={SOCIALS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f2a93b] hover:underline"
          >
            Instagram
          </a>
          <a
            href={SOCIALS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f2a93b] hover:underline"
          >
            YouTube
          </a>
          <a
            href={SOCIALS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f2a93b] hover:underline"
          >
            TikTok
          </a>
        </p>
      </Section>
      <Section heading="Wholesale and trade">
        <p>
          Local fish shops, aquascaping studios, plant retailers and hobbyist
          clubs can order at trade pricing on the lighting, tools and hardscape
          range. Email the address above with your business name, trading
          location and rough monthly volume, and we&apos;ll send the trade
          price list. Minimum first order is $500 net.
        </p>
      </Section>
      <Section heading="Product advice">
        <p>
          Sizing a light bar for a specific tank, working out which CO2
          regulator matches your cylinder fitting, choosing between aqua soil
          and inert substrate, or picking test kits for a shrimp build — send
          the tank dimensions, what you plan to keep and the parameters you
          have from tap water, and we&apos;ll come back with a shortlist drawn
          from what we stock rather than a generic upsell.
        </p>
      </Section>
      <Section heading="Response times">
        <p>
          Emails answered within one business day, Monday to Friday, Sydney
          time. Order and shipping enquiries get priority. For anything
          time-sensitive on an existing order, include the order number in the
          subject line so it routes straight to fulfilment.
        </p>
      </Section>
    </PageShell>
  );
}
