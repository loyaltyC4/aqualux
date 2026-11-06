/**
 * Hairline metric grid. Adapted from the 21st.dev "Stats Grid" block
 * (shadcnui-blocks/stats-04): bordered cells using the -m-px border-t
 * border-l trick so neighbouring cells share one 1px line. Recoloured to the
 * moss-on-stone tokens and switched to the mono spec face for numbers.
 */
export function SpecGrid({
  items,
}: {
  items: { value: string; label: string; note?: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[var(--aq-line)] bg-white md:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="-m-px border-l border-t border-[var(--aq-line)] p-5 md:p-7"
        >
          <dt className="text-sm text-[var(--aq-muted)]">{it.label}</dt>
          <dd className="aq-spec mt-2 text-xl font-medium sm:text-2xl tracking-tight text-[var(--aq-ink)] md:text-3xl">
            {it.value}
          </dd>
          {it.note ? (
            <dd className="mt-1.5 text-xs leading-relaxed text-[var(--aq-muted)]">
              {it.note}
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
