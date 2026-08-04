import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['next-sanity', 'sanity'],
  async redirects() {
    return [
      {
        source:      '/menu',
        destination: '/catering',
        permanent:   true,
      },
    ];
  },
};

export default nextConfig;
