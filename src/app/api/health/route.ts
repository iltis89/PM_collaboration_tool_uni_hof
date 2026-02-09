import { prisma } from '@/lib/prisma'

/**
 * Health check endpoint for production monitoring.
 * Returns OK if the app is running and can connect to the database.
 * Does not expose internal metrics to prevent reconnaissance.
 */
export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`

        return Response.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: 'connected',
        })
    } catch {
        return Response.json({
            status: 'error',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
        }, { status: 503 })
    }
}
