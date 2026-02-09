import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockPrisma, mockGetCurrentUser } = vi.hoisted(() => ({
    mockPrisma: {
        material: { findMany: vi.fn(), create: vi.fn(), delete: vi.fn() },
        curriculumTopic: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
        news: { findMany: vi.fn(), create: vi.fn(), delete: vi.fn() },
        newsReaction: { findMany: vi.fn(), upsert: vi.fn(), deleteMany: vi.fn() },
        audioSnippet: { findMany: vi.fn(), create: vi.fn(), delete: vi.fn() },
        lecture: { findMany: vi.fn(), create: vi.fn(), delete: vi.fn() },
    },
    mockGetCurrentUser: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))
vi.mock('./auth', () => ({ getCurrentUser: mockGetCurrentUser }))

import {
    getMaterials, createMaterial, deleteMaterial,
    getCurriculumTopics, createCurriculumTopic,
    getNews, createNews, deleteNews,
    getNewsReactions, addNewsReaction, removeNewsReaction,
    getAudioSnippets, createAudioSnippet,
    getLectures, createLecture, deleteLecture,
} from './content'

const adminUser = { id: 'admin-1', email: 'admin@test.com', name: 'Admin', role: 'ADMIN' }
const studentUser = { id: 'user-1', email: 'student@test.com', name: 'Student', role: 'STUDENT' }

describe('content actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetCurrentUser.mockResolvedValue(adminUser)
    })

    // ---- MATERIALS ----

    describe('getMaterials', () => {
        it('returns all materials', async () => {
            mockPrisma.material.findMany.mockResolvedValue([{ id: 'm1', title: 'Slides' }])
            const result = await getMaterials()
            expect(result).toHaveLength(1)
        })
    })

    describe('createMaterial', () => {
        it('rejects non-admin', async () => {
            mockGetCurrentUser.mockResolvedValue(studentUser)
            const result = await createMaterial({ title: 'Test' })
            expect(result.success).toBe(false)
        })

        it('creates material with valid data', async () => {
            mockPrisma.material.create.mockResolvedValue({ id: 'm1', title: 'Slides' })
            const result = await createMaterial({ title: 'Slides' })
            expect(result.success).toBe(true)
        })

        it('rejects empty title', async () => {
            const result = await createMaterial({ title: '' })
            expect(result.success).toBe(false)
        })
    })

    // ---- CURRICULUM ----

    describe('getCurriculumTopics', () => {
        it('returns topics ordered by order', async () => {
            mockPrisma.curriculumTopic.findMany.mockResolvedValue([])
            const result = await getCurriculumTopics()
            expect(result).toEqual([])
        })
    })

    describe('createCurriculumTopic', () => {
        it('creates topic with valid data', async () => {
            mockPrisma.curriculumTopic.create.mockResolvedValue({ id: 'c1', title: 'Module 1', order: 1 })
            const result = await createCurriculumTopic({ title: 'Module 1', order: 1, status: 'UPCOMING' })
            expect(result.success).toBe(true)
        })

        it('rejects invalid status', async () => {
            const result = await createCurriculumTopic({ title: 'Module', order: 1, status: 'INVALID' })
            expect(result.success).toBe(false)
        })
    })

    // ---- NEWS ----

    describe('getNews', () => {
        it('returns news list', async () => {
            mockPrisma.news.findMany.mockResolvedValue([])
            const result = await getNews()
            expect(result).toEqual([])
        })
    })

    describe('createNews', () => {
        it('creates news with valid data', async () => {
            mockPrisma.news.create.mockResolvedValue({ id: 'n1', title: 'Update', content: 'Content' })
            const result = await createNews({ title: 'Update', content: 'Content' })
            expect(result.success).toBe(true)
        })
    })

    describe('deleteNews', () => {
        it('deletes news by ID', async () => {
            mockPrisma.news.delete.mockResolvedValue({ id: 'clr1234567890abcdefghijkl' })
            const result = await deleteNews('clr1234567890abcdefghijkl')
            expect(result.success).toBe(true)
        })
    })

    // ---- REACTIONS ----

    describe('getNewsReactions', () => {
        it('requires authentication', async () => {
            mockGetCurrentUser.mockResolvedValue(null)
            await expect(getNewsReactions('clr1234567890abcdefghijkl')).rejects.toThrow()
        })

        it('returns reactions for valid ID', async () => {
            mockGetCurrentUser.mockResolvedValue(studentUser)
            mockPrisma.newsReaction.findMany.mockResolvedValue([{ emoji: '👍', userId: 'u1' }])
            const result = await getNewsReactions('clr1234567890abcdefghijkl')
            expect(result).toHaveLength(1)
        })
    })

    describe('addNewsReaction', () => {
        it('upserts reaction', async () => {
            mockGetCurrentUser.mockResolvedValue(studentUser)
            mockPrisma.newsReaction.upsert.mockResolvedValue({ emoji: '👍' })
            const result = await addNewsReaction('clr1234567890abcdefghijkl', '👍')
            expect(result.success).toBe(true)
        })
    })

    describe('removeNewsReaction', () => {
        it('removes reaction', async () => {
            mockGetCurrentUser.mockResolvedValue(studentUser)
            mockPrisma.newsReaction.deleteMany.mockResolvedValue({ count: 1 })
            const result = await removeNewsReaction('clr1234567890abcdefghijkl')
            expect(result.success).toBe(true)
        })
    })

    // ---- AUDIO ----

    describe('createAudioSnippet', () => {
        it('creates snippet with valid data', async () => {
            mockPrisma.audioSnippet.create.mockResolvedValue({ id: 'a1', title: 'Audio', url: 'https://example.com/a.mp3' })
            const result = await createAudioSnippet({ title: 'Audio', url: 'https://example.com/a.mp3' })
            expect(result.success).toBe(true)
        })

        it('rejects negative duration', async () => {
            const result = await createAudioSnippet({ title: 'Audio', url: 'https://example.com/a.mp3', duration: -5 })
            expect(result.success).toBe(false)
        })
    })

    // ---- LECTURES ----

    describe('createLecture', () => {
        it('creates lecture with valid data', async () => {
            mockPrisma.lecture.create.mockResolvedValue({ id: 'l1', title: 'PM Basics' })
            const result = await createLecture({
                title: 'PM Basics',
                startTime: '2026-03-01T09:00:00Z',
                endTime: '2026-03-01T10:30:00Z',
            })
            expect(result.success).toBe(true)
        })

        it('rejects endTime before startTime', async () => {
            const result = await createLecture({
                title: 'PM Basics',
                startTime: '2026-03-01T10:00:00Z',
                endTime: '2026-03-01T09:00:00Z',
            })
            expect(result.success).toBe(false)
        })
    })

    describe('deleteLecture', () => {
        it('deletes lecture by ID', async () => {
            mockPrisma.lecture.delete.mockResolvedValue({ id: 'clr1234567890abcdefghijkl' })
            const result = await deleteLecture('clr1234567890abcdefghijkl')
            expect(result.success).toBe(true)
        })
    })
})
