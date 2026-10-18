import Link from "next/link";
import clsx from "clsx";
import { SITE_NAME } from "lib/brand";
import LogoIcon from "components/icons/logo";

/** Live brand lockup: Refraction A mark + two-tone wordmark. */
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
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0e7490]/35 bg-white shadow-[0_1px_2px_rgba(19,42,53,0.06)] transition-shadow duration-300 group-hover:shadow-[0_2px_8px_rgba(14,116,144,0.18)]"
      >
        <LogoIcon className="h-7 w-7 text-[#0e7490]" />
      </span>
      <span className="text-[18px] font-semibold leading-none tracking-tight text-[#132a35]">
        Aqua<span className="text-[#0e7490]">lux</span>
      </span>
    </Link>
  );
}
