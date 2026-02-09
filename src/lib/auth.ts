import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { cache } from 'react'
import { env } from '@/lib/env'

const key = new TextEncoder().encode(env.jwtSecret)

export function shouldUseSecureCookies() {
    if (process.env.COOKIE_SECURE === 'true') return true
    if (process.env.COOKIE_SECURE === 'false') return false
    return process.env.NODE_ENV === 'production'
}


interface SessionPayload {
    user: {
        id: string;
        email: string;
        role: string;
    };
    expires: Date;
    [key: string]: unknown;
}

export async function encrypt(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        })
        return payload as unknown as SessionPayload
    } catch {
        return null
    }
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null
    return await decrypt(session)
}

export async function updateSession(request: NextRequest, parsedSession?: SessionPayload | null) {
    const session = request.cookies.get('session')?.value
    if (!session) return

    // Refresh expiration on each request
    const parsed = parsedSession ?? await decrypt(session)
    if (!parsed) return

    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const res = NextResponse.next()
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        secure: shouldUseSecureCookies(),
        sameSite: 'lax',
        expires: parsed.expires,
    })
    return res
}

export const getCachedSession = cache(async () => getSession())
