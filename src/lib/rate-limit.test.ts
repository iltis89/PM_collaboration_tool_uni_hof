/**
 * Unit tests for the rate limiting module.
 * Tests cover the core functionality of the brute-force protection system.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isRateLimited, recordFailedAttempt, clearRateLimit, cleanupRateLimits } from './rate-limit'

describe('rate-limit', () => {
    beforeEach(() => {
        // Clear any existing rate limits before each test
        clearRateLimit('test-user')
        clearRateLimit('test-user-2')
    })

    describe('isRateLimited', () => {
        it('should return not limited for new identifier', () => {
            const result = isRateLimited('new-identifier-12345')

            expect(result.limited).toBe(false)
            expect(result.remainingAttempts).toBe(5)
            expect(result.blockedFor).toBeUndefined()

            // Cleanup
            clearRateLimit('new-identifier-12345')
        })

        it('should track remaining attempts after failures', () => {
            recordFailedAttempt('test-user')
            const result = isRateLimited('test-user')

            expect(result.limited).toBe(false)
            expect(result.remainingAttempts).toBe(4)
        })

        it('should block after max attempts exceeded', () => {
            // Record 5 failed attempts (max)
            for (let i = 0; i < 5; i++) {
                recordFailedAttempt('test-user')
            }

            const result = isRateLimited('test-user')

            expect(result.limited).toBe(true)
            expect(result.remainingAttempts).toBe(0)
            expect(result.blockedFor).toBeGreaterThan(0)
        })
    })

    describe('recordFailedAttempt', () => {
        it('should increment attempts counter', () => {
            recordFailedAttempt('test-user')
            expect(isRateLimited('test-user').remainingAttempts).toBe(4)

            recordFailedAttempt('test-user')
            expect(isRateLimited('test-user').remainingAttempts).toBe(3)

            recordFailedAttempt('test-user')
            expect(isRateLimited('test-user').remainingAttempts).toBe(2)
        })

        it('should track different identifiers separately', () => {
            recordFailedAttempt('test-user')
            recordFailedAttempt('test-user')

            expect(isRateLimited('test-user').remainingAttempts).toBe(3)
            expect(isRateLimited('test-user-2').remainingAttempts).toBe(5)
        })
    })

    describe('clearRateLimit', () => {
        it('should reset rate limit for identifier', () => {
            // Add some attempts
            recordFailedAttempt('test-user')
            recordFailedAttempt('test-user')
            recordFailedAttempt('test-user')
            expect(isRateLimited('test-user').remainingAttempts).toBe(2)

            // Clear and verify reset
            clearRateLimit('test-user')
            expect(isRateLimited('test-user').remainingAttempts).toBe(5)
        })

        it('should unblock a blocked user', () => {
            // Block the user
            for (let i = 0; i < 5; i++) {
                recordFailedAttempt('test-user')
            }
            expect(isRateLimited('test-user').limited).toBe(true)

            // Clear and verify unblocked
            clearRateLimit('test-user')
            expect(isRateLimited('test-user').limited).toBe(false)
        })
    })

    describe('cleanupRateLimits', () => {
        it('should be callable without throwing', () => {
            // Just verify the cleanup function runs without error
            expect(() => cleanupRateLimits()).not.toThrow()
        })
    })

    describe('window expiry', () => {
        it('should reset attempts after window expires', () => {
            vi.useFakeTimers()
            const now = Date.now()
            vi.setSystemTime(now)

            // Record attempts
            recordFailedAttempt('test-user')
            recordFailedAttempt('test-user')
            expect(isRateLimited('test-user').remainingAttempts).toBe(3)

            // Advance time past the 15-minute window
            vi.setSystemTime(now + 16 * 60 * 1000)

            // Should be reset
            const result = isRateLimited('test-user')
            expect(result.remainingAttempts).toBe(5)
            expect(result.limited).toBe(false)

            vi.useRealTimers()
        })
    })
})
