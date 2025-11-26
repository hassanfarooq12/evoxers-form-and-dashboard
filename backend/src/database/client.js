import { PrismaClient } from '@prisma/client';

// Prisma Client with connection pooling for serverless environments
// In serverless (Vercel), we need to reuse connections across function invocations
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Cache Prisma client in global scope for serverless (works in both dev and production on Vercel)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}


