import Footer from "components/layout/footer";
import { Gallery } from "components/product/gallery";
import { ProductDescription } from "components/product/product-description";
import Prose from "components/prose";
import { ProductCard } from "components/product-card";
import { ReviewsSection } from "components/product/reviews-section";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProductReviews } from "lib/reviews";
import {
  getProduct,
  getProductCollection,
  getRelatedProducts,
} from "lib/shopify";
import type { Image } from "lib/shopify/types";
import { baseUrl } from "lib/utils";
import { COLLECTIONS, SITE_NAME } from "lib/brand";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { staticGetProducts } from "lib/shopify/static-data";

/**
 * Without these two, PPR serves a prerendered shell with HTTP 200 for ANY
 * handle and only streams notFound() in afterwards. That is a soft 404:
 * /product/total-nonsense returned 200 and was indexable, so a crawler could
 * mint unlimited junk URLs against this route. Enumerating the real handles
 * and refusing everything else makes unknown products a hard 404 at routing
 * time, before a shell is ever produced.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return staticGetProducts({}).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);
  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    alternates: { canonical: `/product/${product.handle}` },
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: { index: indexable, follow: indexable },
    },
    openGraph: url ? { images: [{ url, width, height, alt }] } : null,
  };
}

/**
 * Contextual guide links per collection. Intentionally empty until the
 * corresponding articles actually ship. Pointing at unwritten /guides/*
 * URLs would emit internal links to 404s, which wastes crawl budget and
 * looks broken to a real customer.
 */
const GUIDE_FOR_COLLECTION: Record<string, { label: string; href: string }> =
  {};

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);
  if (!product) return notFound();

  // Internal tags stay internal. src1688:<offerId> records which supplier a
  // SKU is sourced from, which is useful inside the catalog and must never
  // reach the storefront: publishing it hands competitors the exact supplier.
  const publicTags = product.tags.filter((t) => !t.startsWith("src1688:"));

  const collectionHandle = await getProductCollection(product.handle);
  const collectionMeta = COLLECTIONS.find((c) => c.handle === collectionHandle);
  const related = await getRelatedProducts(product.handle);
  const guideLink = collectionHandle
    ? GUIDE_FOR_COLLECTION[collectionHandle]
    : undefined;
  const { reviews, average, count } = await getProductReviews(product.handle);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    sku: product.variants[0]?.sku || product.handle,
    brand: { "@type": "Brand", name: SITE_NAME },
    // Only present when real reviews exist / never fabricated.
    ...(count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: average.toFixed(1),
            reviewCount: count,
          },
        }
      : {}),
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      offerCount: product.variants.length || 1,
      url: `${baseUrl}/product/${product.handle}`,
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      ...(collectionMeta
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: collectionMeta.title,
              item: `${baseUrl}/search/${collectionMeta.handle}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: collectionMeta ? 3 : 2,
        name: product.title,
        item: `${baseUrl}/product/${product.handle}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-[#f2a93b]">
            Home
          </Link>
          <span>/</span>
          {collectionMeta ? (
            <>
              <Link
                href={`/search/${collectionMeta.handle}`}
                className="hover:text-[#f2a93b]"
              >
                {collectionMeta.title}
              </Link>
              <span>/</span>
            </>
          ) : null}
          <span className="text-neutral-300">{product.title}</span>
        </nav>

        <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-[#0d1618] p-6 md:p-10 lg:flex-row lg:gap-12">
          <div className="h-full w-full basis-full lg:basis-3/5">
            <div className="rounded-2xl border border-white/10 bg-[#0a1214] p-4">
              <Suspense
                fallback={
                  <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
                }
              >
                <Gallery
                  images={product.images.slice(0, 6).map((image: Image) => ({
                    src: image.url,
                    altText: image.altText,
                  }))}
                />
              </Suspense>
            </div>
          </div>
          <div className="basis-full lg:basis-2/5">
            {/* H1 must be in the initial static shell so crawlers see it
               without waiting for the Suspense boundary to stream. */}
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              {product.title}
            </h1>
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
            {guideLink ? (
              <Link
                href={guideLink.href}
                className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-neutral-300 transition hover:border-[#f2a93b]/40 hover:text-[#f2a93b]"
              >
                {guideLink.label}
                <span aria-hidden>→</span>
              </Link>
            ) : null}
          </div>
        </div>

        {/* DETAILS + SPECS */}
        {(product.descriptionHtml || publicTags.length > 0) && (
          <div className="mt-10 grid gap-10 rounded-3xl border border-white/10 bg-[#0d1618] p-6 md:p-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="mb-4 text-xl font-semibold">Details</h2>
              {product.descriptionHtml ? (
                <Prose
                  className="mx-0 max-w-none text-sm leading-relaxed text-neutral-300 dark:text-neutral-300"
                  html={product.descriptionHtml}
                />
              ) : (
                <p className="text-sm text-neutral-400">
                  {product.description}
                </p>
              )}
            </div>
            {publicTags.length > 0 && (
              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                  Specs &amp; tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {publicTags.slice(0, 12).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-neutral-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <dl className="mt-6 space-y-2 text-sm">
                  {collectionMeta ? (
                    <div className="flex justify-between border-b border-white/10 py-2">
                      <dt className="text-neutral-500">Category</dt>
                      <dd className="text-neutral-200">
                        {collectionMeta.title}
                      </dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between border-b border-white/10 py-2">
                    <dt className="text-neutral-500">Dispatch</dt>
                    <dd className="text-neutral-200">1-2 business days</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/10 py-2">
                    <dt className="text-neutral-500">Returns</dt>
                    <dd className="text-neutral-200">30 days</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        )}

        <ReviewsSection
          productHandle={product.handle}
          initialReviews={reviews}
          initialAverage={average}
          initialCount={count}
        />

        {/* RELATED */}
        {related.length > 0 && (
          <div className="py-14">
            <h2 className="mb-6 text-2xl font-semibold">
              {collectionMeta
                ? `More ${collectionMeta.title.toLowerCase()}`
                : "You might also like"}
            </h2>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none]">
              {related.map((p) => (
                <div
                  key={p.id}
                  className="w-[64%] shrink-0 snap-start sm:w-[38%] lg:w-[22%]"
                >
                  <ProductCard
                    product={p}
                    sizes="(min-width:1024px) 22vw, 60vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
