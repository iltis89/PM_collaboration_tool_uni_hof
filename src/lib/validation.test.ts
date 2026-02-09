/**
 * Unit tests for Zod validation schemas.
 */
import { describe, it, expect } from 'vitest'
import {
    loginSchema,
    changePasswordSchema,
    createUserSchema,
    createMaterialSchema,
    createNewsSchema,
    newsReactionSchema,
    createAudioSnippetSchema,
    createLectureSchema,
    createCurriculumTopicSchema,
    createForumPostSchema,
    createChatMessageSchema,
    idSchema,
    validateInput,
} from './validation'

describe('loginSchema', () => {
    it('should accept valid credentials', () => {
        const result = loginSchema.safeParse({ email: 'test@example.com', password: 'secret123' })
        expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
        const result = loginSchema.safeParse({ email: 'not-email', password: 'pass' })
        expect(result.success).toBe(false)
    })

    it('should reject empty password', () => {
        const result = loginSchema.safeParse({ email: 'test@example.com', password: '' })
        expect(result.success).toBe(false)
    })
})

describe('changePasswordSchema', () => {
    it('should accept strong password', () => {
        const result = changePasswordSchema.safeParse({ newPassword: 'MySecure1' })
        expect(result.success).toBe(true)
    })

    it('should reject password without uppercase', () => {
        const result = changePasswordSchema.safeParse({ newPassword: 'mysecure1' })
        expect(result.success).toBe(false)
    })

    it('should reject password without number', () => {
        const result = changePasswordSchema.safeParse({ newPassword: 'MySecure' })
        expect(result.success).toBe(false)
    })

    it('should reject password shorter than 8 chars', () => {
        const result = changePasswordSchema.safeParse({ newPassword: 'Ab1' })
        expect(result.success).toBe(false)
    })
})

describe('createUserSchema', () => {
    it('should accept valid user data', () => {
        const result = createUserSchema.safeParse({
            email: 'user@test.com',
            name: 'Test User',
            password: 'password123',
            role: 'STUDENT',
        })
        expect(result.success).toBe(true)
    })

    it('should reject invalid role', () => {
        const result = createUserSchema.safeParse({
            email: 'user@test.com',
            name: 'Test',
            password: 'password123',
            role: 'SUPERADMIN',
        })
        expect(result.success).toBe(false)
    })

    it('should allow role to be optional', () => {
        const result = createUserSchema.safeParse({
            email: 'user@test.com',
            name: 'Test',
            password: 'password123',
        })
        expect(result.success).toBe(true)
    })
})

describe('createMaterialSchema', () => {
    it('should accept valid material', () => {
        const result = createMaterialSchema.safeParse({ title: 'Lecture Notes' })
        expect(result.success).toBe(true)
    })

    it('should reject empty title', () => {
        const result = createMaterialSchema.safeParse({ title: '' })
        expect(result.success).toBe(false)
    })

    it('should reject title over 200 chars', () => {
        const result = createMaterialSchema.safeParse({ title: 'a'.repeat(201) })
        expect(result.success).toBe(false)
    })

    it('should reject invalid file URL', () => {
        const result = createMaterialSchema.safeParse({ title: 'Test', fileUrl: 'not-a-url' })
        expect(result.success).toBe(false)
    })
})

describe('createNewsSchema', () => {
    it('should accept valid news', () => {
        const result = createNewsSchema.safeParse({ title: 'Update', content: 'Content here' })
        expect(result.success).toBe(true)
    })

    it('should reject content over 5000 chars', () => {
        const result = createNewsSchema.safeParse({ title: 'X', content: 'a'.repeat(5001) })
        expect(result.success).toBe(false)
    })
})

describe('newsReactionSchema', () => {
    it('should accept valid reaction', () => {
        const result = newsReactionSchema.safeParse({
            newsId: 'clr1234567890abcdefghijkl',
            emoji: '👍',
        })
        expect(result.success).toBe(true)
    })

    it('should reject invalid CUID', () => {
        const result = newsReactionSchema.safeParse({ newsId: 'bad-id', emoji: '👍' })
        expect(result.success).toBe(false)
    })
})

describe('createAudioSnippetSchema', () => {
    it('should accept valid snippet', () => {
        const result = createAudioSnippetSchema.safeParse({
            title: 'Audio 1',
            url: 'https://example.com/audio.mp3',
        })
        expect(result.success).toBe(true)
    })

    it('should reject negative duration', () => {
        const result = createAudioSnippetSchema.safeParse({
            title: 'Audio',
            url: 'https://example.com/audio.mp3',
            duration: -5,
        })
        expect(result.success).toBe(false)
    })
})

describe('createLectureSchema', () => {
    it('should accept valid lecture', () => {
        const result = createLectureSchema.safeParse({
            title: 'PM Basics',
            startTime: '2026-02-10T09:00:00Z',
            endTime: '2026-02-10T10:30:00Z',
        })
        expect(result.success).toBe(true)
    })

    it('should reject endTime before startTime', () => {
        const result = createLectureSchema.safeParse({
            title: 'PM Basics',
            startTime: '2026-02-10T10:00:00Z',
            endTime: '2026-02-10T09:00:00Z',
        })
        expect(result.success).toBe(false)
    })
})

describe('createCurriculumTopicSchema', () => {
    it('should accept valid topic', () => {
        const result = createCurriculumTopicSchema.safeParse({
            title: 'Module 1',
            order: 1,
            status: 'UPCOMING',
        })
        expect(result.success).toBe(true)
    })

    it('should reject invalid status enum', () => {
        const result = createCurriculumTopicSchema.safeParse({
            title: 'Module 1',
            order: 1,
            status: 'INVALID',
        })
        expect(result.success).toBe(false)
    })
})

describe('createForumPostSchema', () => {
    it('should accept valid post', () => {
        const result = createForumPostSchema.safeParse({
            title: 'Question',
            content: 'How does XP work?',
        })
        expect(result.success).toBe(true)
    })

    it('should reject content over 10000 chars', () => {
        const result = createForumPostSchema.safeParse({
            title: 'Long post',
            content: 'x'.repeat(10001),
        })
        expect(result.success).toBe(false)
    })
})

describe('createChatMessageSchema', () => {
    it('should accept valid message', () => {
        const result = createChatMessageSchema.safeParse({ content: 'Hello!' })
        expect(result.success).toBe(true)
    })

    it('should reject message over 2000 chars', () => {
        const result = createChatMessageSchema.safeParse({ content: 'x'.repeat(2001) })
        expect(result.success).toBe(false)
    })

    it('should reject empty message', () => {
        const result = createChatMessageSchema.safeParse({ content: '' })
        expect(result.success).toBe(false)
    })
})

describe('idSchema', () => {
    it('should accept valid CUID', () => {
        const result = idSchema.safeParse('clr1234567890abcdefghijkl')
        expect(result.success).toBe(true)
    })

    it('should reject non-CUID string', () => {
        const result = idSchema.safeParse('not-a-cuid')
        expect(result.success).toBe(false)
    })
})

describe('validateInput', () => {
    it('should return parsed data on success', () => {
        const result = validateInput(loginSchema, { email: 'a@b.com', password: 'p' })
        expect(result).toEqual({ email: 'a@b.com', password: 'p' })
    })

    it('should throw on validation failure', () => {
        expect(() => validateInput(loginSchema, { email: '', password: '' })).toThrow()
    })

    it('should throw with first error message', () => {
        expect(() => validateInput(changePasswordSchema, { newPassword: 'short' }))
            .toThrow('Passwort muss mindestens 8 Zeichen lang sein')
    })
})
