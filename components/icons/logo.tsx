import clsx from "clsx";

/**
 * Aqualux — the Refraction A.
 * Light enters water and bends: the A's strokes run straight above the
 * surface and kink below it. The crossbar IS the waterline. One bubble
 * rises on a slow loop; hover accelerates it and sends a glint across
 * the surface. Pure SVG + CSS.
 */
export default function LogoIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Aqualux logo"
      viewBox="0 0 64 48"
      fill="none"
      {...props}
      className={clsx("aqlx-mark text-current", props.className)}
    >
      {/* apex + upper strokes (light in air: straight) */}
      <path
        className="aqlx-air"
        d="M24 12 L32 4 L40 12"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* lower strokes (refracted: kink outward below the surface) */}
      <path
        className="aqlx-below"
        d="M24 12 L27 20 L20 36"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="aqlx-below"
        d="M40 12 L37 20 L44 36"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* the waterline — doubles as the A's crossbar */}
      <g className="aqlx-water">
        <path
          d="M12 20 H27 M37 20 H52"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.85}
        />
        <path
          className="aqlx-glint"
          d="M12 20 H27"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>
      {/* one rising bubble below the surface */}
      <circle className="aqlx-bubble" cx="32" cy="30" r="2.2" stroke="currentColor" strokeWidth={1.8} />
      <style>{`
        .aqlx-water { transform-box: fill-box; transform-origin: center; animation: aqlx-surface 3.4s ease-in-out infinite; }
        @keyframes aqlx-surface {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(1.4px); }
        }
        .aqlx-below { opacity: .92; }
        .aqlx-bubble { transform-box: fill-box; transform-origin: center; animation: aqlx-rise 4.6s ease-in infinite; opacity: 0; }
        @keyframes aqlx-rise {
          0%   { transform: translateY(0);    opacity: 0; }
          15%  { opacity: .75; }
          80%  { opacity: .45; }
          100% { transform: translateY(-9px); opacity: 0; }
        }
        .aqlx-glint { stroke-dasharray: 15 46; stroke-dashoffset: 46; opacity: .9; }
        .aqlx-mark:hover .aqlx-glint { animation: aqlx-sweep 1.1s ease-out; }
        .aqlx-mark:hover .aqlx-bubble { animation-duration: 1.9s; }
        @keyframes aqlx-sweep {
          from { stroke-dashoffset: 46; }
          to   { stroke-dashoffset: -15; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aqlx-water, .aqlx-bubble, .aqlx-glint { animation: none; }
          .aqlx-bubble { opacity: .4; }
        }
      `}</style>
    </svg>
  );
}
