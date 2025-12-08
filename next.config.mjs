/** @type {import('next').NextConfig} */
const nextConfig = {
  // The Prisma client is not compatible with the Edge runtime.
  // We need to tell Next.js to use the Node.js runtime for our API routes.
  // https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-monorepo
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
};

export default nextConfig;
