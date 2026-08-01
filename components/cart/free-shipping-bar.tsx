import { FREE_SHIPPING_THRESHOLD } from "lib/brand";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = remaining <= 0;

  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
      <p className="text-center text-xs font-medium text-neutral-300">
        {unlocked ? (
          <span className="text-[#f2a93b]">
            🎉 You&apos;ve unlocked free shipping!
          </span>
        ) : (
          <>
            Add{" "}
            <span className="font-semibold text-[#eceae4]">
              ${remaining.toFixed(2)}
            </span>{" "}
            more for free shipping
          </>
        )}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#f2a93b] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
