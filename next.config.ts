import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/CulquiPasarela' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/CulquiPasarela/' : '',
};

export default nextConfig;
