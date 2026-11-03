import type { Metadata } from "next";
import { FREE_SHIPPING_THRESHOLD, SITE_NAME } from "lib/brand";

const TITLE_MAX = 60;
const DESC_MIN = 110;
const DESC_MAX = 160;
const BRAND_SUFFIX = ` | ${SITE_NAME}`;

/** Cut at a clause or word boundary so a title never ends mid-word. */
function clipTitle(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const clause = Math.max(
    cut.lastIndexOf(": "),
    cut.lastIndexOf(" - "),
    cut.lastIndexOf(" — "),
  );
  const base = clause > max * 0.5 ? cut.slice(0, clause) : cut.slice(0, cut.lastIndexOf(" "));
  return `${base.replace(/[\s,;:–—-]+$/, "")}…`;
}

/**
 * The root layout appends " | Lush Aquarium". When that would push the title
 * past ~60 characters (where search results truncate it), drop the suffix and
 * use the page title on its own.
 */
export function fitTitle(title: string): { text: string; metadata: Metadata["title"] } {
  const clean = title.replace(/\s+/g, " ").trim();
  if (clean.length + BRAND_SUFFIX.length <= TITLE_MAX) return { text: clean, metadata: clean };
  const text = clipTitle(clean, TITLE_MAX);
  return { text, metadata: { absolute: text } };
}

/** 110-160 characters: trim at a sentence/word boundary, or add the shipping and returns line when too short. */
export function fitDescription(description: string): string {
  let d = description.replace(/\s+/g, " ").trim();
  if (d.length > DESC_MAX) {
    const cut = d.slice(0, DESC_MAX - 2);
    const sentence = cut.lastIndexOf(". ");
    d =
      sentence >= DESC_MIN
        ? cut.slice(0, sentence + 1)
        : `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:–—-]+$/, "")}…`;
  } else if (d.length < DESC_MIN) {
    const base = /[.!?]$/.test(d) ? d : `${d}.`;
    const tails = [
      ` Free shipping over $${FREE_SHIPPING_THRESHOLD} to the US & Canada, 30-day returns.`,
      ` Free shipping over $${FREE_SHIPPING_THRESHOLD}, 30-day returns.`,
      " 30-day returns, tracked shipping.",
    ];
    const tail = tails.find((t) => base.length + t.length <= DESC_MAX);
    if (tail) d = base + tail;
  }
  return d;
}

type PageMetaOptions = {
  title: string;
  description: string;
  /** Canonical path, e.g. "/guides/nano-tank-filter-guide". Also used as og:url. */
  path: string;
  /** Use the title exactly as given, without the " | Lush Aquarium" suffix (homepage). */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  image?: { url: string; width?: number; height?: number; alt?: string };
  publishedTime?: string;
  robots?: Metadata["robots"];
};

/**
 * One place that sets title, description, canonical, Open Graph and Twitter
 * together. A page that sets its own `openGraph` replaces the layout's, so
 * every page needs the full set (url, site name, type, image) to avoid the
 * homepage's og:url leaking onto it.
 */
export function pageMeta(o: PageMetaOptions): Metadata {
  const title = o.absoluteTitle
    ? { text: o.title, metadata: { absolute: o.title } as Metadata["title"] }
    : fitTitle(o.title);
  const description = fitDescription(o.description);
  const image = o.image ?? { url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME };
  return {
    title: title.metadata,
    description,
    alternates: { canonical: o.path },
    ...(o.robots ? { robots: o.robots } : {}),
    openGraph: {
      type: o.type ?? "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: o.path,
      title: title.text,
      description,
      images: [image],
      ...(o.publishedTime ? { publishedTime: o.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title.text,
      description,
      images: [image.url],
    },
  };
}
