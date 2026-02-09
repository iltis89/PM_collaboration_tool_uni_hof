import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockPrisma, mockGetCurrentUser } = vi.hoisted(() => ({
    mockPrisma: {
        thread: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        message: {
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            findUnique: vi.fn(),
        },
        courseChatMessage: {
            findMany: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            findUnique: vi.fn(),
        },
    },
    mockGetCurrentUser: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))
vi.mock('./auth', () => ({ getCurrentUser: mockGetCurrentUser }))

import {
    getThreads, getThread, createThread, updateThread, deleteThread,
    createMessage, updateMessage, deleteMessage,
    getCourseMessages, sendCourseMessage, updateCourseMessage, deleteCourseMessage,
} from './collaboration'

const user = { id: 'user-1', email: 'test@example.com', name: 'Test', role: 'STUDENT' }

describe('collaboration actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetCurrentUser.mockResolvedValue(user)
    })

    // ---- THREADS ----

    describe('getThreads', () => {
        it('requires authentication', async () => {
            mockGetCurrentUser.mockResolvedValue(null)
            await expect(getThreads()).rejects.toThrow()
        })

        it('returns threads list', async () => {
            mockPrisma.thread.findMany.mockResolvedValue([{ id: 't1', title: 'Help' }])
            const result = await getThreads()
            expect(result).toHaveLength(1)
        })
    })

    describe('getThread', () => {
        it('requires authentication', async () => {
            mockGetCurrentUser.mockResolvedValue(null)
            await expect(getThread('clr1234567890abcdefghijkl')).rejects.toThrow()
        })

        it('returns thread with messages', async () => {
            mockPrisma.thread.findUnique.mockResolvedValue({ id: 't1', messages: [] })
            const result = await getThread('clr1234567890abcdefghijkl')
            expect(result).toBeDefined()
        })
    })

    describe('createThread', () => {
        it('creates thread for authenticated user', async () => {
            mockPrisma.thread.create.mockResolvedValue({ id: 't1', title: 'Question' })
            const result = await createThread({ title: 'Question', content: 'How does XP work?' })
            expect(result.success).toBe(true)
        })

        it('rejects empty title', async () => {
            const result = await createThread({ title: '', content: 'text' })
            expect(result.success).toBe(false)
        })
    })

    describe('updateThread', () => {
        it('allows author to update', async () => {
            mockPrisma.thread.findUnique.mockResolvedValue({ id: 't1', authorId: 'user-1' })
            mockPrisma.thread.update.mockResolvedValue({ id: 't1', title: 'Updated' })
            const result = await updateThread('clr1234567890abcdefghijkl', { title: 'Updated', content: 'new content' })
            expect(result.success).toBe(true)
        })

        it('rejects non-author updates', async () => {
            mockPrisma.thread.findUnique.mockResolvedValue({ id: 't1', authorId: 'other-user' })
            const result = await updateThread('clr1234567890abcdefghijkl', { title: 'Updated', content: 'content' })
            expect(result.success).toBe(false)
            if (!result.success) expect(result.code).toBe('FORBIDDEN')
        })
    })

    describe('deleteThread', () => {
        it('allows author to delete', async () => {
            mockPrisma.thread.findUnique.mockResolvedValue({ id: 't1', authorId: 'user-1' })
            mockPrisma.thread.delete.mockResolvedValue({ id: 't1' })
            const result = await deleteThread('clr1234567890abcdefghijkl')
            expect(result.success).toBe(true)
        })
    })

    // ---- MESSAGES ----

    describe('createMessage', () => {
        it('creates message in thread', async () => {
            mockPrisma.message.create.mockResolvedValue({ id: 'm1', content: 'Reply' })
            const result = await createMessage('clr1234567890abcdefghijkl', { content: 'Reply here' })
            expect(result.success).toBe(true)
        })
    })

    describe('updateMessage', () => {
        it('allows author to update message', async () => {
            mockPrisma.message.findUnique.mockResolvedValue({ id: 'm1', authorId: 'user-1' })
            mockPrisma.message.update.mockResolvedValue({ id: 'm1', content: 'edited' })
            const result = await updateMessage('clr1234567890abcdefghijkl', { content: 'edited reply' })
            expect(result.success).toBe(true)
        })

        it('rejects non-author message updates', async () => {
            mockPrisma.message.findUnique.mockResolvedValue({ id: 'm1', authorId: 'other' })
            const result = await updateMessage('clr1234567890abcdefghijkl', { content: 'edited' })
            expect(result.success).toBe(false)
        })
    })

    // ---- COURSE CHAT ----

    describe('getCourseMessages', () => {
        it('requires authentication', async () => {
            mockGetCurrentUser.mockResolvedValue(null)
            await expect(getCourseMessages()).rejects.toThrow()
        })

        it('returns course messages', async () => {
            mockPrisma.courseChatMessage.findMany.mockResolvedValue([{ id: 'cm1', content: 'Hi' }])
            const result = await getCourseMessages()
            expect(result).toHaveLength(1)
        })
    })

    describe('sendCourseMessage', () => {
        it('sends a message', async () => {
            mockPrisma.courseChatMessage.create.mockResolvedValue({ id: 'cm1', content: 'Hello' })
            const result = await sendCourseMessage({ content: 'Hello' })
            expect(result.success).toBe(true)
        })

        it('rejects empty message', async () => {
            const result = await sendCourseMessage({ content: '' })
            expect(result.success).toBe(false)
        })

        it('rejects message over 2000 chars', async () => {
            const result = await sendCourseMessage({ content: 'x'.repeat(2001) })
            expect(result.success).toBe(false)
        })
    })

    describe('deleteCourseMessage', () => {
        it('allows author to delete', async () => {
            mockPrisma.courseChatMessage.findUnique.mockResolvedValue({ id: 'cm1', authorId: 'user-1' })
            mockPrisma.courseChatMessage.delete.mockResolvedValue({ id: 'cm1' })
            const result = await deleteCourseMessage('clr1234567890abcdefghijkl')
            expect(result.success).toBe(true)
        })
    })
})
