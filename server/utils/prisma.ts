import { PrismaClient } from '@prisma/client';

// add this so typescript doesn't yell at me :(
const globalForPrisma = globalThis as unknown as { prisma? : PrismaClient };

// creates prisma client if it doesn't exist
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
