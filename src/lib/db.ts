import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Ensure user exists in database from Authentik headers
 * This is called on authentication to auto-create users
 */
export async function ensureUser(id: string, email: string, name: string) {
  return await prisma.user.upsert({
    where: { id },
    update: { email, name },
    create: { id, email, name },
  });
}
