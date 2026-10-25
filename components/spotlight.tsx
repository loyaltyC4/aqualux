"use client";

import clsx from "clsx";
import type { ComponentProps } from "react";

/**
 * Pointer-follow spotlight, adapted from the 21st.dev block
 * @mohammadshehadeh/feature-08 (Hirael, MIT). The pointer position is written to
 * CSS variables on the element itself, so the glow tracks the cursor without a single
 * React re-render. Touch devices have no hover, so it simply never shows there.
 */
export function Spotlight({
  className,
  children,
  tint = "47 106 55",
  ...props
}: ComponentProps<"div"> & { tint?: string }) {
  return (
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={clsx("group/spot relative", className)}
      {...props}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100 motion-reduce:hidden"
        style={{
          background: `radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgb(${tint} / 0.16), transparent 70%)`,
        }}
      />
    </div>
  );
}
