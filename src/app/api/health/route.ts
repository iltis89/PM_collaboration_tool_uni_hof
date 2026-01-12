import { prisma } from '@/lib/prisma'

/**
 * Health check endpoint for production monitoring.
 * Returns OK if the app is running and can connect to the database.
 */
export async function GET() {
    const startTime = Date.now()

    try {
        // Test database connectivity
        await prisma.$queryRaw`SELECT 1`

        return Response.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'connected',
            responseTime: Date.now() - startTime
        })
    } catch (error) {
        console.error('Health check failed:', error)
        return Response.json({
            status: 'error',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 503 })
    }
}
