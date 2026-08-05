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
        // Renamed: the handle itself claimed "9 in 1" while the supplier offer
        // (1688 id 732890024780) is an 8-parameter strip. dynamicParams is
        // false on the product route, so without this the old URL hard-404s.
        source: "/product/test-strips-9-in-1-100-count",
        destination: "/product/test-strips-8-in-1-100-count",
        permanent: true,
      },
      {
        source: "/product/digital-ph-tds-meter",
        destination: "/product/digital-ph-pen-meter",
        permanent: true,
      },
      {
        // Both timer handles now land on the lighting collection. The product
        // was withdrawn: Chinese button labels, Chinese display and a Chinese
        // GB outlet, so it is not sellable into AU or US. Pointing the old
        // sunrise handle at the retired socket handle would chain into a 404.
        source: "/product/sunrise-timer-controller",
        destination: "/search/lighting",
        permanent: true,
      },
      {
        source: "/product/aquarium-light-timer-socket",
        destination: "/search/lighting",
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
      {
        // Withdrawn: 5kg/6kg goods where CN->AU freight ($58.80/$69.50) exceeds
        // the entire AU market price. Heavy substrate and stone cannot be
        // dropshipped from China at any price.
        source: "/product/seiryu-stone-11lb-hardscape-box",
        destination: "/search/hardscape",
        permanent: true,
      },
      {
        source: "/product/aqua-soil-planted-substrate-9l",
        destination: "/search/hardscape",
        permanent: true,
      },
      {
        // Withdrawn: no correct product photo obtainable. The 1688 offer
        // carries no images and three Taobao searches returned either the
        // wrong product (filter wool, clarifier tablets) or a nitrite-only
        // kit, which would misrepresent a 3-parameter product. Testing stays
        // covered by the pH pen and the 9-in-1 strips.
        source: "/product/master-water-test-kit-3-in-1",
        destination: "/search/testing",
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
