import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { FilterBar } from "components/layout/search/filter-bar";
import { defaultSort, sorting } from "lib/constants";
import { COLLECTION_IMAGE, COLLECTIONS, SITE_NAME } from "lib/brand";
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

  const banner = COLLECTION_IMAGE[params.collection];

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
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10">
          {banner ? (
            <>
              <div className="relative h-40 w-full md:h-52">
                <Image
                  src={banner}
                  alt={collection.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <h1 className="text-2xl font-semibold text-white md:text-4xl">
                  {collection.title}
                </h1>
                {collection.description ? (
                  <p className="mt-1 max-w-xl text-sm text-neutral-300">
                    {collection.description}
                  </p>
                ) : null}
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#f2a93b]">
                  {products.length} products
                </p>
              </div>
            </>
          ) : (
            <div className="p-6 md:p-8">
              <h1 className="text-2xl font-semibold md:text-4xl">
                {collection.title}
              </h1>
              {collection.description ? (
                <p className="mt-1 max-w-xl text-sm text-neutral-400">
                  {collection.description}
                </p>
              ) : null}
            </div>
          )}
        </div>
      )}

      <FilterBar facets={facets} />

      {products.length === 0 ? (
        <p className="py-3 text-lg text-neutral-400">
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
          <p className="text-base leading-relaxed text-neutral-300">
            {copy.intro}
          </p>
          <div className="mt-10 space-y-8">
            {copy.sections.map((sec) => (
              <div key={sec.heading}>
                <h2 className="text-lg font-semibold text-[#eceae4]">
                  {sec.heading}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">
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
