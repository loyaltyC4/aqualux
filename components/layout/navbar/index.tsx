import CartModal from "components/cart/modal";
import { BrandLogo } from "components/brand-logo";
import { getCollections } from "lib/shopify";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const ANNOUNCEMENTS = [
  "Free shipping over $99",
  "Curated, not mass-listed",
  "Worldwide shipping",
  "30-day returns",
];

export async function Navbar() {
  const collections = await getCollections();
  const links = [
    ...collections
      .filter((c) => c.handle)
      .map((c) => ({ title: c.title, path: c.path })),
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="hidden bg-[#f2a93b] text-black sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 py-1.5 text-[12px] font-semibold tracking-wide">
          {ANNOUNCEMENTS.map((a) => (
            <span key={a} className="flex items-center gap-8">
              {a}
              <span className="text-black/30">◆</span>
            </span>
          ))}
        </div>
      </div>

      <nav className="flex items-center gap-4 border-b border-white/10 bg-[#060d0e]/85 px-4 py-3 backdrop-blur-md lg:px-6">
        <div className="flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={links} />
          </Suspense>
        </div>

        <BrandLogo />

        <ul className="hidden flex-1 items-center gap-6 pl-4 md:flex">
          {links.map((item) => (
            <li key={item.title}>
              <Link
                href={item.path}
                prefetch={true}
                className="whitespace-nowrap text-sm font-medium text-neutral-300 underline-offset-4 transition-colors hover:text-[#f2a93b]"
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
