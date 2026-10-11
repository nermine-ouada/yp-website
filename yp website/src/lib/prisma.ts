import { PrismaClient } from "@prisma/client";

// Next.js hot-reloads modules in dev, which would otherwise spin up a fresh
// PrismaClient (and a fresh pool of DB connections) on every edit. Stash the
// instance on the global object so dev reuses it; production just makes one.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
