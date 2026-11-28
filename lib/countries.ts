import { zoneForCountry, deliveryWindow, DISPATCH_MIN_DAYS, DISPATCH_MAX_DAYS, type Zone } from "lib/shipping";

/**
 * Destination pages: /planted-aquarium-supplies/<slug>.
 *
 * Shipping figures are never typed here: they come from lib/shipping (ZONES), the single source of truth behind
 * the policy page, checkout and product schema. What this file adds is what genuinely differs by country and
 * matters when buying planted-tank gear from abroad: mains voltage and plug type (lights, pumps, heaters, feeders
 * are mains or adaptor powered), the tank-size units local buyers think in, and the local sales-tax name.
 * Mains facts are public standards (IEC World Plugs); each page says to confirm the adaptor on the product page.
 */

export type Units = "us" | "metric" | "metric-us" | "metric-uk";

export type Country = {
  slug: string;
  name: string;
  /** ISO 3166-1 alpha-2 used to look up the shipping zone. */
  iso: string;
  voltage: string;
  hz: string;
  plugs: string[];
  /** One concrete sentence about the electrical situation for this country. */
  powerNote: string;
  tax: string;
  taxNote: string;
  units: Units;
  /** Why a buyer here should read the page, in one sentence. */
  angle: string;
};

export const COUNTRIES: Country[] = [
  {
    slug: "australia-new-zealand", name: "Australia and New Zealand", iso: "AU", voltage: "230 V", hz: "50 Hz", plugs: ["Type I"],
    powerNote: "Australia and New Zealand share the Type I plug and a 230 V supply, so a plug that works in Sydney works in Auckland.",
    tax: "GST", taxNote: "Both countries charge GST on imported goods (10% in Australia, 15% in New Zealand), and duty can apply on some items; the recipient pays both.",
    units: "metric", angle: "Australia and New Zealand share one shipping lane, one plug standard and the same litre-based tank sizes, and biosecurity rules make soil, wood and rock the items most likely to be inspected.",
  },
  {
    slug: "united-states", name: "the United States", iso: "US", voltage: "120 V", hz: "60 Hz", plugs: ["Type A", "Type B"],
    powerNote: "The US runs on 120 V. Equipment rated only for 220 to 240 V will not run properly on it, so check the rating before you order any mains-powered item.",
    tax: "sales tax and any import duty", taxNote: "US sales tax varies by state and import duty depends on the goods; our prices do not include either.",
    units: "us", angle: "US buyers think in gallons and get our fastest lane, with the lowest flat shipping rate of any zone.",
  },
  {
    slug: "canada", name: "Canada", iso: "CA", voltage: "120 V", hz: "60 Hz", plugs: ["Type A", "Type B"],
    powerNote: "Canada runs on 120 V at 60 Hz with the same Type A and B sockets as the US, so plugs are not the problem; voltage rating is.",
    tax: "GST or HST and any duty", taxNote: "Canada applies GST (HST in some provinces) and may charge duty on imports; the recipient pays them on arrival.",
    units: "metric-us", angle: "Canadian aquarists mix litres and US gallons, and ride the same fast lane as the US.",
  },
  {
    slug: "united-kingdom", name: "the United Kingdom", iso: "GB", voltage: "230 V", hz: "50 Hz", plugs: ["Type G"],
    powerNote: "UK sockets are the Type G three-pin at 230 V. A two-pin or Type C adaptor will not fit, so confirm what plug a mains item arrives with.",
    tax: "import VAT and any duty", taxNote: "Import VAT and any duty are payable by the recipient, and clearance is the variable on UK deliveries, not transit.",
    units: "metric-uk", angle: "UK keepers use litres and sometimes imperial gallons, on the Type G plug.",
  },
  {
    slug: "europe", name: "Europe and Ireland", iso: "DE", voltage: "230 V", hz: "50 Hz", plugs: ["Type C", "Type E", "Type F"],
    powerNote: "Continental Europe and Ireland run on 230 V at 50 Hz, but the plug differs by country (see the table below): Ireland uses the UK Type G, while the mainland uses Types C, E and F.",
    tax: "import VAT and any duty", taxNote: "EU countries, Ireland included, charge import VAT on goods from outside the union and may charge duty; the recipient pays, and clearance time is the variable.",
    units: "metric", angle: "Europe and Ireland share one shipping lane and one voltage but at least five plug standards, and EU import VAT is the variable on clearance.",
  },
  {
    slug: "asia", name: "Singapore, Japan, Hong Kong, South Korea, Malaysia and the UAE", iso: "SG", voltage: "230 V", hz: "50 Hz", plugs: ["Type G"],
    powerNote: "Asia and the Gulf do not share a standard: Japan runs on 100 V (50 Hz in the east, 60 Hz in the west), South Korea on 220 V at 60 Hz with round pins, and Singapore, Hong Kong, Malaysia and the UAE use the UK-style Type G plug at 220 to 240 V. Equipment rated only for 220 to 240 V will under-perform on Japan's 100 V.",
    tax: "local tax and any duty", taxNote: "Each destination differs: Singapore applies GST, Japan consumption tax, South Korea, the UAE and Malaysia VAT or sales tax, and Hong Kong generally charges no VAT or GST and no duty on most goods. The recipient pays whatever applies.",
    units: "metric", angle: "These six destinations share one short-haul shipping lane but have six different electrical and tax set-ups, so the details matter more than the delivery time.",
  },
];

