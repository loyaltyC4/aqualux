import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-white transition-colors hover:border-white/30">
      <ShoppingCartIcon
        className={clsx(
          "h-4 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f2a93b] px-1 text-[11px] font-bold text-black">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
