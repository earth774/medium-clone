import { PrismaClient } from '../app/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL

  // PostgreSQL: use URL as-is
  if (url?.startsWith('postgresql://') || url?.startsWith('postgres://')) {
    return url
  }

  return url
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: getDatabaseUrl() } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

