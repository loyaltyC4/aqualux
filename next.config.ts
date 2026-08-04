export default {
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
  async redirects() {
    // Product handles renamed for accuracy. dynamicParams is false on the
    // product route, so without these the old URLs hard-404 for anyone
    // holding a link or a search-index entry.
    return [
      {
        source: "/product/aurora-24-7-planted-tank-led-20in",
        destination: "/product/aurora-48-planted-tank-led",
        permanent: true,
      },
      {
        source: "/product/aurora-24-7-planted-tank-led-30in",
        destination: "/product/aurora-smart-78-rgb-led",
        permanent: true,
      },
      {
        // Briefly published as -58 while only half the supplier's spec panels
        // were cached; the product is the 78cm model.
        source: "/product/aurora-smart-58-rgb-led",
        destination: "/product/aurora-smart-78-rgb-led",
        permanent: true,
      },
      {
        source: "/product/aurora-pro-42w-36-48in",
        destination: "/product/aurora-pro-rgb-bluetooth",
        permanent: true,
      },
      {
        source: "/product/digital-ph-tds-meter",
        destination: "/product/digital-ph-pen-meter",
        permanent: true,
      },
      {
        source: "/product/sunrise-timer-controller",
        destination: "/product/aquarium-light-timer-socket",
        permanent: true,
      },
      {
        source: "/product/desktop-co2-system-complete",
        destination: "/product/diy-co2-generator-kit-2l",
        permanent: true,
      },
      {
        source: "/product/long-reach-tweezers-15in",
        destination: "/product/long-reach-tweezers-30cm",
        permanent: true,
      },
      {
        // Withdrawn, not renamed: the supplier product raises pH and was
        // listed as inert planted-tank sand. Send buyers to the hardscape
        // collection rather than a dead end or a substitute we can't stand behind.
        source: "/product/fine-white-sand-20lb",
        destination: "/search/hardscape",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};
