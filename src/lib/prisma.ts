import { PrismaClient } from "@/app/generated/prisma-client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"], // tu peux mettre ["query"] si tu veux voir toutes les requêtes
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
