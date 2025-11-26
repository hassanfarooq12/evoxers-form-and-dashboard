import { PrismaClient } from '@prisma/client';

// Prisma Client with connection pooling for serverless environments
// In serverless (Vercel), we need to reuse connections across function invocations
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}


