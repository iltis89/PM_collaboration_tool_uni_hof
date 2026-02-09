/**
 * Shared authentication guard helpers for Server Actions.
 * Single source of truth — eliminates duplication across action modules.
 */

import { getCurrentUser } from '@/app/actions/auth'

/**
 * Require an authenticated user. Throws if not logged in.
 */
export async function requireAuth() {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('Nicht authentifiziert')
    }
    return user
}

/**
 * Require an authenticated admin user. Throws if not admin.
 */
export async function requireAdmin() {
    const user = await requireAuth()
    if (user.role !== 'ADMIN') {
        throw new Error('Keine Admin-Berechtigung')
    }
    return user
}
