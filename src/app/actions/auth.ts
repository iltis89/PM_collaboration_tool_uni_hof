'use server'

import { prisma } from '@/lib/prisma'
import { compare, hash } from 'bcryptjs'
import { cookies, headers } from 'next/headers'
import { encrypt, getSession } from '@/lib/auth'
import { isRateLimited, recordFailedAttempt, clearRateLimit } from '@/lib/rate-limit'
import { success, error, type ActionResult } from '@/lib/action-result'
import { loginSchema, changePasswordSchema, validateInput } from '@/lib/validation'
import { translatePrismaError } from '@/lib/prisma-errors'

/**
 * Login action with rate limiting protection.
 */
export async function login(email: unknown, password: unknown): Promise<ActionResult<{ id: string; name: string | null; role: string; requirePasswordChange: boolean }>> {
    try {
        // Validate input
        const validated = validateInput(loginSchema, { email, password })

        // Get client identifier for rate limiting
        const headersList = await headers()
        const forwardedFor = headersList.get('x-forwarded-for')
        const clientIp = forwardedFor?.split(',')[0] || 'unknown'
        const identifier = `login:${clientIp}:${validated.email}`

        // Check rate limit
        const rateLimitStatus = isRateLimited(identifier)
        if (rateLimitStatus.limited) {
            return error(`Zu viele Anmeldeversuche. Bitte warte ${rateLimitStatus.blockedFor} Minuten.`, 'RATE_LIMITED')
        }

        const user = await prisma.user.findUnique({
            where: { email: validated.email },
        })

        if (!user) {
            recordFailedAttempt(identifier)
            return error('Benutzer nicht gefunden', 'NOT_FOUND')
        }

        const passwordMatch = await compare(validated.password, user.password)
        if (!passwordMatch) {
            recordFailedAttempt(identifier)
            return error(`Falsches Passwort. Noch ${rateLimitStatus.remainingAttempts - 1} Versuche.`, 'UNAUTHORIZED')
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

        return success({
            id: user.id,
            name: user.name,
            role: user.role,
            requirePasswordChange: user.mustChangePassword
        })
    } catch (err) {
        return error(translatePrismaError(err), 'INTERNAL')
    }
}

/**
 * Change password action.
 */
export async function changePassword(newPassword: unknown): Promise<ActionResult<{ success: boolean }>> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return error('Nicht authentifiziert', 'UNAUTHORIZED')
        }

        const validated = validateInput(changePasswordSchema, { newPassword })
        const hashedPassword = await hash(validated.newPassword, 12)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                mustChangePassword: false
            }
        })

        return success({ success: true })
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

/**
 * Logout action.
 */
export async function logout(): Promise<ActionResult<{ success: boolean }>> {
    try {
        const cookieStore = await cookies()
        cookieStore.delete('session')
        cookieStore.delete('userId')
        cookieStore.delete('userRole')
        return success({ success: true })
    } catch (err) {
        return error(translatePrismaError(err))
    }
}

/**
 * Get the current authenticated user.
 */
export async function getCurrentUser() {
    const session = await getSession()
    if (!session || !session.user?.id) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, name: true, role: true, xp: true, level: true, streak: true, privacyAccepted: true },
    })

    return user
}

/**
 * Accept privacy policy action.
 */
export async function acceptPrivacy(): Promise<ActionResult<{ accepted: boolean }>> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return error('Nicht authentifiziert', 'UNAUTHORIZED')
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                privacyAccepted: true,
                privacyAcceptedAt: new Date()
            }
        })

        return success({ accepted: true })
    } catch (err) {
        return error(translatePrismaError(err))
    }
}
