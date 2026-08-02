import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { FilterBar } from "components/layout/search/filter-bar";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";
import {
  applyFilters,
  availableFacets,
  parseFiltersFromSearchParams,
} from "lib/filters";

export async function generateMetadata(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams?.q === "string" ? searchParams.q : undefined;
  return {
    title: q ? `"${q}" search results` : "Search all planted tank gear",
    description:
      "Search Aqualux for planted tank LED lighting, CO2 systems, aquascaping tools, substrate, hardscape and water testing.",
    // Every sort/filter/query combination collapses to one canonical URL -
    // otherwise each parameter combo is a thin near-duplicate page competing
    // with itself in the index.
    alternates: { canonical: "/search" },
  };
}

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } =
    (searchParams as {
      [key: string]: string;
    }) || {};
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const unfiltered = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
  });
  const facets = availableFacets(unfiltered);
  const filters = parseFiltersFromSearchParams(searchParams || {});
  const products = applyFilters(unfiltered, filters);
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold md:text-3xl">
          {searchValue ? "Search" : "All products"}
        </h1>
        {searchValue ? (
          <p className="mt-2 text-neutral-400">
            {products.length === 0
              ? "No products match "
              : `Showing ${products.length} ${resultsText} for `}
            <span className="font-semibold text-[#eceae4]">
              &quot;{searchValue}&quot;
            </span>
          </p>
        ) : (
          <p className="mt-2 text-neutral-400">
            Every light, CO2 part, tool, substrate and test kit we stock.
          </p>
        )}
      </div>
      <FilterBar facets={facets} />

      {products.length > 0 ? (
        <>
          <h2 className="sr-only">All products</h2>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        </>
      ) : (
        <p className="py-3 text-lg text-neutral-400">
          No products match these filters. Try clearing one.
        </p>
      )}
    </>
  );
}
