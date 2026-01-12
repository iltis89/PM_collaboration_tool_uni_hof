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

    return prisma.exam.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { questions: true }
            },
            results: user ? {
                where: { userId: user.id },
                orderBy: { score: 'desc' },
                take: 1
            } : false
        }
    })
}

export async function getExam(examId: string) {
    return prisma.exam.findUnique({
        where: { id: examId },
        include: {
            questions: true
        }
    })
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
