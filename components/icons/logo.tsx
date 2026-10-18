import clsx from "clsx";

/**
 * Aqualux mark — interactive. A lit water surface over a planted tank
 * silhouette; three bubbles rise gently on loop, and on hover the waterline
 * shimmers and the bubbles accelerate. Pure SVG + CSS, no JS state.
 */
export default function LogoIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Aqualux logo"
      viewBox="0 0 128 48"
      fill="none"
      {...props}
      className={clsx("aql-logo text-current", props.className)}
    >
      <defs>
        <clipPath id="aql-tank">
          <path d="M10 20 C 22 20 24 32 36 32 L 92 32 C 104 32 106 20 118 20 L 118 46 L 10 46 Z" />
        </clipPath>
      </defs>
      {/* tank silhouette */}
      <path
        d="M10 20 C 22 20 24 32 36 32 L 92 32 C 104 32 106 20 118 20"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* bubbles inside the tank — animated */}
      <g clipPath="url(#aql-tank)" stroke="currentColor">
        <circle className="aql-b1" cx="46" cy="30" r="2" strokeWidth={1.6} opacity={0.75} />
        <circle className="aql-b2" cx="64" cy="30" r="2.8" strokeWidth={1.6} opacity={0.6} />
        <circle className="aql-b3" cx="82" cy="30" r="1.6" strokeWidth={1.6} opacity={0.7} />
      </g>
      {/* registration tick */}
      <path
        className="aql-tick"
        d="M64 12 V 24 M 58 18 H 70"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.9}
      />
      <circle cx="64" cy="18" r="2.4" fill="currentColor" />
      <style>{`
        .aql-b1, .aql-b2, .aql-b3 { transform-box: fill-box; transform-origin: center; animation: aql-rise 4.2s ease-in infinite; }
        .aql-b2 { animation-duration: 5.4s; animation-delay: 0.8s; }
        .aql-b3 { animation-duration: 6.2s; animation-delay: 1.6s; }
        @keyframes aql-rise {
          0%   { transform: translateY(0);     opacity: 0; }
          12%  { opacity: .8; }
          85%  { opacity: .5; }
          100% { transform: translateY(-14px); opacity: 0; }
        }
        .aql-logo .aql-tick { transition: opacity .3s ease; }
        .aql-logo:hover .aql-tick { opacity: 1; }
        .aql-logo:hover .aql-b1, .aql-logo:hover .aql-b2, .aql-logo:hover .aql-b3 {
          animation-duration: 1.8s;
        }
        @media (prefers-reduced-motion: reduce) {
          .aql-b1, .aql-b2, .aql-b3 { animation: none; opacity: .35; }
        }
      `}</style>
    </svg>
  );
}
