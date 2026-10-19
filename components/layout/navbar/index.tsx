import CartModal from "components/cart/modal";
import { BrandLogo } from "components/brand-logo";
import { COLLECTIONS, FREE_SHIPPING_THRESHOLD } from "lib/brand";
import { getCollections } from "lib/shopify";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const ANNOUNCEMENTS = [
  `Free shipping over $${FREE_SHIPPING_THRESHOLD} to US & Canada`,
  "Dispatched in 1-2 business days",
  "30-day returns",
];

// Full collection titles ("Aquascaping Tools & Equipment") are for page H1s and
// SEO. In the nav they pushed the bar to ~1700px and wrapped on laptops.
const SHORT: Record<string, string> = Object.fromEntries(
  COLLECTIONS.map((c) => [c.handle, c.short]),
);

export async function Navbar() {
  const collections = await getCollections();
  const links = [
    ...collections
      .filter((c) => c.handle)
      .map((c) => ({ title: SHORT[c.handle] ?? c.title, path: c.path })),
    { title: "Guides", path: "/guides" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar — the utility strip: shipping, curation, returns */}
      <div className="hidden bg-[var(--aq-deep)] text-white/85 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-10 px-6 py-2 text-[12px] font-medium">
          {ANNOUNCEMENTS.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </div>
      </div>

      <nav className="flex items-center gap-4 border-b border-black/10 bg-white/90 px-4 py-3 backdrop-blur-md lg:px-6">
        <div className="flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={links} />
          </Suspense>
        </div>

        <BrandLogo />

        <ul className="hidden flex-1 items-center gap-1 pl-6 md:flex">
          {links.map((item) => (
            <li key={item.title}>
              <Link
                href={item.path}
                prefetch={true}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-[var(--aq-ink)]/75 transition-colors hover:bg-[var(--aq-raised)] hover:text-[var(--aq-ink)]"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex flex-none items-center gap-3">
          <div className="hidden w-52 lg:block xl:w-64">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          <CartModal />
        </div>
      </nav>
    </header>
  );
}
