import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "components/layout/footer";
import { ProductCard } from "components/product-card";
import { pageMeta } from "lib/seo";
import { baseUrl } from "lib/utils";
import { COLLECTIONS } from "lib/brand";
import { hubBySlug, HUBS } from "lib/seo-hubs";
import { hubProducts, liveHubs } from "lib/hub-products";

export const dynamicParams = false;

export function generateStaticParams() {
  return liveHubs().map((h) => ({ hub: h.slug }));
}

export async function generateMetadata(props: { params: Promise<{ hub: string }> }): Promise<Metadata> {
  const { hub } = await props.params;
  const h = hubBySlug(hub);
  if (!h) return notFound();
  const prods = hubProducts(h);
  const min = Math.min(...prods.map((p) => parseFloat(p.priceRange.minVariantPrice.amount)));
  return pageMeta({
    title: h.name,
    description: `${h.desc} From $${Math.round(min)}, tracked shipping, 30-day returns.`,
    path: `/${h.slug}`,
  });
}

const firstSentence = (s: string, max = 150) => {
  const t = s.replace(/\s+/g, " ").trim();
  const cut = t.split(/(?<=[.!?])\s/)[0] || t;
  return cut.length > max ? `${cut.slice(0, max - 1).replace(/[\s,;:–—-]+\S*$/, "")}…` : cut;
};

export default async function HubPage(props: { params: Promise<{ hub: string }> }) {
  const { hub } = await props.params;
  const h = hubBySlug(hub);
  if (!h) notFound();
  const prods = hubProducts(h);
  if (prods.length < 3) notFound();
  const col = COLLECTIONS.find((c) => c.handle === h.collection);
  const relatedHubs = h.related
    .map((s) => HUBS.find((x) => x.slug === s))
    .filter((x): x is NonNullable<typeof x> => !!x && hubProducts(x).length >= 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: h.name,
      url: `${baseUrl}/${h.slug}`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: prods.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${baseUrl}/product/${p.handle}`, name: p.title })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: h.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        ...(col ? [{ "@type": "ListItem", position: 2, name: col.title, item: `${baseUrl}/search/${col.handle}` }] : []),
        { "@type": "ListItem", position: col ? 3 : 2, name: h.name, item: `${baseUrl}/${h.slug}` },
      ],
    },
  ];

  const link = "text-[#2f6a37] underline underline-offset-2";
  const label = "text-sm font-semibold uppercase tracking-[0.15em] text-[var(--aq-muted)]";

  return (
    <div className="bg-[var(--aq-canvas)] text-[var(--aq-ink)]">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <p className="text-sm text-[var(--aq-muted)]">
          <Link href="/" className="underline underline-offset-2">Home</Link>
          {col && (
            <>
              {" / "}
              <Link href={`/search/${col.handle}`} className="underline underline-offset-2">{col.title}</Link>
            </>
          )}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">{h.name}</h1>
        <p className="mt-5 max-w-[66ch] text-lg leading-relaxed text-[var(--aq-muted)]">{h.intro}</p>

        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {prods.map((p, i) => (
            <li key={p.handle}>
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Compare {h.name.toLowerCase()}</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-[var(--aq-line)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-[var(--aq-muted)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">What it is</th>
                </tr>
              </thead>
              <tbody>
                {prods.map((p) => {
                  const specs = (p.specs ?? []).slice(0, 2).map((s) => `${s.label}: ${s.value}`).join(" · ");
                  const price = p.priceRange.minVariantPrice.amount;
                  const max = p.priceRange.maxVariantPrice.amount;
                  return (
                    <tr key={p.handle} className="border-t border-[var(--aq-line)] align-top">
                      <td className="px-5 py-3"><Link href={`/product/${p.handle}`} className={link}>{p.title}</Link></td>
                      <td className="px-5 py-3 aq-spec whitespace-nowrap">${parseFloat(price).toFixed(2)}{max !== price ? "+" : ""}</td>
                      <td className="px-5 py-3 text-[var(--aq-ink)]/80">{specs || firstSentence(p.description)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">How to choose</h2>
          <div className="mt-4 space-y-6">
            {h.choose.map((c) => (
              <div key={c.h}>
                <h3 className="font-semibold">{c.h}</h3>
                <p className="mt-1.5 leading-7 text-[var(--aq-ink)]/80">{c.p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Questions</h2>
          <dl className="mt-4 divide-y divide-[var(--aq-line)]">
            {h.faq.map((f) => (
              <div key={f.q} className="py-4">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1.5 leading-7 text-[var(--aq-ink)]/80">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14 grid gap-10 md:grid-cols-3">
          <nav aria-label="Guides">
            <h2 className={label}>Guides</h2>
            <ul className="mt-3 space-y-2 text-[15px]">
              {h.guides.map((g) => (<li key={g.href}><Link href={g.href} className={link}>{g.label}</Link></li>))}
            </ul>
          </nav>
          <nav aria-label="Tools">
            <h2 className={label}>Tools and setups</h2>
            <ul className="mt-3 space-y-2 text-[15px]">
              {(h.tools ?? [{ href: "/tools", label: "Aquarium calculators" }]).map((g) => (<li key={g.href}><Link href={g.href} className={link}>{g.label}</Link></li>))}
              <li><Link href="/planted-aquarium-supplies" className={link}>Shipping by country</Link></li>
            </ul>
          </nav>
          <nav aria-label="Related categories">
            <h2 className={label}>Related categories</h2>
            <ul className="mt-3 space-y-2 text-[15px]">
              {relatedHubs.map((r) => (<li key={r.slug}><Link href={`/${r.slug}`} className={link}>{r.name}</Link></li>))}
              {col && <li><Link href={`/search/${col.handle}`} className={link}>All {col.title.toLowerCase()}</Link></li>}
            </ul>
          </nav>
        </section>
      </div>
      <Footer />
    </div>
  );
}
