import fs from "node:fs";
import path from "node:path";

export type GuideFaq = { q: string; a: string };
export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  /** Path under /public, e.g. /guides/slug.jpg. Optional. */
  image?: string;
  faq?: GuideFaq[];
};

const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/guides.json"), "utf8"));

export const GUIDES_META: GuideMeta[] = data.guides;

export function getGuide(slug: string): GuideMeta & { html: string } | null {
  const meta = GUIDES_META.find((g) => g.slug === slug);
  if (!meta) return null;
  const file = path.join(process.cwd(), "content/guides", `${slug}.html`);
  if (!fs.existsSync(file)) return null;
  return { ...meta, html: fs.readFileSync(file, "utf8") };
}

export function guideUrls(): string[] {
  return GUIDES_META.map((g) => `/guides/${g.slug}`);
}
