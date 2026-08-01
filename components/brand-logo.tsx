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
        className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-[#f2a93b]/40 bg-[#f2a93b]/10"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#f2a93b] shadow-[0_0_12px_2px_rgba(242,169,59,.55)]" />
      </span>
      <span className="text-[17px] font-semibold leading-none tracking-tight text-[#eceae4]">
        Aqua<span className="text-[#f2a93b]">lux</span>
      </span>
    </Link>
  );
}
