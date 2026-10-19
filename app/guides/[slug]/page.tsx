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
        <Link href="/guides" className="text-xs font-medium uppercase tracking-[0.15em] text-[#0e7490]">Guides</Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{g.title}</h1>
        <p className="mt-2 text-xs text-[#132a35]/50">{g.readingMinutes} min read · {g.publishedAt}</p>
        <div
          className="mt-8 text-[15px] leading-7 text-[#132a35]/85 [&_a]:text-[#0e7490] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 [&_strong]:text-[#132a35]"
          dangerouslySetInnerHTML={{ __html: g.html }}
        />
        <div className="mt-12 border-t border-[#132a35]/10 pt-6 text-sm">
          <Link href="/search" className="text-[#0e7490] underline underline-offset-2">Shop the gear from this guide →</Link>
        </div>
      </article>
    </div>
  );
}
