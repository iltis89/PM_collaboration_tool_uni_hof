/**
 * Zod validation schemas for server actions.
 * These schemas provide runtime type safety and input validation.
 */

import { z } from 'zod'

// ============== AUTH SCHEMAS ==============

export const loginSchema = z.object({
    email: z.string().email('Ungültige E-Mail-Adresse'),
    password: z.string().min(1, 'Passwort ist erforderlich'),
})

export const changePasswordSchema = z.object({
    newPassword: z.string()
        .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
        .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
        .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten'),
})

// ============== CONTENT SCHEMAS ==============

export const createMaterialSchema = z.object({
    title: z.string().min(1, 'Titel ist erforderlich').max(200, 'Titel darf maximal 200 Zeichen haben'),
    description: z.string().max(1000, 'Beschreibung darf maximal 1000 Zeichen haben').optional(),
    fileUrl: z.string().url('Ungültige URL').optional(),
    size: z.string().optional(),
    topicId: z.string().uuid('Ungültige Topic-ID').optional(),
})

export const createNewsSchema = z.object({
    title: z.string().min(1, 'Titel ist erforderlich').max(200, 'Titel darf maximal 200 Zeichen haben'),
    content: z.string().min(1, 'Inhalt ist erforderlich').max(5000, 'Inhalt darf maximal 5000 Zeichen haben'),
    author: z.string().max(100, 'Autor darf maximal 100 Zeichen haben').optional(),
})

export const newsReactionSchema = z.object({
    newsId: z.string().min(1, 'News-ID ist erforderlich'),
    emoji: z.string().min(1).max(10, 'Emoji darf maximal 10 Zeichen haben'),
})

export const createAudioSnippetSchema = z.object({
    title: z.string().min(1, 'Titel ist erforderlich').max(200),
    description: z.string().max(1000).optional(),
    url: z.string().url('Ungültige URL'),
    duration: z.number().positive().optional(),
    transcript: z.string().max(10000).optional(),
})

export const createLectureSchema = z.object({
    title: z.string().min(1, 'Titel ist erforderlich').max(200),
    description: z.string().max(1000).optional(),
    room: z.string().max(50).optional(),
    professor: z.string().max(100).optional(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
}).refine(
    data => data.endTime > data.startTime,
    { message: 'Endzeit muss nach Startzeit liegen', path: ['endTime'] }
)

export const createCurriculumTopicSchema = z.object({
    title: z.string().min(1, 'Titel ist erforderlich').max(200),
    description: z.string().max(1000).optional(),
    order: z.number().int().min(0),
    date: z.coerce.date().optional(),
    status: z.enum(['UPCOMING', 'IN_PROGRESS', 'COMPLETED']).optional(),
})

export const updateCurriculumTopicSchema = createCurriculumTopicSchema.partial()

// ============== USER SCHEMAS ==============

export const createUserSchema = z.object({
    email: z.string().email('Ungültige E-Mail-Adresse'),
    name: z.string().min(1, 'Name ist erforderlich').max(100),
    password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
    role: z.enum(['STUDENT', 'ADMIN']).optional(),
})

export const updateUserSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    xp: z.number().int().min(0).optional(),
    level: z.number().int().min(1).optional(),
    role: z.enum(['STUDENT', 'ADMIN']).optional(),
})

// ============== COLLABORATION SCHEMAS ==============

export const createForumPostSchema = z.object({
    title: z.string().min(1, 'Titel ist erforderlich').max(200),
    content: z.string().min(1, 'Inhalt ist erforderlich').max(10000),
    category: z.string().max(50).optional(),
})

export const createForumReplySchema = z.object({
    postId: z.string().min(1, 'Post-ID ist erforderlich'),
    content: z.string().min(1, 'Inhalt ist erforderlich').max(5000),
})

export const createChatMessageSchema = z.object({
    content: z.string().min(1, 'Nachricht ist erforderlich').max(2000),
})

// ============== ID SCHEMA ==============

export const idSchema = z.string().min(1, 'ID ist erforderlich')

// ============== HELPER ==============

/**
 * Validates input against a Zod schema and returns the parsed data.
 * Throws a formatted error if validation fails.
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data)
    if (!result.success) {
        const firstError = result.error.issues[0]
        throw new Error(firstError?.message || 'Validierungsfehler')
    }
    return result.data
}
