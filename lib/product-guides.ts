import fs from "node:fs";
import path from "node:path";

/**
 * Hand-written buying and setup guides for individual products. One JSON file
 * per batch in data/product-guides/, merged here by handle. A guide adds
 * sections (heading + body, blank line = new paragraph, [text](/path) =
 * internal link) and extra FAQs on top of what the catalogue already holds.
 *
 * Nothing here is generated from a template: each entry is written for the
 * product, and claims stay inside what the listing and spec already state.
 */
export type ProductGuide = {
  sections: { h: string; body: string }[];
  faqs?: { q: string; a: string }[];
};

const dir = path.join(process.cwd(), "data/product-guides");

const guides: Record<string, ProductGuide> = {};
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  Object.assign(guides, JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")));
}

export function getProductGuide(handle: string): ProductGuide | undefined {
  return guides[handle];
}

export function guideHandles(): string[] {
  return Object.keys(guides);
}
