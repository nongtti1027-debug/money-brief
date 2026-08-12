import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // For Turso, DATABASE_URL should be the full libsql:// URL with the auth
  // token embedded as a query param (?authToken=...) — see README.md. This
  // keeps a single source of truth that both the app and the Prisma CLI
  // (migrate/seed, which only read prisma.config.ts's datasource.url) can use.
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
