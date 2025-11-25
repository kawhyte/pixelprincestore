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

  // CRITICAL FIX FOR VERCEL DEPLOYMENT
  // Moved to root level as it is now a stable feature in Next.js 16+
  outputFileTracingIncludes: {
    '/api/claim-art': ['./private/**/*'],
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