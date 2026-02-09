import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockPrisma, mockGetCurrentUser } = vi.hoisted(() => ({
    mockPrisma: {
        exam: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            count: vi.fn(),
            findFirst: vi.fn(),
        },
        examResult: {
            findMany: vi.fn(),
            count: vi.fn(),
            findFirst: vi.fn(),
        },
        user: {
            update: vi.fn(),
        },
        $transaction: vi.fn(),
    },
    mockGetCurrentUser: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
    prisma: mockPrisma,
}))

vi.mock('./auth', () => ({
    getCurrentUser: mockGetCurrentUser,
}))

import { getExam, getExams, submitExam } from './exams'

describe('exams actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetCurrentUser.mockResolvedValue({
            id: 'user-1',
            email: 'student@example.com',
            name: 'Student',
            role: 'STUDENT',
        })
    })

    it('rejects unauthenticated access to exam list', async () => {
        mockGetCurrentUser.mockResolvedValueOnce(null)

        await expect(getExams()).rejects.toThrow('Nicht authentifiziert')
    })

    it('blocks locked main exam access', async () => {
        mockPrisma.exam.findUnique.mockResolvedValueOnce({
            id: 'main-exam',
            type: 'MAIN_EXAM',
            order: 99,
            questions: [],
        })
        mockPrisma.exam.count.mockResolvedValueOnce(3)
        mockPrisma.examResult.count.mockResolvedValueOnce(2)

        const result = await getExam('clr1234567890abcdefghijkl')

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error).toBe('Alle Themenblöcke müssen erst bestanden werden')
            expect(result.code).toBe('FORBIDDEN')
        }
    })

    it('returns NOT_FOUND for missing exam', async () => {
        mockPrisma.exam.findUnique.mockResolvedValueOnce(null)

        const result = await getExam('clr1234567890abcdefghijkl')

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error).toBe('Prüfung nicht gefunden')
            expect(result.code).toBe('NOT_FOUND')
        }
    })

    it('awards XP only once for a passed exam', async () => {
        mockPrisma.exam.findUnique.mockResolvedValueOnce({
            id: 'topic-1',
            type: 'TOPIC_BLOCK',
            order: 1,
            questions: [
                { id: 'q1', correct: 0 },
                { id: 'q2', correct: 1 },
            ],
        })

        const txExamResultFindFirst = vi.fn().mockResolvedValue({ id: 'existing-pass' })
        const txExamResultCreate = vi.fn().mockResolvedValue({ id: 'new-result', score: 100, passed: true })
        const txUserUpdate = vi.fn()

        mockPrisma.$transaction.mockImplementationOnce(async (callback: (tx: {
            examResult: {
                findFirst: typeof txExamResultFindFirst
                create: typeof txExamResultCreate
            }
            user: {
                update: typeof txUserUpdate
            }
        }) => Promise<unknown>) => callback({
            examResult: {
                findFirst: txExamResultFindFirst,
                create: txExamResultCreate,
            },
            user: {
                update: txUserUpdate,
            },
        }))

        const result = await submitExam('clr1234567890abcdefghijkl', { q1: 0, q2: 1 })

        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.xpAwarded).toBe(false)
        }
        expect(txUserUpdate).not.toHaveBeenCalled()
        expect(txExamResultCreate).toHaveBeenCalledTimes(1)
    })

    it('awards XP on first successful pass', async () => {
        mockPrisma.exam.findUnique.mockResolvedValueOnce({
            id: 'topic-1',
            type: 'TOPIC_BLOCK',
            order: 1,
            questions: [{ id: 'q1', correct: 0 }],
        })

        const txExamResultFindFirst = vi.fn().mockResolvedValue(null)
        const txExamResultCreate = vi.fn().mockResolvedValue({ id: 'new-result', score: 100, passed: true })
        const txUserUpdate = vi.fn().mockResolvedValue({ id: 'user-1' })

        mockPrisma.$transaction.mockImplementationOnce(async (callback: (tx: {
            examResult: {
                findFirst: typeof txExamResultFindFirst
                create: typeof txExamResultCreate
            }
            user: {
                update: typeof txUserUpdate
            }
        }) => Promise<unknown>) => callback({
            examResult: {
                findFirst: txExamResultFindFirst,
                create: txExamResultCreate,
            },
            user: {
                update: txUserUpdate,
            },
        }))

        const result = await submitExam('clr1234567890abcdefghijkl', { q1: 0 })

        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.xpAwarded).toBe(true)
        }
        expect(txUserUpdate).toHaveBeenCalledTimes(1)
    })

    it('returns error for exams without questions', async () => {
        mockPrisma.exam.findUnique.mockResolvedValueOnce({
            id: 'topic-empty',
            type: 'TOPIC_BLOCK',
            order: 1,
            questions: [],
        })

        // calculateExamScore throws for 0 questions, which gets caught by the try/catch
        const result = await submitExam('clr1234567890abcdefghijkl', {})

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error).toBe('Exam has no questions')
        }
    })

    it('rejects invalid examId format', async () => {
        const result = await submitExam('not-a-valid-id', { q1: 0 })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error).toContain('Ungültige')
        }
    })
})
