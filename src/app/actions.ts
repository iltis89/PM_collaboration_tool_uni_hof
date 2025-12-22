'use server'

import { prisma } from '@/lib/prisma'
import { compare, hash } from 'bcryptjs'
import { cookies } from 'next/headers'

// ============== AUTH ==============

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        return { success: false, error: 'Benutzer nicht gefunden' }
    }

    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
        return { success: false, error: 'Falsches Passwort' }
    }

    // Set a simple cookie for session
    const cookieStore = await cookies()
    const isProduction = process.env.NODE_ENV === 'production'
    cookieStore.set('userId', user.id, { httpOnly: true, secure: isProduction })
    cookieStore.set('userRole', user.role, { httpOnly: true, secure: isProduction })

    return {
        success: true,
        user: { id: user.id, name: user.name, role: user.role },
        requirePasswordChange: user.mustChangePassword
    }
}

export async function changePassword(newPassword: string) {
    const user = await requireAuth()

    const hashedPassword = await hash(newPassword, 12)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            mustChangePassword: false
        }
    })

    return { success: true }
}

// Demo login removed per user request

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('userId')
    cookieStore.delete('userRole')
    return { success: true }
}

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return null

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true, xp: true, level: true, streak: true, privacyAccepted: true },
    })

    return user
}

// ============== USERS (Admin) ==============

export async function getUsers() {
    await requireAdmin()
    return prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, xp: true, level: true, createdAt: true, privacyAccepted: true, privacyAcceptedAt: true },
        orderBy: { createdAt: 'desc' },
    })
}

export async function getAdminStats() {
    await requireAdmin()
    const userCount = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalExams = await prisma.examResult.count();
    const passedExams = await prisma.examResult.count({ where: { passed: true } });
    const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;

    // Top students
    const topStudents = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        orderBy: { xp: 'desc' },
        take: 5,
        select: { id: true, name: true, xp: true, level: true }
    });

    return {
        userCount,
        totalExams,
        passRate,
        topStudents
    };
}

export async function createUser(data: { email: string; name: string; password: string; role?: 'STUDENT' | 'ADMIN' }) {
    await requireAdmin()
    const hashedPassword = await hash(data.password, 12)
    return prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            password: hashedPassword,
            role: data.role || 'STUDENT',
        },
    })
}

export async function acceptPrivacy() {
    const user = await requireAuth()

    return prisma.user.update({
        where: { id: user.id },
        data: {
            privacyAccepted: true,
            privacyAcceptedAt: new Date()
        }
    })
}

export async function deleteUser(id: string) {
    await requireAdmin()
    return prisma.user.delete({ where: { id } })
}

// ============== MATERIALS ==============

export async function getMaterials() {
    return prisma.material.findMany({
        orderBy: { uploadedAt: 'desc' },
        include: { topic: true }
    })
}

export async function createMaterial(data: { title: string; description?: string; fileUrl?: string; size?: string; topicId?: string }) {
    await requireAdmin()
    return prisma.material.create({ data })
}

export async function deleteMaterial(id: string) {
    await requireAdmin()
    return prisma.material.delete({ where: { id } })
}

// ============== CURRICULUM ==============

export async function getCurriculumTopics() {
    return prisma.curriculumTopic.findMany({
        orderBy: { order: 'asc' },
        include: { materials: true }
    })
}

