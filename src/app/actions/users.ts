'use server'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { requireAdmin } from '@/lib/auth-guards'
import { success, error, type ActionResult } from '@/lib/action-result'
import { translatePrismaError } from '@/lib/prisma-errors'
import { createUserSchema, idSchema, validateInput } from '@/lib/validation'
import type { User } from '@prisma/client'

type SafeUser = Pick<User, 'id' | 'email' | 'name' | 'role' | 'xp' | 'level' | 'createdAt' | 'privacyAccepted' | 'privacyAcceptedAt'>

export async function getUsers(): Promise<SafeUser[]> {
    await requireAdmin()
    return prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, xp: true, level: true, createdAt: true, privacyAccepted: true, privacyAcceptedAt: true },
        orderBy: { createdAt: 'desc' },
    })
}

export async function getAdminStats() {
    await requireAdmin()

    const [userCount, totalExams, passedExams, topStudents] = await Promise.all([
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.examResult.count(),
        prisma.examResult.count({ where: { passed: true } }),
        prisma.user.findMany({
            where: { role: 'STUDENT' },
            orderBy: { xp: 'desc' },
            take: 5,
            select: { id: true, name: true, xp: true, level: true }
        }),
    ])

    const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;

    return {
        userCount,
        totalExams,
        passRate,
        topStudents
    };
}

export async function createUser(data: unknown): Promise<ActionResult<SafeUser>> {
    try {
        await requireAdmin()
        const validated = validateInput(createUserSchema, data)
        const hashedPassword = await hash(validated.password, 12)

        const user = await prisma.user.create({
            data: {
                email: validated.email,
                name: validated.name,
                password: hashedPassword,
                role: validated.role || 'STUDENT',
            },
            select: { id: true, email: true, name: true, role: true, xp: true, level: true, createdAt: true, privacyAccepted: true, privacyAcceptedAt: true }
        })
        return success(user)
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

export async function deleteUser(id: unknown): Promise<ActionResult<{ id: string }>> {
    try {
        await requireAdmin()
        const validatedId = validateInput(idSchema, id)
        await prisma.user.delete({ where: { id: validatedId } })
        return success({ id: validatedId })
    } catch (err) {
        return error(translatePrismaError(err))
    }
}
