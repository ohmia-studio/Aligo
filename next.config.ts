import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['app', 'pages', 'components', 'utils', 'lib'],
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuración experimental para Server Actions con archivos grandes
  experimental: {
    serverActions: {
      bodySizeLimit: '150mb', // Permitir hasta 150MB en Server Actions
    },
  },

  // Configuración para archivos estáticos
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
