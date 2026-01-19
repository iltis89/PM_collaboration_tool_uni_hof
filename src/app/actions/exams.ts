'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'

async function requireAuth() {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('Nicht authentifiziert')
    }
    return user
}

// ============== EXAMS ==============

export async function getExams() {
    const user = await getCurrentUser()

    // Parallel queries for better performance
    const [exams, passedBlocks] = await Promise.all([
        prisma.exam.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: { select: { questions: true } },
                results: user ? {
                    where: { userId: user.id },
                    orderBy: { score: 'desc' },
                    take: 1
                } : false
            },
            cacheStrategy: { ttl: 30 } // Cache exam list for 30 seconds
        }),
        user ? prisma.examResult.findMany({
            where: {
                userId: user.id,
                passed: true,
                exam: { type: 'TOPIC_BLOCK' }
            },
            select: { examId: true }
        }) : Promise.resolve([])
    ])

    const passedBlockIds = new Set(passedBlocks.map(r => r.examId))

    const topicBlocks = exams.filter(e => e.type === 'TOPIC_BLOCK')
    const allBlocksPassed = topicBlocks.length > 0 && topicBlocks.every(b => passedBlockIds.has(b.id))

    let previousBlockPassed = true
    return exams.map(exam => {
        let isUnlocked: boolean

        if (exam.type === 'MAIN_EXAM') {
            // Hauptprüfung: nur wenn ALLE Themenblöcke bestanden
            isUnlocked = allBlocksPassed
        } else {
            // Themenblock: nur wenn vorheriger bestanden
            isUnlocked = previousBlockPassed
            previousBlockPassed = passedBlockIds.has(exam.id)
        }

        return { ...exam, isUnlocked }
    })
}

export async function getExam(examId: string) {
    const user = await getCurrentUser()

    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: { questions: true }
    })

    if (!exam) return null

    // Zugriffsschutz: Nur wenn freigeschaltet
    if (user) {
        if (exam.type === 'MAIN_EXAM') {
            // Alle Themenblöcke müssen bestanden sein
            const blockCount = await prisma.exam.count({ where: { type: 'TOPIC_BLOCK' } })
            const passedCount = await prisma.examResult.count({
                where: {
                    userId: user.id,
                    passed: true,
                    exam: { type: 'TOPIC_BLOCK' }
                }
            })
            if (passedCount < blockCount) {
                throw new Error('Alle Themenblöcke müssen erst bestanden werden')
            }
        } else if (exam.order > 1) {
            // Vorheriger Block muss bestanden sein
            const prevExam = await prisma.exam.findFirst({
                where: { order: exam.order - 1, type: 'TOPIC_BLOCK' }
            })
            if (prevExam) {
                const prevPassed = await prisma.examResult.findFirst({
                    where: { userId: user.id, examId: prevExam.id, passed: true }
                })
                if (!prevPassed) {
                    throw new Error('Vorheriger Themenblock muss erst bestanden werden')
                }
            }
        }
    }

    return exam
}

export async function submitExam(examId: string, answers: { [questionId: string]: number }) {
    const user = await requireAuth()

    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: { questions: true }
    })

    if (!exam) throw new Error('Exam not found')

    let correctCount = 0
    const totalQuestions = exam.questions.length

    exam.questions.forEach((q: { id: string; correct: number }) => {
        if (answers[q.id] === q.correct) {
            correctCount++
        }
    })

    const score = Math.round((correctCount / totalQuestions) * 100)
    const passed = score >= 50

    if (passed) {
        await prisma.user.update({
            where: { id: user.id },
            data: { xp: { increment: 50 } }
        })
    }

    const result = await prisma.examResult.create({
        data: {
            userId: user.id,
            examId,
            score,
            passed
        }
    })

    return { success: true, result }
}

export async function getExamResults() {
    const user = await requireAuth()
    return prisma.examResult.findMany({
        where: { userId: user.id },
        include: { exam: true },
        orderBy: { completedAt: 'desc' }
    })
}
