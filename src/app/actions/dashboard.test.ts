import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockPrisma, mockGetCurrentUser } = vi.hoisted(() => ({
    mockPrisma: {
        lecture: { findMany: vi.fn() },
        news: { findFirst: vi.fn() },
    },
    mockGetCurrentUser: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))
vi.mock('./auth', () => ({ getCurrentUser: mockGetCurrentUser }))

import { getDashboardData } from './dashboard'

describe('dashboard actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns error for unauthenticated user', async () => {
        mockGetCurrentUser.mockResolvedValue(null)
        const result = await getDashboardData()
        expect(result.success).toBe(false)
    })

    it('returns dashboard data for authenticated user', async () => {
        mockGetCurrentUser.mockResolvedValue({
            id: 'u1', email: 'test@test.com', name: 'Test', role: 'STUDENT',
            xp: 120, level: 2, streak: 5,
        })
        mockPrisma.lecture.findMany.mockResolvedValue([
            { id: 'l1', title: 'PM Basics', startTime: new Date('2026-03-01'), room: 'A101', professor: 'Prof. X' },
        ])
        mockPrisma.news.findFirst.mockResolvedValue({
            id: 'n1', title: 'Welcome', content: 'Hello!', createdAt: new Date(),
        })

        const result = await getDashboardData()
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.user.id).toBe('u1')
            expect(result.data.upcomingLectures).toHaveLength(1)
            expect(result.data.latestNews).toBeDefined()
        }
    })

    it('handles empty data gracefully', async () => {
        mockGetCurrentUser.mockResolvedValue({
            id: 'u1', email: 'test@test.com', name: 'Test', role: 'STUDENT',
            xp: 0, level: 1, streak: 0,
        })
        mockPrisma.lecture.findMany.mockResolvedValue([])
        mockPrisma.news.findFirst.mockResolvedValue(null)

        const result = await getDashboardData()
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.upcomingLectures).toHaveLength(0)
            expect(result.data.latestNews).toBeNull()
        }
    })
})
