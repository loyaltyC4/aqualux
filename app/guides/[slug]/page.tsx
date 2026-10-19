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
    title: `${g.title} | Lush Aquarium`,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { title: g.title, description: g.description, type: "article" },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    datePublished: g.publishedAt,
    author: { "@type": "Organization", name: "Lush Aquarium" },
  };
  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <Link href="/guides" className="text-xs font-medium uppercase tracking-[0.15em] text-[#2f6a37]">Guides</Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{g.title}</h1>
        <p className="mt-2 text-xs text-[#0f1d18]/50">{g.readingMinutes} min read · {g.publishedAt}</p>
        <div
          className="mt-8 text-[15px] leading-7 text-[#0f1d18]/85 [&_a]:text-[#2f6a37] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 [&_strong]:text-[#0f1d18]"
          dangerouslySetInnerHTML={{ __html: g.html }}
        />
        <div className="mt-12 border-t border-[#0f1d18]/10 pt-6 text-sm">
          <Link href="/search" className="text-[#2f6a37] underline underline-offset-2">Shop the gear from this guide →</Link>
        </div>
      </article>
    </div>
  );
}
