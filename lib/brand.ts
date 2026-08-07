import { zoneById } from "lib/shipping";

import { baseUrl } from "lib/utils";

/**
 * Central brand configuration for Aqualux.
 * Palette rationale: deep-water near-black canvas with a single warm amber
 * accent. The accent is brand-motivated, not decorative. The hero product
 * category IS aquarium grow lighting, so warm light over dark water is the
 * literal product experience.
 */

export const SITE_NAME = "Aqualux";
export const SITE_LEGAL_NAME = "Aqualux";
export const SITE_TAGLINE = "Gear for planted aquariums";
export const SITE_DESCRIPTION =
  "Aqualux is a curated shop for planted freshwater aquariums. Full-spectrum LED lighting, CO2 systems, aquascaping tools, substrate and hardscape, and water testing. Specs you can actually compare.";
export const SITE_URL = baseUrl;

export const SUPPORT_EMAIL = "hello@aqualux.store";
export const SOCIALS = {
  instagram: "https://instagram.com/aqualux",
  youtube: "https://youtube.com/@aqualux",
  tiktok: "https://tiktok.com/@aqualux",
};

// Revenue mechanics
/**
 * Store currency. The catalog is priced for the Australian market, where the
 * same generic planted-tank gear retails 2-3x the Amazon US price (verified:
 * an "Ultra-Thin LED Full Spectrum Planted Light" sells for A$180 locally
 * against A$56 on Amazon US). Selling in AUD is what makes the store read as
 * the cheap local option rather than a foreign site with a conversion step.
 */
export const CURRENCY = "AUD";

/**
 * In CURRENCY. Set above the median order so it actually lifts basket size.
 *
 * Derived from the Australia/NZ zone rather than typed again, because freight
 * to Europe costs meaningfully more than freight to Australia and each zone
 * therefore carries its own threshold (see lib/shipping). This constant is the
 * HOME-MARKET figure, used wherever a single headline number is shown — the
 * cart progress bar and the announcement bar. Anywhere that states it must say
 * which destinations it applies to, or it becomes a promise we do not keep for
 * a European buyer.
 */
export const FREE_SHIPPING_THRESHOLD = zoneById("AU").freeOver;
export const WELCOME_DISCOUNT_CODE = "SCAPE10";
export const WELCOME_DISCOUNT_LABEL = "10% off your first order";

// Palette tokens (mirrored in globals.css)
export const AMBER = "#f2a93b"; // single accent: warm grow-light
export const DEEP = "#060d0e"; // deep water canvas
export const PANEL = "#0d1618"; // raised panel
export const BONE = "#eceae4"; // primary text

export const COLLECTIONS = [
  { handle: "lighting", title: "Planted Aquarium Lighting", short: "Lighting" },
  { handle: "co2", title: "Aquarium CO2 Systems", short: "CO2" },
  {
    handle: "tools",
    title: "Aquascaping Tools & Equipment",
    short: "Tools",
  },
  { handle: "hardscape", title: "Substrate & Hardscape", short: "Hardscape" },
  { handle: "testing", title: "Aquarium Water Test Kits", short: "Testing" },
] as const;

export const COLLECTION_IMAGE: Record<string, string> = {
  lighting: "/brand/cat-lighting.jpg",
  co2: "/brand/cat-co2.jpg",
  tools: "/brand/cat-tools.jpg",
  hardscape: "/brand/cat-hardscape.jpg",
  testing: "/brand/cat-testing.jpg",
};

// Guides drive the SEO layer. Metadata only until the articles ship.
export const GUIDES: { slug: string; title: string }[] = [];
export type GuideMeta = { slug: string; title: string };