/** Per-country plug table for the Europe page (public standards). */
export const EUROPE_PLUGS: { country: string; plugs: string }[] = [
  { country: "Germany", plugs: "Type F (and C)" },
  { country: "France", plugs: "Type E (and C)" },
  { country: "Netherlands", plugs: "Type F (and C)" },
  { country: "Belgium", plugs: "Type E (and C)" },
  { country: "Austria", plugs: "Type F (and C)" },
  { country: "Spain", plugs: "Type F (and C)" },
  { country: "Italy", plugs: "Type L (and C, F)" },
  { country: "Portugal", plugs: "Type F (and C)" },
  { country: "Sweden", plugs: "Type F (and C)" },
  { country: "Denmark", plugs: "Type K (and C, F)" },
  { country: "Finland", plugs: "Type F (and C)" },
  { country: "Norway", plugs: "Type F (and C)" },
  { country: "Poland", plugs: "Type E (and C)" },
  { country: "Czechia", plugs: "Type E (and C)" },
  { country: "Luxembourg", plugs: "Type F (and C)" },
  { country: "Ireland", plugs: "Type G (the UK plug)" },
];

/** Per-destination facts for the Asia page (public standards). */
export const ASIA_ROWS: { country: string; voltage: string; hz: string; plug: string; tax: string }[] = [
  { country: "Singapore", voltage: "230 V", hz: "50 Hz", plug: "Type G", tax: "GST" },
  { country: "Japan", voltage: "100 V", hz: "50 or 60 Hz", plug: "Type A, B", tax: "Consumption tax" },
  { country: "Hong Kong", voltage: "220 V", hz: "50 Hz", plug: "Type G", tax: "No VAT or GST" },
  { country: "South Korea", voltage: "220 V", hz: "60 Hz", plug: "Type C, F", tax: "VAT" },
  { country: "Malaysia", voltage: "240 V", hz: "50 Hz", plug: "Type G", tax: "Sales and service tax" },
  { country: "United Arab Emirates", voltage: "230 V", hz: "50 Hz", plug: "Type G", tax: "VAT" },
];

export const countryBySlug = (slug: string) => COUNTRIES.find((c) => c.slug === slug);

export function countryZone(c: Country): Zone {
  return zoneForCountry(c.iso);
}

export function countryWindow(c: Country) {
  return deliveryWindow(countryZone(c));
}

export { DISPATCH_MIN_DAYS, DISPATCH_MAX_DAYS };

export function countryUrls(): string[] {
  return ["/planted-aquarium-supplies", ...COUNTRIES.map((c) => `/planted-aquarium-supplies/${c.slug}`)];
}

export function fmtVolume(litres: number, units: Units): string {
  const gal = litres / 3.78541;
  const ukGal = litres / 4.54609;
  if (units === "us") return `${gal.toFixed(1)} US gal`;
  if (units === "metric-us") return `${Math.round(litres)} L (${gal.toFixed(1)} US gal)`;
  if (units === "metric-uk") return `${Math.round(litres)} L (${ukGal.toFixed(1)} imp gal)`;
  return `${Math.round(litres)} L`;
}
