import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockPrisma, mockGetCurrentUser, mockHash } = vi.hoisted(() => ({
    mockPrisma: {
        user: {
            findMany: vi.fn(),
            count: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
        },
        examResult: {
            count: vi.fn(),
        },
    },
    mockGetCurrentUser: vi.fn(),
    mockHash: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))
vi.mock('./auth', () => ({ getCurrentUser: mockGetCurrentUser }))
vi.mock('bcryptjs', () => ({ hash: mockHash }))

import { getUsers, getAdminStats, createUser, deleteUser } from './users'

const adminUser = { id: 'admin-1', email: 'admin@test.com', name: 'Admin', role: 'ADMIN' }
const studentUser = { id: 'user-1', email: 'student@test.com', name: 'Student', role: 'STUDENT' }

describe('users actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetCurrentUser.mockResolvedValue(adminUser)
    })

    describe('getUsers', () => {
        it('rejects non-admin users', async () => {
            mockGetCurrentUser.mockResolvedValue(studentUser)
            await expect(getUsers()).rejects.toThrow()
        })

        it('returns user list for admins', async () => {
            mockPrisma.user.findMany.mockResolvedValue([{ id: 'u1', name: 'User 1' }])
            const result = await getUsers()
            expect(result).toHaveLength(1)
        })
    })

    describe('getAdminStats', () => {
        it('rejects non-admin users', async () => {
            mockGetCurrentUser.mockResolvedValue(studentUser)
            await expect(getAdminStats()).rejects.toThrow()
        })

        it('returns aggregated stats', async () => {
            mockPrisma.user.count.mockResolvedValue(10)
            mockPrisma.examResult.count.mockResolvedValueOnce(100).mockResolvedValueOnce(80)
            mockPrisma.user.findMany.mockResolvedValue([])

            const result = await getAdminStats()
            expect(result.userCount).toBe(10)
            expect(result.passRate).toBe(80)
        })
    })

    describe('createUser', () => {
        it('rejects non-admin users', async () => {
            mockGetCurrentUser.mockResolvedValue(studentUser)
            const result = await createUser({ email: 'a@b.com', name: 'Test', password: 'pass123' })
            expect(result.success).toBe(false)
        })

        it('rejects invalid input', async () => {
            const result = await createUser({ email: 'bad', name: '', password: '' })
            expect(result.success).toBe(false)
        })

        it('creates user with hashed password', async () => {
            mockHash.mockResolvedValue('hashedpw')
            mockPrisma.user.create.mockResolvedValue({
                id: 'new-1', email: 'new@test.com', name: 'New User', role: 'STUDENT',
            })

            const result = await createUser({
                email: 'new@test.com', name: 'New User', password: 'password123',
            })
            expect(result.success).toBe(true)
            expect(mockHash).toHaveBeenCalledWith('password123', 12)
        })
    })

    describe('deleteUser', () => {
        it('rejects non-admin users', async () => {
            mockGetCurrentUser.mockResolvedValue(studentUser)
            const result = await deleteUser('clr1234567890abcdefghijkl')
            expect(result.success).toBe(false)
        })

        it('rejects invalid ID format', async () => {
            const result = await deleteUser('bad-id')
            expect(result.success).toBe(false)
        })

        it('deletes user by ID', async () => {
            mockPrisma.user.delete.mockResolvedValue({ id: 'clr1234567890abcdefghijkl' })
            const result = await deleteUser('clr1234567890abcdefghijkl')
            expect(result.success).toBe(true)
        })
    })
})
