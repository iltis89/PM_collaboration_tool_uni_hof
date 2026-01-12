'use server'

import { prisma } from '@/lib/prisma'
import { compare, hash } from 'bcryptjs'
import { cookies, headers } from 'next/headers'
import { encrypt, getSession } from '@/lib/auth'
import { isRateLimited, recordFailedAttempt, clearRateLimit } from '@/lib/rate-limit'

export async function login(email: string, password: string) {
    // Get client identifier for rate limiting
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const clientIp = forwardedFor?.split(',')[0] || 'unknown'
    const identifier = `login:${clientIp}:${email}`

    // Check rate limit
    const rateLimitStatus = isRateLimited(identifier)
    if (rateLimitStatus.limited) {
        return {
            success: false,
            error: `Zu viele Anmeldeversuche. Bitte warte ${rateLimitStatus.blockedFor} Minuten.`
        }
    }

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        recordFailedAttempt(identifier)
        return { success: false, error: 'Benutzer nicht gefunden' }
    }

    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
        recordFailedAttempt(identifier)
        return {
            success: false,
            error: `Falsches Passwort. Noch ${rateLimitStatus.remainingAttempts - 1} Versuche.`
        }
    }

    // Clear rate limit on successful login
    clearRateLimit(identifier)

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const sessionCookie = await encrypt({
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        },
        expires
    })

    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    })

    // Clean up old cookies if they exist
    cookieStore.delete('userId')
    cookieStore.delete('userRole')

    return {
        success: true,
        user: { id: user.id, name: user.name, role: user.role },
        requirePasswordChange: user.mustChangePassword
    }
}

export async function changePassword(newPassword: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error('Nicht authentifiziert')

    const hashedPassword = await hash(newPassword, 12)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            mustChangePassword: false
        }
    })

    return { success: true }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    cookieStore.delete('userId')
    cookieStore.delete('userRole')
    return { success: true }
}

export async function getCurrentUser() {
    const session = await getSession()
    if (!session || !session.user?.id) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, name: true, role: true, xp: true, level: true, streak: true, privacyAccepted: true },
    })

    return user
}

export async function acceptPrivacy() {
    const user = await getCurrentUser()
    if (!user) throw new Error('Nicht authentifiziert')

    return prisma.user.update({
        where: { id: user.id },
        data: {
            privacyAccepted: true,
            privacyAcceptedAt: new Date()
        }
    })
}
