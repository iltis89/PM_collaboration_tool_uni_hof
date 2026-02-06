/**
 * Simple in-memory rate limiter for login attempts.
 * For production, consider using Redis or a distributed solution.
 */

interface RateLimitEntry {
    attempts: number
    lastAttempt: number
    blockedUntil: number
}

const loginAttempts = new Map<string, RateLimitEntry>()
const RATE_LIMIT_DISABLED = process.env.DISABLE_RATE_LIMIT === 'true'

const RATE_LIMIT_CONFIG = {
    maxAttempts: 5,           // Max attempts before blocking
    windowMs: 15 * 60 * 1000, // 15 minutes window
    blockDurationMs: 15 * 60 * 1000, // Block for 15 minutes
}

/**
 * Check if an IP/identifier is rate limited
 */
export function isRateLimited(identifier: string): { limited: boolean; remainingAttempts: number; blockedFor?: number } {
    if (RATE_LIMIT_DISABLED) {
        return { limited: false, remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts }
    }

    const now = Date.now()
    const entry = loginAttempts.get(identifier)

    if (!entry) {
        return { limited: false, remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts }
    }

    // Check if currently blocked
    if (entry.blockedUntil > now) {
        const blockedFor = Math.ceil((entry.blockedUntil - now) / 1000 / 60) // minutes
        return { limited: true, remainingAttempts: 0, blockedFor }
    }

    // Check if window has expired (reset attempts)
    if (now - entry.lastAttempt > RATE_LIMIT_CONFIG.windowMs) {
        loginAttempts.delete(identifier)
        return { limited: false, remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts }
    }

    const remaining = RATE_LIMIT_CONFIG.maxAttempts - entry.attempts
    return { limited: remaining <= 0, remainingAttempts: Math.max(0, remaining) }
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(identifier: string): void {
    if (RATE_LIMIT_DISABLED) {
        return
    }

    const now = Date.now()
    const entry = loginAttempts.get(identifier)

    if (!entry || now - entry.lastAttempt > RATE_LIMIT_CONFIG.windowMs) {
        // New entry or window expired
        loginAttempts.set(identifier, {
            attempts: 1,
            lastAttempt: now,
            blockedUntil: 0
        })
        return
    }

    entry.attempts++
    entry.lastAttempt = now

    // Block if max attempts exceeded
    if (entry.attempts >= RATE_LIMIT_CONFIG.maxAttempts) {
        entry.blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs
    }

    loginAttempts.set(identifier, entry)
}

/**
 * Clear rate limit on successful login
 */
export function clearRateLimit(identifier: string): void {
    if (RATE_LIMIT_DISABLED) {
        return
    }

    loginAttempts.delete(identifier)
}

/**
 * Clean up old entries (call periodically)
 */
export function cleanupRateLimits(): void {
    if (RATE_LIMIT_DISABLED) {
        return
    }

    const now = Date.now()
    for (const [key, entry] of loginAttempts.entries()) {
        if (now - entry.lastAttempt > RATE_LIMIT_CONFIG.windowMs && entry.blockedUntil < now) {
            loginAttempts.delete(key)
        }
    }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimits, 5 * 60 * 1000)
}
