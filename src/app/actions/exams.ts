'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guards'
import { success, error, type ActionResult } from '@/lib/action-result'
import { translatePrismaError } from '@/lib/prisma-errors'
import { idSchema, validateInput } from '@/lib/validation'
import { calculateExamScore } from '@/lib/exam-scoring'
import { z } from 'zod'

const submitExamSchema = z.object({
    examId: z.string().cuid('Ungültige Exam-ID'),
    answers: z.record(z.string(), z.number()),
})

async function assertExamUnlocked(userId: string, exam: { id: string; type: 'TOPIC_BLOCK' | 'MAIN_EXAM'; order: number }): Promise<string | null> {
    if (exam.type === 'MAIN_EXAM') {
        const blockCount = await prisma.exam.count({ where: { type: 'TOPIC_BLOCK' } })
        const passedCount = await prisma.examResult.count({
            where: {
                userId,
                passed: true,
                exam: { type: 'TOPIC_BLOCK' }
            }
        })

        if (passedCount < blockCount) {
            return 'Alle Themenblöcke müssen erst bestanden werden'
        }
        return null
    }

    if (exam.order <= 1) {
        return null
    }

    const prevExam = await prisma.exam.findFirst({
        where: { order: exam.order - 1, type: 'TOPIC_BLOCK' }
    })

    if (!prevExam) {
        return null
    }

    const prevPassed = await prisma.examResult.findFirst({
        where: { userId, examId: prevExam.id, passed: true }
    })

    if (!prevPassed) {
        return 'Vorheriger Themenblock muss erst bestanden werden'
    }

    return null
}

// ============== EXAMS ==============

export async function getExams(): Promise<ActionResult<ReturnType<typeof mapExams>>> {
    try {
        const user = await requireAuth()

        // Parallel queries for better performance
        const [exams, passedBlocks] = await Promise.all([
            prisma.exam.findMany({
                orderBy: { order: 'asc' },
                include: {
                    _count: { select: { questions: true } },
                    results: {
                        where: { userId: user.id },
                        orderBy: { score: 'desc' },
                        take: 1
                    }
                },
                cacheStrategy: { ttl: 30 } // Cache exam list for 30 seconds
            }),
            prisma.examResult.findMany({
                where: {
                    userId: user.id,
                    passed: true,
                    exam: { type: 'TOPIC_BLOCK' }
                },
                select: { examId: true }
            })
        ])

        const passedBlockIds = new Set(passedBlocks.map(r => r.examId))

        const topicBlocks = exams.filter(e => e.type === 'TOPIC_BLOCK')
        const allBlocksPassed = topicBlocks.length > 0 && topicBlocks.every(b => passedBlockIds.has(b.id))

        let previousBlockPassed = true
        const mapped = exams.map(exam => {
            let isUnlocked: boolean

            if (exam.type === 'MAIN_EXAM') {
                isUnlocked = allBlocksPassed
            } else {
                isUnlocked = previousBlockPassed
                previousBlockPassed = passedBlockIds.has(exam.id)
            }

            return { ...exam, isUnlocked }
        })

        return success(mapped)
    } catch (err) {
        return error(translatePrismaError(err), 'INTERNAL')
    }
}

// Helper type for getExams return type inference
type ExamWithUnlock = Awaited<ReturnType<typeof prisma.exam.findMany>> extends (infer U)[] ? (U & { isUnlocked: boolean })[] : never
function mapExams(): ExamWithUnlock { throw new Error('type-only') }

export async function getExam(examId: unknown): Promise<ActionResult<Awaited<ReturnType<typeof prisma.exam.findUnique>>>> {
    try {
        const user = await requireAuth()
        const validatedId = validateInput(idSchema, examId)

        const exam = await prisma.exam.findUnique({
            where: { id: validatedId },
            include: { questions: true }
        })

        if (!exam) {
            return error('Prüfung nicht gefunden', 'NOT_FOUND')
        }

        const lockMessage = await assertExamUnlocked(user.id, exam)
        if (lockMessage) {
            return error(lockMessage, 'FORBIDDEN')
        }

        return success(exam)
    } catch (err) {
        return error(translatePrismaError(err), 'INTERNAL')
    }
}

export async function submitExam(examId: unknown, answers: unknown): Promise<ActionResult<{ result: Awaited<ReturnType<typeof prisma.examResult.create>>; xpAwarded: boolean }>> {
    try {
        const user = await requireAuth()
        const validated = validateInput(submitExamSchema, { examId, answers })

        const exam = await prisma.exam.findUnique({
            where: { id: validated.examId },
            include: { questions: true }
        })

        if (!exam) {
            return error('Prüfung nicht gefunden', 'NOT_FOUND')
        }

        const lockMessage = await assertExamUnlocked(user.id, exam)
        if (lockMessage) {
            return error(lockMessage, 'FORBIDDEN')
        }

        const { score, passed } = calculateExamScore({
            questions: exam.questions,
            answers: validated.answers,
        })

        const { result, xpAwarded } = await prisma.$transaction(async (tx) => {
            let shouldAwardXp = false

            if (passed) {
                const alreadyPassed = await tx.examResult.findFirst({
                    where: {
                        userId: user.id,
                        examId: validated.examId,
                        passed: true
                    },
                    select: { id: true }
                })

                if (!alreadyPassed) {
                    shouldAwardXp = true
                    await tx.user.update({
                        where: { id: user.id },
                        data: { xp: { increment: 50 } }
                    })
                }
            }

            const createdResult = await tx.examResult.create({
                data: {
                    userId: user.id,
                    examId: validated.examId,
                    score,
                    passed
                }
            })

            return { result: createdResult, xpAwarded: shouldAwardXp }
        })

        return success({ result, xpAwarded })
    } catch (err) {
        return error(translatePrismaError(err), 'INTERNAL')
    }
}

export async function getExamResults(): Promise<ActionResult<Awaited<ReturnType<typeof prisma.examResult.findMany>>>> {
    try {
        const user = await requireAuth()
        const results = await prisma.examResult.findMany({
            where: { userId: user.id },
            include: { exam: true },
            orderBy: { completedAt: 'desc' }
        })
        return success(results)
    } catch (err) {
        return error(translatePrismaError(err), 'INTERNAL')
    }
}
