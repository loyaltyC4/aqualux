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
