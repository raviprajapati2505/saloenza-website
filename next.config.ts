import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/why-glowsuite',
        destination: '/why-saloenza',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
