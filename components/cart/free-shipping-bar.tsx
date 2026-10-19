import { FREE_SHIPPING_THRESHOLD } from "lib/brand";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = remaining <= 0;

  return (
    <div className="mb-4 rounded-2xl border border-black/10 bg-white p-3.5">
      <p className="text-center text-xs font-medium text-neutral-700">
        {unlocked ? (
          <span className="text-[#2f6a37]">
            🎉 You&apos;ve unlocked free shipping!
          </span>
        ) : (
          <>
            Add{" "}
            <span className="font-semibold text-[#0f1d18]">
              ${remaining.toFixed(2)}
            </span>{" "}
            more for free shipping
          </>
        )}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-[#2f6a37] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
