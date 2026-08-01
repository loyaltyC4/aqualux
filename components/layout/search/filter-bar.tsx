"use client";

import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import {
  GearType,
  PRICE_LABELS,
  PriceBucket,
  SIZE_LABELS,
  SizeBucket,
} from "lib/filters";

type Facets = {
  sizes: SizeBucket[];
  types: GearType[];
  prices: PriceBucket[];
};

function toggle<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

const SIZE_ORDER: SizeBucket[] = ["nano", "20to30", "36plus"];
const PRICE_ORDER: PriceBucket[] = ["under30", "30to50", "50to100", "over100"];

export function FilterBar({ facets }: { facets: Facets }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSizes = (searchParams.get("size")?.split(",").filter(Boolean) ??
    []) as SizeBucket[];
  const activeTypes = (searchParams.get("type")?.split(",").filter(Boolean) ??
    []) as GearType[];
  const activePrices = (searchParams.get("price")?.split(",").filter(Boolean) ??
    []) as PriceBucket[];

  const hasActive =
    activeSizes.length > 0 ||
    activeTypes.length > 0 ||
    activePrices.length > 0;

  function setParam(key: string, values: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length) params.set(key, values.join(","));
    else params.delete(key);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("size");
    params.delete("type");
    params.delete("price");
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const showSizes = facets.sizes.length > 1;
  const showTypes = facets.types.length > 1;
  const showPrices = facets.prices.length > 1;

  if (!showSizes && !showTypes && !showPrices) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-white/10 pb-5">
      {showSizes && (
        <FilterGroup label="Tank size">
          {SIZE_ORDER.filter((s) => facets.sizes.includes(s)).map((s) => (
            <Chip
              key={s}
              active={activeSizes.includes(s)}
              onClick={() => setParam("size", toggle(activeSizes, s))}
            >
              {SIZE_LABELS[s]}
            </Chip>
          ))}
        </FilterGroup>
      )}
      {showTypes && (
        <FilterGroup label="Type">
          {facets.types.map((t) => (
            <Chip
              key={t}
              active={activeTypes.includes(t)}
              onClick={() => setParam("type", toggle(activeTypes, t))}
            >
              {t}
            </Chip>
          ))}
        </FilterGroup>
      )}
      {showPrices && (
        <FilterGroup label="Price">
          {PRICE_ORDER.filter((p) => facets.prices.includes(p)).map((p) => (
            <Chip
              key={p}
              active={activePrices.includes(p)}
              onClick={() => setParam("price", toggle(activePrices, p))}
            >
              {PRICE_LABELS[p]}
            </Chip>
          ))}
        </FilterGroup>
      )}
      {hasActive && (
        <button
          onClick={clearAll}
          className="text-xs font-semibold text-neutral-400 underline-offset-2 hover:text-[#f2a93b] hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "border-[#f2a93b] bg-[#f2a93b] text-black"
          : "border-white/15 bg-white/[0.03] text-neutral-300 hover:border-[#f2a93b]/50 hover:text-[#f2a93b]",
      )}
    >
      {children}
    </button>
  );
}
