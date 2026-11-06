import clsx from "clsx";

/**
 * Scroll-entry reveal with CSS scroll-driven animation (animation-timeline:
 * view()). No JavaScript decides visibility: the fade is tied to the element's
 * position in the viewport, so anything in view is visible, for crawlers and
 * screenshot renderers too. Browsers without scroll timelines (and visitors
 * with reduced motion) get static, fully visible content. See globals.css.
 *
 * `delay` staggers siblings by shifting where in the entry range they finish.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={clsx("aq-reveal", className)}
      style={
        delay
          ? ({
              "--aq-reveal-shift": `${Math.min(delay / 10, 30)}%`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
