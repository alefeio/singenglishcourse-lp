import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Se precisar permitir imagens de algum domínio externo, etc.

  experimental: {
    appDir: true,
    serverActions: true,
  },

  // Adicionando a configuração do middleware
  middleware: {
    '/api/banners': './app/api/banners/middleware.ts', // Configuração do middleware
  },
};

export default nextConfig;
