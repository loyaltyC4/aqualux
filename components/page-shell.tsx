import Footer from "components/layout/footer";
import clsx from "clsx";
import { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
  wide = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <>
      <div
        className={clsx(
          "mx-auto px-6 py-16 md:py-24",
          wide ? "max-w-5xl" : "max-w-3xl",
        )}
      >
        {eyebrow ? (
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-7 bg-[#f2a93b]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f2a93b]">
              {eyebrow}
            </span>
          </div>
        ) : null}
        <h1 className="text-4xl font-semibold md:text-5xl">{title}</h1>
        {intro ? (
          <p className="mt-4 text-lg leading-relaxed text-neutral-400">
            {intro}
          </p>
        ) : null}
        <div className="mt-10">{children}</div>
      </div>
      <Footer />
    </>
  );
}

export function Section({
  heading,
  children,
}: {
  heading?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-8">
      {heading ? (
        <h2 className="mb-3 text-xl font-semibold text-[#eceae4]">{heading}</h2>
      ) : null}
      <div className="space-y-3 text-[15px] leading-relaxed text-neutral-300">
        {children}
      </div>
    </section>
  );
}
