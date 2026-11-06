import fs from "node:fs";
import path from "node:path";

/**
 * Planted-tank setup pages by tank size.
 *
 * Every number on a /tanks page is computed here from the tank's real outer
 * dimensions, and every product pick is chosen from the catalogue's own fit
 * ranges (light bar length, heater litre bands, filter capacity). Nothing is
 * a per-page string swap: the hand-written notes live in data/tank-sizes.json.
 */

type RawTank = {
  slug: string;
  name: string;
  short: string;
  dims: [number, number, number]; // L, W, H in inches (outer)
  keyword: string;
  summary: string;
  style: string;
  plants: string[];
  stocking: string;
  pitfalls: string[];
  co2: "low" | "optional" | "recommended";
  faq: [string, string][];
};

const raw = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data/tank-sizes.json"), "utf8"),
) as { updatedAt: string; tanks: RawTank[] };

export const TANKS_UPDATED = raw.updatedAt;

const IN_TO_CM = 2.54;
const CUIN_PER_GAL = 231;
const L_PER_GAL = 3.78541;

const r1 = (n: number) => Math.round(n * 10) / 10;

export type Pick = { handle: string; variant?: string; why: string };

export type TankSpec = RawTank & {
  cm: [number, number, number];
  grossGal: number;
  grossL: number;
  /** Water after ~2.5 in of substrate and ~10% for hardscape and headroom. */
  netL: number;
  netGal: number;
  /** Litres of substrate at an average depth (front shallower, back deeper). */
  substrate: {
    depthIn: number;
    litres: number;
    soilKg: number;
    sandKg: number;
  }[];
  heater: { watts: number; variant: string; perGal: string };
  flowLph: [number, number];
  photoperiod: string;
  light: Pick | null;
  lightNote: string;
  filter: Pick | null;
  filterNote: string;
  co2Pick: Pick | null;
  co2Note: string;
  extras: Pick[];
};

// Catalogue fit ranges (from product specs / variant titles in data/products.json).
const LIGHTS: { handle: string; min: number; max: number; label: string }[] = [
  {
    handle: "rgbw-55-full-spectrum-led",
    min: 40,
    max: 55,
    label: "40 cm bar, brackets reach 55 cm",
  },
  {
    handle: "aurora-48-planted-tank-led",
    min: 48,
    max: 61,
    label: "48 cm bar, fits 48 to 61 cm tanks",
  },
  {
    handle: "aurora-smart-78-rgb-led",
    min: 70,
    max: 95,
    label: "78 cm bar, fits 70 to 95 cm tanks",
  },
];

const HEATERS: { watts: number; variant: string; maxL: number }[] = [
  { watts: 25, variant: "25 W — 20-40 L tanks", maxL: 40 },
  { watts: 50, variant: "50 W — 40-80 L tanks", maxL: 80 },
  { watts: 100, variant: "100 W — 80-150 L tanks", maxL: 150 },
  { watts: 200, variant: "200 W — 150-250 L tanks", maxL: 250 },
  { watts: 300, variant: "300 W — 250-400 L tanks", maxL: 400 },
];

