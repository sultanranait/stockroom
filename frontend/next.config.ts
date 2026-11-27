import type { NextConfig } from 'next';

const authServiceUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:4001';
const productServiceUrl =
  process.env.PRODUCT_SERVICE_URL ?? 'http://localhost:4002';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Proxy API calls so the browser talks to a single origin and the
  // session cookie stays first-party
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${authServiceUrl}/api/auth/:path*`,
      },
      {
        source: '/api/products/:path*',
        destination: `${productServiceUrl}/api/products/:path*`,
      },
    ];
  },
};

export default nextConfig;
