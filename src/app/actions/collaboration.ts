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

// ============== THREADS ==============

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

export async function deleteThread(threadId: string) {
    const user = await requireAuth()

    const thread = await prisma.thread.findUnique({ where: { id: threadId } })
    if (!thread) {
        throw new Error('Thread nicht gefunden')
    }

    if (thread.authorId !== user.id && user.role !== 'ADMIN') {
        throw new Error('Keine Berechtigung')
    }

    return prisma.thread.delete({ where: { id: threadId } })
}

// ============== MESSAGES ==============

export async function createMessage(threadId: string, content: string) {
    const user = await requireAuth()

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

export async function deleteMessage(messageId: string) {
    const user = await requireAuth()

    const message = await prisma.message.findUnique({ where: { id: messageId } })
    if (!message) throw new Error('Nachricht nicht gefunden')

    if (message.authorId !== user.id && user.role !== 'ADMIN') {
        throw new Error('Keine Berechtigung')
    }

    return prisma.message.delete({ where: { id: messageId } })
}

// ============== COURSE CHAT ==============

export async function getCourseMessages() {
    return prisma.courseChatMessage.findMany({
        include: {
            author: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'asc' },
        take: 100
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
