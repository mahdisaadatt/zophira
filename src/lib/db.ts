import { PrismaClient } from '@prisma/client';

// This setup prevents creating a new PrismaClient instance on every hot reload in development.
// By attaching the client to the globalThis object, we ensure that a single instance is reused.

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

