"use client";

import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import {
  HardwareType,
  PRICE_LABELS,
  PriceBucket,
  WIDTH_LABELS,
  WidthBucket,
} from "lib/filters";

type Facets = {
  widths: WidthBucket[];
  types: HardwareType[];
  prices: PriceBucket[];
};

function toggle<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

const WIDTH_ORDER: WidthBucket[] = ["32", "34", "36", "multi"];
const PRICE_ORDER: PriceBucket[] = ["under30", "30to60", "60to100", "over100"];

export function FilterBar({ facets }: { facets: Facets }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeWidths = (searchParams.get("width")?.split(",").filter(Boolean) ??
    []) as WidthBucket[];
  const activeTypes = (searchParams.get("type")?.split(",").filter(Boolean) ??
    []) as HardwareType[];
  const activePrices = (searchParams.get("price")?.split(",").filter(Boolean) ??
    []) as PriceBucket[];

  const hasActive =
    activeWidths.length > 0 ||
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
    params.delete("width");
    params.delete("type");
    params.delete("price");
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const showWidths = facets.widths.length > 0;
  const showTypes = facets.types.length > 1;
  const showPrices = facets.prices.length > 1;

  if (!showWidths && !showTypes && !showPrices) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-white/10 pb-5">
      {showWidths && (
        <FilterGroup label="Width">
          {WIDTH_ORDER.filter((w) => facets.widths.includes(w)).map((w) => (
            <Chip
              key={w}
              active={activeWidths.includes(w)}
              onClick={() => setParam("width", toggle(activeWidths, w))}
            >
              {WIDTH_LABELS[w]}
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
