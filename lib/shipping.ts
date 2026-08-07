/**
 * Shipping zones — the single source of truth for every delivery claim.
 *
 * Why this file exists
 * --------------------
 * Delivery promises were previously hardcoded in six places and they
 * contradicted each other. The policy page said 8-15 business days while the
 * Stripe checkout still offered "Standard 3-8" and an "Express 1-3" that is
 * physically impossible from a Chinese origin. A buyer who read one number and
 * was charged against another has a legitimate complaint, and under the
 * Australian Consumer Law an unachievable delivery estimate is misleading
 * conduct regardless of intent.
 *
 * Every transit range below starts from CARRIER-QUOTED figures we actually
 * measured against the CJ freight API on a real 860 g item:
 *
 *   CN -> US   YunExpress Ordinary   4-7 days    US$14.57
 *   CN -> US   LuWei Ordinary        5-11 days   US$13.95
 *   CN -> AU   CJPacket Ordinary     4-8 days    US$19.15
 *   CN -> AU   CJPacket Eub          6-10 days   US$14.54
 *
 * Those are the carrier's own optimistic numbers and they exclude supplier
 * handling and customs. So each published range is the quoted figure widened
 * at BOTH ends: we would rather quote 7-14 and land on day 9 than quote 4-8 and
 * miss. There is no express tier, because we cannot buy one on this route.
 *
 * Freight cost model, also measured: about US$5.30 + US$10.70 per billed kg,
 * where billed kg is max(actual, L x W x H cm / 5000). Volumetric dominates for
 * bulky goods, which is why tanks and cabinets are not sold at all.
 */

export type ZoneId = "AU" | "NA" | "UKEU" | "ASIA" | "ROW";

export type Zone = {
  id: ZoneId;
  label: string;
  /** ISO 3166-1 alpha-2. */
  countries: string[];
  /** Business days AFTER dispatch. Dispatch itself is DISPATCH_DAYS. */
  minDays: number;
  maxDays: number;
  /** Flat rate in the store currency, in major units. */
  rate: number;
  /** Order subtotal at or above which shipping is free. */
  freeOver: number;
  /** Shown on the policy page so the promise is explainable, not just asserted. */
  note: string;
};

/** Packing and handoff to the carrier, quoted separately from transit. */
export const DISPATCH_MIN_DAYS = 1;
export const DISPATCH_MAX_DAYS = 2;

export const ZONES: Zone[] = [
  {
    id: "AU",
    label: "Australia & New Zealand",
    countries: ["AU", "NZ"],
    minDays: 7,
    maxDays: 14,
    rate: 9.95,
    freeOver: 99,
    note: "Carrier quotes 6-10 business days on this lane. We publish 7-14 to absorb supplier handling and customs.",
  },
  {
    id: "NA",
    label: "United States & Canada",
    countries: ["US", "CA"],
    minDays: 6,
    maxDays: 12,
    rate: 11.95,
    freeOver: 120,
    note: "The fastest lane we buy: carrier quotes 4-7 business days. Published as 6-12.",
  },
  {
    id: "UKEU",
    label: "United Kingdom & Europe",
    countries: [
      "GB", "IE", "DE", "FR", "NL", "BE", "AT", "ES", "IT", "PT",
      "SE", "DK", "FI", "NO", "PL", "CZ", "LU",
    ],
    minDays: 8,
    maxDays: 18,
    rate: 13.95,
    freeOver: 140,
    note: "Customs clearance is the variable here, not transit. Import VAT and any duty are payable by the recipient.",
  },
  {
    id: "ASIA",
    label: "Singapore, Japan, Hong Kong, Korea & UAE",
    countries: ["SG", "JP", "HK", "KR", "AE", "MY"],
    minDays: 6,
    maxDays: 14,
    rate: 12.95,
    freeOver: 140,
    note: "Short haul from origin, but clearance varies by destination.",
  },
  {
    id: "ROW",
    label: "Rest of world",
    countries: ["ZA", "MX", "BR", "CL", "IL", "TH", "PH", "IS", "GR", "RO", "HU", "SK"],
    minDays: 12,
    maxDays: 25,
    rate: 19.95,
    freeOver: 180,
    note: "Tracked but slower, and clearance can add time we do not control. Duties and taxes are payable by the recipient.",
  },
];

export const ALLOWED_COUNTRIES: string[] = ZONES.flatMap((z) => z.countries);

/** Australia is the primary market: prices are set against AU comparables. */
export const DEFAULT_ZONE: ZoneId = "AU";

const BY_COUNTRY = new Map<string, Zone>();
for (const z of ZONES) for (const c of z.countries) BY_COUNTRY.set(c, z);

export function zoneForCountry(country?: string | null): Zone {
  const hit = country ? BY_COUNTRY.get(country.toUpperCase()) : undefined;
  return hit ?? ZONES.find((z) => z.id === DEFAULT_ZONE)!;
}

export function zoneById(id: ZoneId): Zone {
  return ZONES.find((z) => z.id === id) ?? ZONES[0]!;
}

/**
 * Total window a buyer actually experiences: dispatch plus transit.
 * Quoting transit alone is the mistake that produced "ships in 1-2 days" being
 * read as a delivery promise.
 */
export function deliveryWindow(zone: Zone): { min: number; max: number } {
  return {
    min: zone.minDays + DISPATCH_MIN_DAYS,
    max: zone.maxDays + DISPATCH_MAX_DAYS,
  };
}

export function deliveryText(zone: Zone): string {
  const { min, max } = deliveryWindow(zone);
  return `${min}-${max} business days to ${zone.label}`;
}
