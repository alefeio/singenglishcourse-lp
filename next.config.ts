import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["www.singenglishcourse.com.br"], // Adicione o domínio da imagem
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.singenglishcourse.com.br",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
