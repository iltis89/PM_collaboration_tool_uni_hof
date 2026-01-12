'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'

export async function getDashboardData() {
    const user = await getCurrentUser()
    if (!user) return null

    const upcomingLectures = await prisma.lecture.findMany({
        where: {
            startTime: {
                gte: new Date()
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    })

    const latestNews = await prisma.news.findFirst({
        orderBy: { createdAt: 'desc' }
    })

    return {
        user,
        upcomingLectures,
        latestNews
    }
}
