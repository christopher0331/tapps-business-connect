import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/profiles/gina-humphries-edward-jones",
        destination: "/profiles/gina-humphries-ameriprise-financial",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
