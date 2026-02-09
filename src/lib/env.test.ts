/**
 * Unit tests for environment validation logic.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('env validation', () => {
    const originalEnv = process.env

    beforeEach(() => {
        // Reset module cache so env.ts re-evaluates
        vi.resetModules()
        process.env = { ...originalEnv }
    })

    afterEach(() => {
        process.env = originalEnv
    })

    it('should provide jwtSecret from environment', async () => {
        process.env.JWT_SECRET = 'my-test-secret-thats-long-enough-for-prod'
        process.env.DATABASE_URL = 'postgresql://test'
        process.env.NODE_ENV = 'development'

        const { env } = await import('./env')
        expect(env.jwtSecret).toBe('my-test-secret-thats-long-enough-for-prod')
    })

    it('should fall back to dev secret when JWT_SECRET is not set', async () => {
        delete process.env.JWT_SECRET
        process.env.DATABASE_URL = 'postgresql://test'
        process.env.NODE_ENV = 'development'

        const { env } = await import('./env')
        expect(env.jwtSecret).toBe('dev-secret-key-change-this-in-prod')
    })

    it('should report isProduction correctly', async () => {
        process.env.NODE_ENV = 'production'
        process.env.JWT_SECRET = 'a'.repeat(32)
        process.env.DATABASE_URL = 'postgresql://test'

        const { env } = await import('./env')
        expect(env.isProduction).toBe(true)
        expect(env.isDevelopment).toBe(false)
    })

    it('should report isDevelopment correctly', async () => {
        process.env.NODE_ENV = 'development'
        process.env.DATABASE_URL = 'postgresql://test'

        const { env } = await import('./env')
        expect(env.isDevelopment).toBe(true)
        expect(env.isProduction).toBe(false)
    })

    it('should throw in production when JWT_SECRET is missing', async () => {
        process.env.NODE_ENV = 'production'
        delete process.env.JWT_SECRET
        process.env.DATABASE_URL = 'postgresql://test'

        await expect(() => import('./env')).rejects.toThrow('JWT_SECRET must be set in production')
    })

    it('should throw in production when JWT_SECRET uses default value', async () => {
        process.env.NODE_ENV = 'production'
        process.env.JWT_SECRET = 'dev-secret-key-change-this-in-prod'
        process.env.DATABASE_URL = 'postgresql://test'

        await expect(() => import('./env')).rejects.toThrow('JWT_SECRET must not use the default development value in production')
    })

    it('should throw in production when JWT_SECRET is too short', async () => {
        process.env.NODE_ENV = 'production'
        process.env.JWT_SECRET = 'short'
        process.env.DATABASE_URL = 'postgresql://test'

        await expect(() => import('./env')).rejects.toThrow('JWT_SECRET must be at least 32 characters long')
    })

    it('should throw when DATABASE_URL is missing', async () => {
        process.env.NODE_ENV = 'development'
        delete process.env.DATABASE_URL

        // In dev mode the error is caught and logged, not thrown
        // But the getEnvVar function itself throws
        await expect(() => import('./env')).rejects.toThrow('Missing required environment variable: DATABASE_URL')
    })
})
