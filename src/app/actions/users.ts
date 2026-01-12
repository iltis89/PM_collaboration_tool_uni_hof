'use server'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
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

export async function deleteUser(id: string) {
    await requireAdmin()
    return prisma.user.delete({ where: { id } })
}
