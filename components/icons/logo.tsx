import clsx from "clsx";

/**
 * Aqualux mark: a lit water surface over a planted tank silhouette
 * with a precision registration tick. Uses currentColor so it can render in
 * volt-green, cream, or black depending on context.
 */
export default function LogoIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Aqualux logo"
      viewBox="0 0 128 48"
      fill="none"
      {...props}
      className={clsx("text-current", props.className)}
    >
      {/* tank silhouette */}
      <path
        d="M10 20 C 22 20 24 32 36 32 L 92 32 C 104 32 106 20 118 20"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* registration tick */}
      <path
        d="M64 12 V 24 M 58 18 H 70"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.9}
      />
      <circle cx="64" cy="18" r="2.4" fill="currentColor" />
    </svg>
  );
}
