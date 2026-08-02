export type Faq = { q: string; a: string };

export function FaqList({
  items,
  withSchema = true,
}: {
  items: Faq[];
  withSchema?: boolean;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div>
      {withSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <h2 className="sr-only">Frequently asked questions</h2>
      <div className="divide-y divide-[var(--aq-line)] border-y border-[var(--aq-line)]">
        {items.map((f, i) => (
          <details key={i} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-[#eceae4]">
              {f.q}
              <span className="text-xl leading-none text-[var(--aq-muted)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--aq-muted)]">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
