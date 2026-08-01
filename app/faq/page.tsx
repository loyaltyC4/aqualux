import { PageShell } from "components/page-shell";
import { FaqList, type Faq } from "components/faq-list";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planted Aquarium FAQ",
  description:
    "Answers on planted aquarium lighting, CO2, substrate choice, PAR levels, shipping and returns.",
  alternates: { canonical: "/faq" },
};

const FAQS: Faq[] = [
  {
    q: "How much light does a planted tank need?",
    a: "It depends on the plants. Low-light plants like Anubias, Java fern and Cryptocoryne do well at roughly 20-30 PAR at the substrate. Carpeting plants and demanding stems generally want 50+ PAR, which usually also means CO2 injection. Running high light without CO2 and fertiliser is the most common cause of algae.",
  },
  {
    q: "Do I actually need CO2?",
    a: "No. Plenty of beautiful low-tech tanks run without it. CO2 becomes worthwhile when you want fast growth, dense carpets, or red-pigmented stem plants. If you are running high light, CO2 stops being optional, because the plants cannot use the light without the carbon to match it.",
  },
  {
    q: "What size light do I need for my tank?",
    a: "Match the bar to the tank length, not the volume. Our Aurora bars have extendable brackets, so the 20in unit covers 20-24in tanks and the 30in covers 30-36in. If your tank falls between sizes, size up rather than down.",
  },
  {
    q: "Can you ship a CO2 cylinder?",
    a: "No. Pressurised gas cylinders are dangerous goods and cannot go by standard carriers. We sell everything except the gas: regulator, diffuser, drop checker, tubing and valves. Cylinders are cheap to source or refill locally at a welding supplier, homebrew shop or paintball store.",
  },
  {
    q: "What is a drop checker actually telling me?",
    a: "It measures dissolved CO2 indirectly. The 4dKH reference solution plus indicator turns blue at low CO2, green at roughly 30 ppm, and yellow when CO2 is too high. It lags real conditions by an hour or two, so read it as a trend rather than a live number.",
  },
  {
    q: "Which substrate should I choose?",
    a: "Use an active aqua soil if you are growing rooted stem plants or keeping shrimp, since it holds nutrients and buffers pH downward. Use inert sand or gravel if you mainly keep epiphytes like Anubias and moss attached to hardscape, or if you want your tap water parameters unchanged.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders are packed within 1-2 business days. Delivery is typically 3-8 business days domestically and longer internationally, with tracking on every order. Shipping is free over $79.",
  },
  {
    q: "What is your returns policy?",
    a: "Unused items in original packaging can be returned within 30 days for a refund or exchange. If anything arrives damaged or faulty, contact us within 14 days and we will replace it.",
  },
];

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="Support"
      title="Questions before you build."
      intro="Lighting, CO2, substrate and the things that come up on every planted tank."
    >
      <FaqList items={FAQS} />
      <p className="mt-8 text-sm text-[var(--aq-muted)]">
        Still stuck?{" "}
        <Link href="/contact" className="text-[#f2a93b] hover:underline">
          Contact us
        </Link>
        .
      </p>
    </PageShell>
  );
}
