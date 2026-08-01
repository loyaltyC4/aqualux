import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { GeistSans } from "geist/font/sans";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_LEGAL_NAME,
  SOCIALS,
} from "lib/brand";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_NAME} / ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "fingerboard",
    "fingerboards",
    "fingerboard complete",
    "fingerboard decks",
    "fingerboard trucks",
    "fingerboard wheels",
    "fingerboard bushings",
    "fingerboard mold",
    "concave mold",
    "wooden fingerboard ramp",
    "34mm fingerboard",
    "pro fingerboard shop",
  ],
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} / ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} / ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  // Deliberately NOT setting a site-wide default canonical here: every real
  // page sets its own explicit alternates.canonical. A root-level default
  // would be silently (and wrongly) inherited by any page that forgets to
  // set one, telling Google that page is a duplicate of the homepage.
  category: "shopping",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_LEGAL_NAME,
    url: baseUrl,
    logo: `${baseUrl}/brand/mark.png`,
    description: SITE_DESCRIPTION,
    sameAs: [SOCIALS.instagram, SOCIALS.youtube, SOCIALS.tiktok],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`dark ${GeistSans.variable}`}>
      <body className="bg-[#060d0e] text-[#eceae4] antialiased selection:bg-[#f2a93b] selection:text-black">
        {/* Direction C display + body fonts (Fontshare); React hoists these to <head> */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=general-sans@400,500,600&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <CartProvider>
          <Navbar />
          <main>
            {children}
            <Toaster closeButton richColors theme="dark" />
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
