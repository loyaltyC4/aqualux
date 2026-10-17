import Link from "next/link";
import clsx from "clsx";
import { SITE_NAME } from "lib/brand";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      prefetch
      aria-label={`${SITE_NAME} home`}
      className={clsx("flex flex-none items-center gap-2.5", className)}
    >
      <span
        aria-hidden
        className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-[#0e7490]/40 bg-[#0e7490]/10"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#0e7490]" />
      </span>
      <span className="text-[17px] font-semibold leading-none tracking-tight text-[#132a35]">
        Aqua<span className="text-[#0e7490]">lux</span>
      </span>
    </Link>
  );
}
