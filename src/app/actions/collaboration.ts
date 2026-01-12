'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { success, error, type ActionResult } from '@/lib/action-result'
import { translatePrismaError } from '@/lib/prisma-errors'
import { createForumPostSchema, createChatMessageSchema, idSchema, validateInput } from '@/lib/validation'
import type { Thread, Message, CourseChatMessage } from '@prisma/client'

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

export async function getThread(threadId: unknown) {
    const validatedId = validateInput(idSchema, threadId)
    return prisma.thread.findUnique({
        where: { id: validatedId },
        include: {
            author: { select: { id: true, name: true } },
            messages: {
                include: { author: { select: { id: true, name: true } } },
                orderBy: { createdAt: 'asc' },
            },
        },
    })
}

export async function createThread(data: unknown): Promise<ActionResult<Thread>> {
    try {
        const user = await requireAuth()
        const validated = validateInput(createForumPostSchema, data)

        const thread = await prisma.thread.create({
            data: {
                title: validated.title,
                content: validated.content,
                authorId: user.id,
            },
        })
        return success(thread)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function updateThread(threadId: unknown, data: unknown): Promise<ActionResult<Thread>> {
    try {
        const user = await requireAuth()
        const validatedId = validateInput(idSchema, threadId)
        const validated = validateInput(createForumPostSchema, data)

        const thread = await prisma.thread.findUnique({ where: { id: validatedId } })
        if (!thread) {
            return error('Thread nicht gefunden', 'NOT_FOUND')
        }

        if (thread.authorId !== user.id && user.role !== 'ADMIN') {
            return error('Keine Berechtigung', 'FORBIDDEN')
        }

        const updated = await prisma.thread.update({
            where: { id: validatedId },
            data: {
                title: validated.title,
                content: validated.content,
            }
        })
        return success(updated)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function deleteThread(threadId: unknown): Promise<ActionResult<{ id: string }>> {
    try {
        const user = await requireAuth()
        const validatedId = validateInput(idSchema, threadId)

        const thread = await prisma.thread.findUnique({ where: { id: validatedId } })
        if (!thread) {
            return error('Thread nicht gefunden', 'NOT_FOUND')
        }

        if (thread.authorId !== user.id && user.role !== 'ADMIN') {
            return error('Keine Berechtigung', 'FORBIDDEN')
        }

        await prisma.thread.delete({ where: { id: validatedId } })
        return success({ id: validatedId })
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

// ============== MESSAGES ==============

export async function createMessage(threadId: unknown, content: unknown): Promise<ActionResult<Message>> {
    try {
        const user = await requireAuth()
        const validatedId = validateInput(idSchema, threadId)
        const validated = validateInput(createChatMessageSchema, { content })

        const thread = await prisma.thread.findUnique({ where: { id: validatedId } })
        if (!thread) {
            return error('Thread nicht gefunden', 'NOT_FOUND')
        }

        const message = await prisma.message.create({
            data: {
                content: validated.content,
                threadId: validatedId,
                authorId: user.id,
            },
        })
        return success(message)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function updateMessage(messageId: unknown, content: unknown): Promise<ActionResult<Message>> {
    try {
        const user = await requireAuth()
        const validatedId = validateInput(idSchema, messageId)
        const validated = validateInput(createChatMessageSchema, { content })

        const message = await prisma.message.findUnique({ where: { id: validatedId } })
        if (!message) {
            return error('Nachricht nicht gefunden', 'NOT_FOUND')
        }

        if (message.authorId !== user.id && user.role !== 'ADMIN') {
            return error('Keine Berechtigung', 'FORBIDDEN')
        }

        const updated = await prisma.message.update({
            where: { id: validatedId },
            data: { content: validated.content }
        })
        return success(updated)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function deleteMessage(messageId: unknown): Promise<ActionResult<{ id: string }>> {
    try {
        const user = await requireAuth()
        const validatedId = validateInput(idSchema, messageId)

        const message = await prisma.message.findUnique({ where: { id: validatedId } })
        if (!message) {
            return error('Nachricht nicht gefunden', 'NOT_FOUND')
        }

        if (message.authorId !== user.id && user.role !== 'ADMIN') {
            return error('Keine Berechtigung', 'FORBIDDEN')
        }

        await prisma.message.delete({ where: { id: validatedId } })
        return success({ id: validatedId })
    } catch (err) {
        return error(translatePrismaError(err))
    }
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

export async function sendCourseMessage(content: unknown): Promise<ActionResult<CourseChatMessage>> {
    try {
        const user = await requireAuth()
        const validated = validateInput(createChatMessageSchema, { content })

        const message = await prisma.courseChatMessage.create({
            data: {
                content: validated.content,
                authorId: user.id
            }
        })
        return success(message)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function updateCourseMessage(messageId: unknown, content: unknown): Promise<ActionResult<CourseChatMessage>> {
    try {
        const user = await requireAuth()
        const validatedId = validateInput(idSchema, messageId)
        const validated = validateInput(createChatMessageSchema, { content })

        const message = await prisma.courseChatMessage.findUnique({ where: { id: validatedId } })
        if (!message) {
            return error('Nachricht nicht gefunden', 'NOT_FOUND')
        }

        if (message.authorId !== user.id && user.role !== 'ADMIN') {
            return error('Keine Berechtigung', 'FORBIDDEN')
        }

        const updated = await prisma.courseChatMessage.update({
            where: { id: validatedId },
            data: { content: validated.content }
        })
        return success(updated)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function deleteCourseMessage(messageId: unknown): Promise<ActionResult<{ id: string }>> {
    try {
        const user = await requireAuth()
        const validatedId = validateInput(idSchema, messageId)

        const message = await prisma.courseChatMessage.findUnique({ where: { id: validatedId } })
        if (!message) {
            return error('Nachricht nicht gefunden', 'NOT_FOUND')
        }

        if (message.authorId !== user.id && user.role !== 'ADMIN') {
            return error('Keine Berechtigung', 'FORBIDDEN')
        }

        await prisma.courseChatMessage.delete({ where: { id: validatedId } })
        return success({ id: validatedId })
    } catch (err) {
        return error(translatePrismaError(err))
    }
}
