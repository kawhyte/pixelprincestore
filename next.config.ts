import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/product/free-print",
        destination: "/free-downloads",
        permanent: true, // 308 redirect for SEO preservation
      },
    ];
  },
};

export default nextConfig;
