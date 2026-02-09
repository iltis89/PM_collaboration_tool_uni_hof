import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockPrisma, mockCompare, mockHash, mockCookies, mockHeaders, mockEncrypt, mockGetCachedSession, mockShouldUseSecureCookies, mockIsRateLimited, mockRecordFailedAttempt, mockClearRateLimit } = vi.hoisted(() => ({
    mockPrisma: {
        user: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
    mockCompare: vi.fn(),
    mockHash: vi.fn(),
    mockCookies: {
        set: vi.fn(),
        delete: vi.fn(),
    },
    mockHeaders: {
        get: vi.fn(),
    },
    mockEncrypt: vi.fn(),
    mockGetCachedSession: vi.fn(),
    mockShouldUseSecureCookies: vi.fn(),
    mockIsRateLimited: vi.fn(),
    mockRecordFailedAttempt: vi.fn(),
    mockClearRateLimit: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))
vi.mock('bcryptjs', () => ({ compare: mockCompare, hash: mockHash }))
vi.mock('next/headers', () => ({
    cookies: () => Promise.resolve(mockCookies),
    headers: () => Promise.resolve(mockHeaders),
}))
vi.mock('@/lib/auth', () => ({
    encrypt: mockEncrypt,
    getCachedSession: mockGetCachedSession,
    shouldUseSecureCookies: mockShouldUseSecureCookies,
}))
vi.mock('@/lib/rate-limit', () => ({
    isRateLimited: mockIsRateLimited,
    recordFailedAttempt: mockRecordFailedAttempt,
    clearRateLimit: mockClearRateLimit,
}))

import { login, logout, changePassword, getCurrentUser, acceptPrivacy } from './auth'

describe('auth actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIsRateLimited.mockReturnValue({ limited: false })
        mockHeaders.get.mockReturnValue('127.0.0.1')
        mockEncrypt.mockResolvedValue('mock-session-token')
        mockShouldUseSecureCookies.mockReturnValue(false)
    })

    describe('login', () => {
        it('rejects invalid email format', async () => {
            const result = await login('not-email', 'password123')
            expect(result.success).toBe(false)
        })

        it('rejects empty password', async () => {
            const result = await login('test@example.com', '')
            expect(result.success).toBe(false)
        })

        it('rejects rate-limited requests', async () => {
            mockIsRateLimited.mockReturnValue({ limited: true, blockedFor: 15 })

            const result = await login('test@example.com', 'password')
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.code).toBe('RATE_LIMITED')
            }
        })

        it('rejects non-existent user', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null)

            const result = await login('test@example.com', 'password')
            expect(result.success).toBe(false)
            expect(mockRecordFailedAttempt).toHaveBeenCalled()
        })

        it('rejects wrong password', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 'u1', email: 'test@example.com', password: 'hashed', name: 'Test', role: 'STUDENT',
            })
            mockCompare.mockResolvedValue(false)

            const result = await login('test@example.com', 'wrongpw')
            expect(result.success).toBe(false)
            expect(mockRecordFailedAttempt).toHaveBeenCalled()
        })

        it('succeeds with valid credentials', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 'u1', email: 'test@example.com', password: 'hashed', name: 'Test', role: 'STUDENT', mustChangePassword: false,
            })
            mockCompare.mockResolvedValue(true)

            const result = await login('test@example.com', 'correctpw')
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.id).toBe('u1')
                expect(result.data.role).toBe('STUDENT')
            }
            expect(mockClearRateLimit).toHaveBeenCalled()
            expect(mockCookies.set).toHaveBeenCalledWith('session', 'mock-session-token', expect.any(Object))
        })
    })

    describe('logout', () => {
        it('deletes session cookies', async () => {
            const result = await logout()
            expect(result.success).toBe(true)
            expect(mockCookies.delete).toHaveBeenCalledWith('session')
        })
    })

    describe('changePassword', () => {
        it('rejects unauthenticated users', async () => {
            mockGetCachedSession.mockResolvedValue(null)

            const result = await changePassword('NewPass123')
            expect(result.success).toBe(false)
        })

        it('rejects weak passwords', async () => {
            mockGetCachedSession.mockResolvedValue({ user: { id: 'u1' } })
            mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'T', role: 'STUDENT' })

            const result = await changePassword('weak')
            expect(result.success).toBe(false)
        })

        it('changes password for authenticated user', async () => {
            mockGetCachedSession.mockResolvedValue({ user: { id: 'u1' } })
            mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'T', role: 'STUDENT' })
            mockHash.mockResolvedValue('newhashed')
            mockPrisma.user.update.mockResolvedValue({})

            const result = await changePassword('StrongPass1')
            expect(result.success).toBe(true)
            expect(mockHash).toHaveBeenCalledWith('StrongPass1', 12)
        })
    })

    describe('getCurrentUser', () => {
        it('returns null if no session', async () => {
            mockGetCachedSession.mockResolvedValue(null)
            const user = await getCurrentUser()
            expect(user).toBeNull()
        })

        it('returns user data from session', async () => {
            mockGetCachedSession.mockResolvedValue({ user: { id: 'u1' } })
            mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'T', role: 'STUDENT' })

            const user = await getCurrentUser()
            expect(user).toBeDefined()
            expect(user?.id).toBe('u1')
        })
    })

    describe('acceptPrivacy', () => {
        it('rejects unauthenticated users', async () => {
            mockGetCachedSession.mockResolvedValue(null)
            const result = await acceptPrivacy()
            expect(result.success).toBe(false)
        })

        it('updates privacy acceptance', async () => {
            mockGetCachedSession.mockResolvedValue({ user: { id: 'u1' } })
            mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'T', role: 'STUDENT' })
            mockPrisma.user.update.mockResolvedValue({})

            const result = await acceptPrivacy()
            expect(result.success).toBe(true)
            expect(mockPrisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ privacyAccepted: true })
            }))
        })
    })
})
