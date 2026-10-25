import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDES_META, getGuide } from "lib/guides";

export function generateStaticParams() {
  return GUIDES_META.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = GUIDES_META.find((x) => x.slug === slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: {
      title: g.title,
      description: g.description,
      type: "article",
      publishedTime: g.publishedAt,
      ...(g.image ? { images: [{ url: g.image, alt: g.title }] } : {}),
    },
    twitter: { card: "summary_large_image", title: g.title, description: g.description },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const base = "https://lushaquarium.com";
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: g.title,
      description: g.description,
      datePublished: g.publishedAt,
      dateModified: g.updatedAt ?? g.publishedAt,
      mainEntityOfPage: `${base}/guides/${g.slug}`,
      ...(g.image ? { image: [`${base}${g.image}`] } : {}),
      author: { "@type": "Organization", name: "Lush Aquarium", url: base },
      publisher: { "@type": "Organization", name: "Lush Aquarium", url: base },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${base}/guides` },
        { "@type": "ListItem", position: 3, name: g.title, item: `${base}/guides/${g.slug}` },
      ],
    },
  ];
  if (g.faq?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: g.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  const related = GUIDES_META.filter((x) => x.slug !== g.slug).slice(0, 3);
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <article className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <Link href="/guides" className="text-xs font-medium uppercase tracking-[0.15em] text-[#2f6a37]">Guides</Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{g.title}</h1>
        <p className="mt-2 text-xs text-[#0f1d18]/50">{g.readingMinutes} min read · {g.publishedAt}</p>
        <div
          className="mt-8 text-[15px] leading-7 text-[#0f1d18]/85 [&_a]:text-[#2f6a37] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 [&_strong]:text-[#0f1d18]"
          dangerouslySetInnerHTML={{ __html: g.html }}
        />
        {g.faq?.length ? (
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">Quick answers</h2>
            <dl className="mt-4 divide-y divide-[#0f1d18]/10">
              {g.faq.map((f) => (
                <div key={f.q} className="py-4">
                  <dt className="font-semibold">{f.q}</dt>
                  <dd className="mt-1.5 text-[15px] leading-7 text-[#0f1d18]/80">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
        {related.length ? (
          <nav className="mt-12" aria-label="More guides">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#0f1d18]/60">More guides</h2>
            <ul className="mt-3 space-y-2 text-[15px]">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/guides/${r.slug}`} className="text-[#2f6a37] underline underline-offset-2">{r.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <div className="mt-12 border-t border-[#0f1d18]/10 pt-6 text-sm">
          <Link href="/search" className="text-[#2f6a37] underline underline-offset-2">Shop the gear from this guide →</Link>
        </div>
      </article>
    </div>
  );
}
