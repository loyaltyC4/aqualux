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
        destination: "/product/aurora-smart-58-rgb-led",
        permanent: true,
      },
      {
        source: "/product/aurora-pro-42w-36-48in",
        destination: "/product/aurora-pro-rgb-bluetooth",
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
