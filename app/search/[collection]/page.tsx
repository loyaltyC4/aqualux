import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { FilterBar } from "components/layout/search/filter-bar";
import { defaultSort, sorting } from "lib/constants";
import { COLLECTIONS, SITE_NAME } from "lib/brand";
import { COLLECTION_COPY } from "lib/collection-copy";
import { baseUrl } from "lib/utils";
import {
  applyFilters,
  availableFacets,
  parseFiltersFromSearchParams,
} from "lib/filters";

export const dynamicParams = false;

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.handle }));
}

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);
  if (!collection) return notFound();

  return {
    // Collection titles already say "Planted Tank ..." in several cases, so
    // only add the qualifier when it is not already implied.
    title: /planted|aquarium|aquascap/i.test(collection.title)
      ? collection.title
      : `${collection.title} for Planted Aquariums`,
    description:
      collection.seo?.description ||
      collection.description ||
      `Shop ${collection.title} at ${SITE_NAME}.`,
    alternates: { canonical: `/search/${params.collection}` },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const collection = await getCollection(params.collection);
  const { sort } = (searchParams as { [key: string]: string }) || {};
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const unfiltered = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });
  const facets = availableFacets(unfiltered);
  const filters = parseFiltersFromSearchParams(searchParams || {});
  const products = applyFilters(unfiltered, filters);
  const copy = COLLECTION_COPY[params.collection];

  const banner =
    [...unfiltered]
      .filter((p) => p.featuredImage?.url)
      .sort((x, y) => Number((y.specs?.length ?? 0) > 0) - Number((x.specs?.length ?? 0) > 0))[0] ?? null;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection?.title,
    description: collection?.description,
    url: `${baseUrl}/search/${params.collection}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${baseUrl}/product/${p.handle}`,
        name: p.title,
      })),
    },
  };

  return (
    <section>
      {itemListJsonLd.mainEntity.itemListElement.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

      {collection && (
        <div className="relative mb-8 grid items-center overflow-hidden rounded-[1.75rem] bg-[var(--aq-raised)] md:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 md:p-10">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              {collection.title}
            </h1>
            {collection.description ? (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--aq-muted)] md:text-base">
                {collection.description}
              </p>
            ) : null}
            <p className="aq-spec mt-4 text-xs text-[var(--aq-muted)]">
              {products.length} products
            </p>
          </div>
          {/* A real product from this category, not a generated banner. */}
          {banner?.featuredImage?.url ? (
            <div className="relative hidden h-full min-h-[200px] md:block">
              <Image
                src={banner.featuredImage.url}
                alt={banner.featuredImage.altText || banner.title}
                fill
                sizes="30vw"
                priority
                className="object-contain p-8 mix-blend-multiply"
              />
            </div>
          ) : null}
        </div>
      )}

      <FilterBar facets={facets} />

      {products.length === 0 ? (
        <p className="py-3 text-lg text-neutral-600">
          {unfiltered.length === 0
            ? "No products found in this collection."
            : "No products match these filters. Try clearing one."}
        </p>
      ) : (
        <>
          <h2 className="sr-only">Products in this collection</h2>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        </>
      )}

      {copy ? (
        <div className="mx-auto mt-16 max-w-3xl px-2 md:mt-24">
          <p className="text-base leading-relaxed text-neutral-700">
            {copy.intro}
          </p>
          <div className="mt-10 space-y-8">
            {copy.sections.map((sec) => (
              <div key={sec.heading}>
                <h2 className="text-lg font-semibold text-[#0f1d18]">
                  {sec.heading}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