export async function createCurriculumTopic(data: { title: string; description?: string; order: number; date?: Date; status?: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' }) {
    await requireAdmin()
    return prisma.curriculumTopic.create({ data })
}

export async function updateCurriculumTopic(id: string, data: { title?: string; description?: string; order?: number; date?: Date; status?: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' }) {
    await requireAdmin()
    return prisma.curriculumTopic.update({
        where: { id },
        data
    })
}

export async function deleteCurriculumTopic(id: string) {
    await requireAdmin()
    return prisma.curriculumTopic.delete({ where: { id } })
}

// ============== NEWS ==============

export async function getNews() {
    return prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export async function createNews(data: { title: string; content: string; author?: string }) {
    await requireAdmin()
    return prisma.news.create({ data })
}

export async function deleteNews(id: string) {
    await requireAdmin()
    return prisma.news.delete({ where: { id } })
}

export async function getNewsReactions(newsId: string) {
    return prisma.newsReaction.findMany({
        where: { newsId },
        select: { emoji: true, userId: true }
    })
}

export async function addNewsReaction(newsId: string, emoji: string) {
    const user = await requireAuth()

    // Upsert: update if exists, create if not
    return prisma.newsReaction.upsert({
        where: {
            newsId_userId: { newsId, userId: user.id }
        },
        update: { emoji },
        create: { newsId, userId: user.id, emoji }
    })
}

export async function removeNewsReaction(newsId: string) {
    const user = await requireAuth()

    return prisma.newsReaction.deleteMany({
        where: { newsId, userId: user.id }
    })
}

// ============== QUIZ ==============

export async function getQuizQuestions() {
    return prisma.quizQuestion.findMany()
}

export async function submitQuizAnswer(userId: string, questionId: string, isCorrect: boolean) {
    if (isCorrect) {
        // Award XP for correct answer
        await prisma.user.update({
            where: { id: userId },
            data: { xp: { increment: 10 } },
        })
    }

    // Record progress
    return prisma.progress.create({
        data: {
            userId,
            quizId: questionId,
            completed: true,
            score: isCorrect ? 10 : 0,
            completedAt: new Date(),
        },
    })
}

// ============== COLLABORATION (Secure) ==============

async function requireAuth() {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('Nicht authentifiziert')
    }
    return user
}

async function requireAdmin() {
    const user = await requireAuth()
    if (user.role !== 'ADMIN') {
        throw new Error('Keine Admin-Berechtigung')
    }
    return user
}

export async function getThreads() {
    return prisma.thread.findMany({
        include: {
            author: { select: { id: true, name: true } },
            _count: { select: { messages: true } },
        },
        orderBy: { createdAt: 'desc' },
    })
}

export async function getThread(threadId: string) {
    return prisma.thread.findUnique({
        where: { id: threadId },
        include: {
            author: { select: { id: true, name: true } },
            messages: {
                include: { author: { select: { id: true, name: true } } },
                orderBy: { createdAt: 'asc' },
            },
        },
    })
}

export async function createThread(data: { title: string; content: string }) {
    const user = await requireAuth()

    return prisma.thread.create({
        data: {
            title: data.title,
            content: data.content,
            authorId: user.id,
        },
    })
}

export async function updateThread(threadId: string, data: { title: string; content: string }) {
    const user = await requireAuth()

    const thread = await prisma.thread.findUnique({ where: { id: threadId } })
    if (!thread) throw new Error('Thread nicht gefunden')

    if (thread.authorId !== user.id && user.role !== 'ADMIN') {
        throw new Error('Keine Berechtigung')
    }

    return prisma.thread.update({
        where: { id: threadId },
        data: {
            title: data.title,
            content: data.content,
        }
    })
}

export async function createMessage(threadId: string, content: string) {
    const user = await requireAuth()

    // Verify thread exists
    const thread = await prisma.thread.findUnique({ where: { id: threadId } })
    if (!thread) {
        throw new Error('Thread nicht gefunden')
    }

    return prisma.message.create({
        data: {
            content,
            threadId,
            authorId: user.id,
        },
    })
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
    const passed = score >= 50 // Pass mark 50%

    // Award XP if passed
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

// ============== COLLABORATION (Secure) ==============
// ... existing collaboration functions are good, verifying usage ...

export async function deleteThread(threadId: string) {
    const user = await requireAuth()

    // Only author or admin can delete
    const thread = await prisma.thread.findUnique({ where: { id: threadId } })
    if (!thread) {
        throw new Error('Thread nicht gefunden')
    }

    if (thread.authorId !== user.id && user.role !== 'ADMIN') {
        throw new Error('Keine Berechtigung')
    }

    return prisma.thread.delete({ where: { id: threadId } })
}

export async function deleteMessage(messageId: string) {
    const user = await requireAuth()

    const message = await prisma.message.findUnique({ where: { id: messageId } })
    if (!message) throw new Error('Nachricht nicht gefunden')

    if (message.authorId !== user.id && user.role !== 'ADMIN') {
        throw new Error('Keine Berechtigung')
    }

    return prisma.message.delete({ where: { id: messageId } })
}

export async function updateMessage(messageId: string, content: string) {
    const user = await requireAuth()

    const message = await prisma.message.findUnique({ where: { id: messageId } })
    if (!message) throw new Error('Nachricht nicht gefunden')

    if (message.authorId !== user.id && user.role !== 'ADMIN') {
        throw new Error('Keine Berechtigung')
    }

    return prisma.message.update({
        where: { id: messageId },
        data: { content }
    })
}

export async function getCourseMessages() {
    return prisma.courseChatMessage.findMany({
        include: {
            author: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'asc' },
        take: 100 // Limit to last 100 messages for performance
    })
}

export async function sendCourseMessage(content: string) {
    const user = await requireAuth()

    return prisma.courseChatMessage.create({
        data: {
            content,
            authorId: user.id
        }
    })
}

export async function updateCourseMessage(messageId: string, content: string) {
    const user = await requireAuth()

    const message = await prisma.courseChatMessage.findUnique({ where: { id: messageId } })
    if (!message) throw new Error('Nachricht nicht gefunden')

    if (message.authorId !== user.id && user.role !== 'ADMIN') {
        throw new Error('Keine Berechtigung')
    }

    return prisma.courseChatMessage.update({
        where: { id: messageId },
        data: { content }
    })
}

export async function deleteCourseMessage(messageId: string) {
    const user = await requireAuth()

    const message = await prisma.courseChatMessage.findUnique({ where: { id: messageId } })
    if (!message) throw new Error('Nachricht nicht gefunden')

    if (message.authorId !== user.id && user.role !== 'ADMIN') {
        throw new Error('Keine Berechtigung')
    }

    return prisma.courseChatMessage.delete({ where: { id: messageId } })
}

// ============== AUDIO LEARNING ==============

export async function getAudioSnippets() {
    return prisma.audioSnippet.findMany({
        orderBy: { uploadedAt: 'desc' }
    })
}

export async function createAudioSnippet(data: { title: string; description?: string; url: string; duration?: number; transcript?: string }) {
    // Optional: requireAuth() check if strict admin enforcement is needed here
    // const user = await requireAuth(); 
    // if (user.role !== 'ADMIN') throw new Error('Unauthorized');

    return prisma.audioSnippet.create({ data })
}

export async function deleteAudioSnippet(id: string) {
    // Optional: requireAuth()
    return prisma.audioSnippet.delete({ where: { id } })
}

// ============== LECTURES ==============

export async function getLectures() {
    return prisma.lecture.findMany({
        orderBy: { startTime: 'asc' },
    });
}

export async function createLecture(data: {
    title: string;
    description?: string;
    room?: string;
    professor?: string;
    startTime: Date;
    endTime: Date;
}) {
    // Optional: requireAuth() check if strict admin enforcement is needed here
    return prisma.lecture.create({ data });
}

export async function deleteLecture(id: string) {
    // Optional: requireAuth()
    return prisma.lecture.delete({ where: { id } });
}

// ============== DASHBOARD ==============

export async function getDashboardData() {
    const user = await getCurrentUser()
    if (!user) return null

    // Get next upcoming lecture
    const nextLecture = await prisma.lecture.findFirst({
        where: {
            startTime: {
                gte: new Date()
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    })

    // Get recent news snippet (just one for "Insights" or similar)
    const latestNews = await prisma.news.findFirst({
        orderBy: { createdAt: 'desc' }
    })

    return {
        user,
        nextLecture,
        latestNews
    }
}
