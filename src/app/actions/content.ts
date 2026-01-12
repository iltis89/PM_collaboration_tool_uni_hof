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

async function requireAdmin() {
    const user = await requireAuth()
    if (user.role !== 'ADMIN') {
        throw new Error('Keine Admin-Berechtigung')
    }
    return user
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

// ============== AUDIO ==============

export async function getAudioSnippets() {
    return prisma.audioSnippet.findMany({
        orderBy: { uploadedAt: 'desc' }
    })
}

export async function createAudioSnippet(data: { title: string; description?: string; url: string; duration?: number; transcript?: string }) {
    await requireAdmin()
    return prisma.audioSnippet.create({ data })
}

export async function deleteAudioSnippet(id: string) {
    await requireAdmin()
    return prisma.audioSnippet.delete({ where: { id } })
}

// ============== LECTURES ==============

export async function getLectures() {
    return prisma.lecture.findMany({
        orderBy: { startTime: 'asc' },
    })
}

export async function createLecture(data: {
    title: string;
    description?: string;
    room?: string;
    professor?: string;
    startTime: Date;
    endTime: Date;
}) {
    await requireAdmin()
    return prisma.lecture.create({ data })
}

export async function deleteLecture(id: string) {
    await requireAdmin()
    return prisma.lecture.delete({ where: { id } })
}
