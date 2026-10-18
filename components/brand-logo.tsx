import Link from "next/link";
import clsx from "clsx";
import { SITE_NAME } from "lib/brand";
import LogoIcon from "components/icons/logo";

/** Live brand lockup: animated tank mark + two-tone wordmark. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      prefetch
      aria-label={`${SITE_NAME} home`}
      className={clsx("group flex flex-none items-center gap-2.5", className)}
    >
      <span
        aria-hidden
        className="flex h-9 w-[72px] items-center justify-center rounded-lg border border-[#0e7490]/40 bg-[#0e7490]/[0.06] px-2 transition-colors duration-300 group-hover:bg-[#0e7490]/[0.12]"
      >
        <LogoIcon className="h-5 w-auto text-[#0e7490] transition-colors duration-300 group-hover:text-[#0b5c73]" />
      </span>
      <span className="text-[17px] font-semibold leading-none tracking-tight text-[#132a35]">
        Aqua<span className="text-[#0e7490]">lux</span>
      </span>
    </Link>
  );
}
