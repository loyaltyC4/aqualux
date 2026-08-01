"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Suggestion = {
  handle: string;
  title: string;
  price: string;
  currencyCode: string;
  image: string | null;
};

function fmt(amount: string, code: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
  }).format(parseFloat(amount));
}

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("q") || "");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setHighlight(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search-suggest?q=${encodeURIComponent(value)}`,
        );
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } catch {
        /* ignore transient network errors */
      }
    }, 200);
  }

  function goToSearch() {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (e.key === "Enter") goToSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? results.length - 1 : h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlight >= 0 && results[highlight]) {
        setOpen(false);
        router.push(`/product/${results[highlight]!.handle}`);
      } else {
        goToSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToSearch();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search decks, trucks, molds…"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          className="w-full rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-[#eceae4] placeholder:text-neutral-500 focus:border-[#f2a93b]/60"
        />
        <div className="absolute right-0 top-0 mr-3 flex h-full items-center text-neutral-500">
          <MagnifyingGlassIcon className="h-4" />
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1618] shadow-2xl">
          <ul>
            {results.map((r, i) => (
              <li key={r.handle}>
                <Link
                  href={`/product/${r.handle}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 transition ${
                    i === highlight
                      ? "bg-white/[0.06]"
                      : "hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="relative h-10 w-10 flex-none overflow-hidden rounded-md bg-white">
                    {r.image ? (
                      <Image
                        src={r.image}
                        alt=""
                        fill
                        className="object-contain p-1"
                      />
                    ) : null}
                  </div>
                  <span className="flex-1 truncate text-sm text-neutral-200">
                    {r.title}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-[#f2a93b]">
                    {fmt(r.price, r.currencyCode)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={goToSearch}
            className="block w-full border-t border-white/10 px-3 py-2.5 text-left text-xs font-semibold text-neutral-400 hover:text-[#f2a93b]"
          >
            See all results for &quot;{query}&quot; →
          </button>
        </div>
      )}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <form className="relative w-full">
      <input
        placeholder="Search decks, trucks, molds…"
        className="w-full rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-[#eceae4] placeholder:text-neutral-500"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center text-neutral-500">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
