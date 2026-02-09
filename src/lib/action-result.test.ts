/**
 * Unit tests for ActionResult helpers.
 */
import { describe, it, expect } from 'vitest'
import { success, error, safeAction, type ActionResult } from './action-result'

describe('success', () => {
    it('should create a success result with data', () => {
        const result = success({ id: '123', name: 'Test' })

        expect(result.success).toBe(true)
        expect(result.data).toEqual({ id: '123', name: 'Test' })
    })

    it('should handle null data', () => {
        const result = success(null)
        expect(result.success).toBe(true)
        expect(result.data).toBeNull()
    })

    it('should handle primitive data', () => {
        const result = success(42)
        expect(result.data).toBe(42)
    })
})

describe('error', () => {
    it('should create an error result with message', () => {
        const result = error('Something went wrong')

        expect(result.success).toBe(false)
        expect(result.error).toBe('Something went wrong')
        expect(result.code).toBeUndefined()
    })

    it('should include error code when provided', () => {
        const result = error('Not found', 'NOT_FOUND')

        expect(result.success).toBe(false)
        expect(result.error).toBe('Not found')
        expect(result.code).toBe('NOT_FOUND')
    })

    it('should accept all valid error codes', () => {
        const codes = ['UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'VALIDATION', 'RATE_LIMITED', 'INTERNAL'] as const
        codes.forEach(code => {
            const result = error('test', code)
            expect(result.code).toBe(code)
        })
    })
})

describe('safeAction', () => {
    it('should wrap successful async operations', async () => {
        const result = await safeAction(async () => ({ value: 42 }))

        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data).toEqual({ value: 42 })
        }
    })

    it('should catch errors and return error result', async () => {
        const result = await safeAction(async () => {
            throw new Error('DB connection failed')
        })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error).toBe('DB connection failed')
            expect(result.code).toBe('INTERNAL')
        }
    })

    it('should use custom error message for non-Error throws', async () => {
        const result = await safeAction(async () => {
            throw 'string error'
        }, 'Benutzerdefinierter Fehler')

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error).toBe('Benutzerdefinierter Fehler')
        }
    })

    it('should use default error message for non-Error throws', async () => {
        const result = await safeAction(async () => {
            throw 42
        })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error).toBe('Ein Fehler ist aufgetreten')
        }
    })
})

describe('type narrowing', () => {
    it('should allow type-safe access after success check', () => {
        const result: ActionResult<{ name: string }> = success({ name: 'test' })

        if (result.success) {
            // TypeScript should allow this without error
            expect(result.data.name).toBe('test')
        }
    })

    it('should allow type-safe access after error check', () => {
        const result: ActionResult<string> = error('failed', 'NOT_FOUND')

        if (!result.success) {
            expect(result.error).toBe('failed')
            expect(result.code).toBe('NOT_FOUND')
        }
    })
})
