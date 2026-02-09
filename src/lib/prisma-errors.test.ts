/**
 * Unit tests for Prisma error translation utilities.
 */
import { describe, it, expect, vi } from 'vitest'
import { translatePrismaError, isNotFoundError, isUniqueConstraintError } from './prisma-errors'
import { Prisma } from '@prisma/client'

// Helper to create PrismaClientKnownRequestError
function createKnownError(code: string): Prisma.PrismaClientKnownRequestError {
    return new Prisma.PrismaClientKnownRequestError('test error', {
        code,
        clientVersion: '5.22.0',
    })
}

describe('translatePrismaError', () => {
    it('should translate P2002 (unique constraint)', () => {
        const result = translatePrismaError(createKnownError('P2002'))
        expect(result).toBe('Ein Eintrag mit diesen Daten existiert bereits.')
    })

    it('should translate P2003 (foreign key)', () => {
        const result = translatePrismaError(createKnownError('P2003'))
        expect(result).toBe('Verknüpfter Datensatz nicht gefunden.')
    })

    it('should translate P2025 (not found)', () => {
        const result = translatePrismaError(createKnownError('P2025'))
        expect(result).toBe('Datensatz nicht gefunden.')
    })

    it('should translate P2014 (relation violation)', () => {
        const result = translatePrismaError(createKnownError('P2014'))
        expect(result).toBe('Diese Änderung würde eine erforderliche Beziehung verletzen.')
    })

    it('should translate P2021 (table not found)', () => {
        const result = translatePrismaError(createKnownError('P2021'))
        expect(result).toBe('Datenbanktabelle existiert nicht.')
    })

    it('should translate P2024 (timeout)', () => {
        const result = translatePrismaError(createKnownError('P2024'))
        expect(result).toBe('Zeitüberschreitung bei der Datenbankverbindung.')
    })

    it('should handle unknown Prisma error codes', () => {
        const result = translatePrismaError(createKnownError('P9999'))
        expect(result).toBe('Datenbankfehler: P9999')
    })

    it('should handle PrismaClientValidationError', () => {
        const err = new Prisma.PrismaClientValidationError('bad input', { clientVersion: '5.22.0' })
        const result = translatePrismaError(err)
        expect(result).toBe('Ungültige Daten für die Datenbank.')
    })

    it('should handle regular Error instances', () => {
        const result = translatePrismaError(new Error('Custom error'))
        expect(result).toBe('Custom error')
    })

    it('should handle unknown error types', () => {
        const result = translatePrismaError('string error')
        expect(result).toBe('Ein unerwarteter Fehler ist aufgetreten.')
    })

    it('should handle null/undefined errors', () => {
        expect(translatePrismaError(null)).toBe('Ein unerwarteter Fehler ist aufgetreten.')
        expect(translatePrismaError(undefined)).toBe('Ein unerwarteter Fehler ist aufgetreten.')
    })
})

describe('isNotFoundError', () => {
    it('should return true for P2025', () => {
        expect(isNotFoundError(createKnownError('P2025'))).toBe(true)
    })

    it('should return false for other Prisma codes', () => {
        expect(isNotFoundError(createKnownError('P2002'))).toBe(false)
    })

    it('should return false for non-Prisma errors', () => {
        expect(isNotFoundError(new Error('not found'))).toBe(false)
    })
})

describe('isUniqueConstraintError', () => {
    it('should return true for P2002', () => {
        expect(isUniqueConstraintError(createKnownError('P2002'))).toBe(true)
    })

    it('should return false for other Prisma codes', () => {
        expect(isUniqueConstraintError(createKnownError('P2025'))).toBe(false)
    })

    it('should return false for non-Prisma errors', () => {
        expect(isUniqueConstraintError(new Error('unique'))).toBe(false)
    })
})
