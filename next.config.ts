import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configuração para tratar arquivos de mídia corretamente
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm)$/,
      type: 'asset',
      generator: {
        filename: 'static/media/[hash][ext]'
      },
    });

    return config;
  },
  images: {
    // Domínios externos permitidos para imagens (caso necessário)
    // domains: ['example.com'],
    // Tamanhos de imagens disponíveis para otimização
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};

export default nextConfig;
