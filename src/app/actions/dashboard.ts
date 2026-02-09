'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guards'
import { success, error, type ActionResult } from '@/lib/action-result'
import { translatePrismaError } from '@/lib/prisma-errors'

interface DashboardData {
    user: NonNullable<Awaited<ReturnType<typeof requireAuth>>>
    upcomingLectures: {
        id: string
        title: string
        startTime: Date
        room: string | null
        professor: string | null
    }[]
    latestNews: {
        id: string
        title: string
        content: string
        createdAt: Date
    } | null
}

export async function getDashboardData(): Promise<ActionResult<DashboardData>> {
    try {
        const user = await requireAuth()

        const now = new Date()
        const [upcomingLectures, latestNews] = await Promise.all([
            prisma.lecture.findMany({
                where: {
                    startTime: {
                        gte: now
                    }
                },
                orderBy: {
                    startTime: 'asc'
                },
                select: {
                    id: true,
                    title: true,
                    startTime: true,
                    room: true,
                    professor: true,
                }
            }),
            prisma.news.findFirst({
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                }
            })
        ])

        return success({
            user,
            upcomingLectures,
            latestNews
        })
    } catch (err) {
        return error(translatePrismaError(err), 'INTERNAL')
    }
}
