import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = global as unknown as { prisma: ReturnType<typeof createPrismaClient> }

function createPrismaClient() {
    const client = new PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'warn', 'error']
            : ['error'],
    })
    return client.$extends(withAccelerate())
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

