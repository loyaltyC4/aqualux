import Link from "next/link";
import type { ProductGuide } from "lib/product-guides";

const LINK = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;

/** Renders "text [label](/path) text" with real internal links. */
function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    out.push(
      <Link
        key={i}
        href={m[2]!}
        className="font-medium text-[#2f6a37] underline decoration-[#2f6a37]/30 underline-offset-2 transition-colors hover:decoration-[#2f6a37]"
      >
        {m[1]}
      </Link>,
    );
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export function ProductGuideSections({
  guide,
  title,
}: {
  guide: ProductGuide;
  title: string;
}) {
  return (
    <section
      aria-labelledby="guide-heading"
      className="mt-10 rounded-3xl border border-black/10 bg-white p-6 md:p-10"
    >
      <h2 id="guide-heading" className="text-xl font-semibold">
        Buying and setup guide
      </h2>
      <p className="mt-1 text-sm text-neutral-500">{title}</p>
      <div className="mt-6 divide-y divide-black/[0.08]">
        {guide.sections.map((s) => (
          <div
            key={s.h}
            className="grid gap-3 py-7 first:pt-2 last:pb-0 md:grid-cols-[1fr_2fr] md:gap-12"
          >
            <h3 className="text-base font-semibold text-[var(--aq-ink)]">
              {s.h}
            </h3>
            <div className="max-w-[65ch] space-y-3 text-[15px] leading-relaxed text-neutral-700">
              {s.body.split("\n\n").map((para, i) => (
                <p key={i}>
                  <Inline text={para} />
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
