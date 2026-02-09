'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/auth-guards'
import { success, error, type ActionResult } from '@/lib/action-result'
import { translatePrismaError } from '@/lib/prisma-errors'
import {
    createMaterialSchema,
    createNewsSchema,
    newsReactionSchema,
    createAudioSnippetSchema,
    createLectureSchema,
    createCurriculumTopicSchema,
    updateCurriculumTopicSchema,
    idSchema,
    validateInput
} from '@/lib/validation'
import type { Material, News, AudioSnippet, Lecture, CurriculumTopic } from '@prisma/client'

// ============== MATERIALS ==============

export async function getMaterials() {
    return prisma.material.findMany({
        orderBy: { uploadedAt: 'desc' },
        include: { topic: true },
        cacheStrategy: { ttl: 60 } // Cache for 60 seconds
    })
}

export async function createMaterial(data: unknown): Promise<ActionResult<Material>> {
    try {
        await requireAdmin()
        const validated = validateInput(createMaterialSchema, data)
        const material = await prisma.material.create({ data: validated })
        return success(material)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function deleteMaterial(id: unknown): Promise<ActionResult<Material>> {
    try {
        await requireAdmin()
        const validatedId = validateInput(idSchema, id)
        const material = await prisma.material.delete({ where: { id: validatedId } })
        return success(material)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

// ============== CURRICULUM ==============

export async function getCurriculumTopics() {
    return prisma.curriculumTopic.findMany({
        orderBy: { order: 'asc' },
        include: { materials: true },
        cacheStrategy: { ttl: 60 } // Cache for 60 seconds
    })
}

export async function createCurriculumTopic(data: unknown): Promise<ActionResult<CurriculumTopic>> {
    try {
        await requireAdmin()
        const validated = validateInput(createCurriculumTopicSchema, data)
        const topic = await prisma.curriculumTopic.create({ data: validated })
        return success(topic)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function updateCurriculumTopic(id: unknown, data: unknown): Promise<ActionResult<CurriculumTopic>> {
    try {
        await requireAdmin()
        const validatedId = validateInput(idSchema, id)
        const validated = validateInput(updateCurriculumTopicSchema, data)
        const topic = await prisma.curriculumTopic.update({
            where: { id: validatedId },
            data: validated
        })
        return success(topic)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function deleteCurriculumTopic(id: unknown): Promise<ActionResult<CurriculumTopic>> {
    try {
        await requireAdmin()
        const validatedId = validateInput(idSchema, id)
        const topic = await prisma.curriculumTopic.delete({ where: { id: validatedId } })
        return success(topic)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

// ============== NEWS ==============

export async function getNews() {
    return prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        cacheStrategy: { ttl: 30 } // Cache for 30 seconds (news updates more often)
    })
}

export async function createNews(data: unknown): Promise<ActionResult<News>> {
    try {
        await requireAdmin()
        const validated = validateInput(createNewsSchema, data)
        const news = await prisma.news.create({ data: validated })
        return success(news)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function deleteNews(id: unknown): Promise<ActionResult<News>> {
    try {
        await requireAdmin()
        const validatedId = validateInput(idSchema, id)
        const news = await prisma.news.delete({ where: { id: validatedId } })
        return success(news)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function getNewsReactions(newsId: unknown) {
    await requireAuth()
    const validatedId = validateInput(idSchema, newsId)
    return prisma.newsReaction.findMany({
        where: { newsId: validatedId },
        select: { emoji: true, userId: true }
    })
}

export async function addNewsReaction(newsId: unknown, emoji: unknown): Promise<ActionResult<{ emoji: string }>> {
    try {
        const user = await requireAuth()
        const validated = validateInput(newsReactionSchema, { newsId, emoji })

        const reaction = await prisma.newsReaction.upsert({
            where: {
                newsId_userId: { newsId: validated.newsId, userId: user.id }
            },
            update: { emoji: validated.emoji },
            create: { newsId: validated.newsId, userId: user.id, emoji: validated.emoji }
        })
        return success({ emoji: reaction.emoji })
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function removeNewsReaction(newsId: unknown): Promise<ActionResult<{ count: number }>> {
    try {
        const user = await requireAuth()
        const validatedId = validateInput(idSchema, newsId)

        const result = await prisma.newsReaction.deleteMany({
            where: { newsId: validatedId, userId: user.id }
        })
        return success({ count: result.count })
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

// ============== AUDIO ==============

export async function getAudioSnippets() {
    return prisma.audioSnippet.findMany({
        orderBy: { uploadedAt: 'desc' },
        cacheStrategy: { ttl: 120 } // Cache for 2 minutes
    })
}

export async function createAudioSnippet(data: unknown): Promise<ActionResult<AudioSnippet>> {
    try {
        await requireAdmin()
        const validated = validateInput(createAudioSnippetSchema, data)
        const snippet = await prisma.audioSnippet.create({ data: validated })
        return success(snippet)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function deleteAudioSnippet(id: unknown): Promise<ActionResult<AudioSnippet>> {
    try {
        await requireAdmin()
        const validatedId = validateInput(idSchema, id)
        const snippet = await prisma.audioSnippet.delete({ where: { id: validatedId } })
        return success(snippet)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

// ============== LECTURES ==============

export async function getLectures() {
    return prisma.lecture.findMany({
        orderBy: { startTime: 'asc' },
        cacheStrategy: { ttl: 60 } // Cache for 60 seconds
    })
}

export async function createLecture(data: unknown): Promise<ActionResult<Lecture>> {
    try {
        await requireAdmin()
        const validated = validateInput(createLectureSchema, data)
        const lecture = await prisma.lecture.create({ data: validated })
        return success(lecture)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function deleteLecture(id: unknown): Promise<ActionResult<Lecture>> {
    try {
        await requireAdmin()
        const validatedId = validateInput(idSchema, id)
        const lecture = await prisma.lecture.delete({ where: { id: validatedId } })
        return success(lecture)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}