function build(t: RawTank): TankSpec {
  const [L, W, H] = t.dims;
  const cm = [L, W, H].map((x) => Math.round(x * IN_TO_CM)) as [
    number,
    number,
    number,
  ];
  const grossGal = (L * W * H) / CUIN_PER_GAL;
  const grossL = grossGal * L_PER_GAL;
  const netL = ((L * W * (H - 2.5)) / CUIN_PER_GAL) * L_PER_GAL * 0.9;

  const substrate = [2, 3, 4].map((depthIn) => {
    const litres = (L * W * depthIn * 16.387) / 1000; // in^3 -> L
    return {
      depthIn,
      litres: Math.round(litres),
      soilKg: Math.round(litres * 1.0), // fired aqua soil ~1.0 kg/L
      sandKg: Math.round(litres * 1.5), // aquarium sand ~1.5 kg/L
    };
  });

  const h = HEATERS.find((x) => netL <= x.maxL) ?? HEATERS.at(-1)!;
  const heater = {
    watts: h.watts,
    variant: h.variant,
    perGal: `${r1(h.watts / (netL / L_PER_GAL))} W per gallon`,
  };

  // Planted tanks: 4-6x volume turnover per hour.
  const flowLph: [number, number] = [
    Math.round((netL * 4) / 10) * 10,
    Math.round((netL * 6) / 10) * 10,
  ];

  const fit = LIGHTS.filter((x) => cm[0] >= x.min && cm[0] <= x.max);
  const best = fit.at(-1);
  const light: Pick | null = best
    ? {
        handle: best.handle,
        why: `${best.label}; your tank is ${cm[0]} cm long.`,
      }
    : null;
  let lightNote = best
    ? `A ${cm[0]} cm tank needs a bar that covers the full length so the ends do not go dark.`
    : `At ${cm[0]} cm long this tank needs about ${Math.round(cm[0] / 10) * 10} cm of light coverage. We do not stock a bar that long yet, so look for a single ${Math.round(cm[0] / 10) * 10} cm full-spectrum bar rather than two short ones with a gap.`;
  if (best && cm[2] >= 45)
    lightNote += ` At ${cm[2]} cm tall, run it at full output or add a second bar for carpet plants.`;
  if (best && cm[1] >= 45)
    lightNote += ` The ${cm[1]} cm front-to-back depth is wide for one bar; two bars or a centre mount gives even coverage.`;

  let filter: Pick | null = null;
  let filterNote = "";
  if (netL <= 25) {
    filter = {
      handle: "nano-hang-on-filter-usb",
      why: "Low flow sized for nano tanks; will not batter shrimp or a betta.",
    };
    filterNote = `Target ${flowLph[0]}-${flowLph[1]} L/h. In a tank this small a gentle filter beats a strong one.`;
  } else if (netL <= 80) {
    filter = {
      handle: "hob-waterfall-filter-3-stage",
      why: "250 L/h hang-on-back, rated for tanks up to about 80 L.",
    };
    filterNote = `Target ${flowLph[0]}-${flowLph[1]} L/h for a planted tank this size.`;
  } else if (netL <= 100) {
    filter = {
      handle: "4-in-1-internal-filter-pump",
      why: "Adjustable internal filter rated to about 100 L, with lift-out media.",
    };
    filterNote = `Target ${flowLph[0]}-${flowLph[1]} L/h.`;
  } else {
    filterNote = `Target ${flowLph[0]}-${flowLph[1]} L/h, which is canister territory. Our filters top out around 100 L, so pair a canister rated for at least ${Math.round(netL / 10) * 10} L with our media: ceramic rings for bacteria, foam pads for mechanical.`;
  }

  let co2Pick: Pick | null = null;
  let co2Note = "";
  if (t.co2 === "low") {
    co2Note =
      "Not needed. Pick low-light plants, keep the light on a 6-7 hour timer, and dose a little liquid fertilizer weekly.";
  } else if (t.co2 === "optional") {
    co2Pick = {
      handle: "diy-co2-generator-kit-2l",
      why: "Refill-free citric acid kit; enough for a tank this size without a gas cylinder.",
    };
    co2Note =
      "Optional. Low-light plants grow without it; add CO2 if you want a carpet or red stems.";
  } else {
    co2Pick = {
      handle: "co2-starter-bundle-regulator-diffuser-checker",
      why: "Regulator with solenoid, atomiser and drop checker; you add a refillable cylinder.",
    };
    co2Note = `Recommended. At ${Math.round(netL)} litres a pressurised system is the easiest way to hold steady CO2 for carpets and stems.`;
  }

  const extras: Pick[] = [
    {
      handle: "aqua-soil-planted-substrate",
      why: `About ${substrate[1]!.litres} L for a 3 inch average depth.`,
    },
    {
      handle: "adjustable-submersible-heater",
      variant: h.variant,
      why: `${h.watts} W covers about ${Math.round(netL)} L of water.`,
    },
    {
      handle: "all-in-one-liquid-fertilizer",
      why: "Weekly NPK and trace dosing for stems and rosettes.",
    },
    {
      handle: "gh-kh-test-strips-7in1",
      why: "Check nitrate, KH and pH while the tank cycles.",
    },
  ];
  if (netL >= 100)
    extras.push({
      handle: "root-fertilizer-tabs-40",
      why: "Feed swords and crypts under the substrate in a bigger tank.",
    });
  else
    extras.push({
      handle: "stick-on-thermometer-strips",
      why: "Confirms the heater is holding temperature.",
    });

  return {
    ...t,
    cm,
    grossGal: r1(grossGal),
    grossL: Math.round(grossL),
    netL: Math.round(netL),
    netGal: r1(netL / L_PER_GAL),
    substrate,
    heater,
    flowLph,
    photoperiod: t.co2 === "recommended" ? "7-8 hours" : "6-7 hours",
    light,
    lightNote,
    filter,
    filterNote,
    co2Pick,
    co2Note,
    extras,
  };
}

export const TANKS: TankSpec[] = raw.tanks.map(build);

export function getTank(slug: string): TankSpec | undefined {
  return TANKS.find((t) => t.slug === slug);
}

export function tankUrls(): string[] {
  return [
    "/tanks",
    ...TANKS.map((t) => `/tanks/${t.slug}`),
    "/tools/substrate-calculator",
  ];
}

/** Computed FAQ entries that differ per tank (numbers), plus the hand-written one. */
export function tankFaq(t: TankSpec): { q: string; a: string }[] {
  const s3 = t.substrate[1]!;
  return [
    {
      q: `How much substrate do I need for a ${t.name} tank?`,
      a: `For a ${t.cm[0]} x ${t.cm[1]} cm footprint at a 3 inch average depth you need about ${s3.litres} litres: roughly ${s3.soilKg} kg of aqua soil or ${s3.sandKg} kg of sand. At 2 inches it is ${t.substrate[0]!.litres} litres.`,
    },
    {
      q: `What size heater for a ${t.name} planted tank?`,
      a: `A ${t.heater.watts} W heater. Once substrate and rock are in, a ${t.name} holds about ${t.netL} litres (${t.netGal} gallons) of water, which works out to ${t.heater.perGal}.`,
    },
    {
      q: `How much filter flow does a ${t.name} planted tank need?`,
      a: `Aim for ${t.flowLph[0]}-${t.flowLph[1]} litres per hour, which turns the water over 4 to 6 times an hour. Planted tanks like steady, gentle flow rather than a jet.`,
    },
    ...t.faq.map(([q, a]) => ({ q, a })),
  ];
}
