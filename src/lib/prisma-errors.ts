/**
 * Prisma error handling utilities.
 * Provides user-friendly error messages for common database errors.
 */

import { Prisma } from '@prisma/client'

/**
 * Known Prisma error codes and their user-friendly messages.
 */
const PRISMA_ERROR_MESSAGES: Record<string, string> = {
    'P2002': 'Ein Eintrag mit diesen Daten existiert bereits.',
    'P2003': 'Verknüpfter Datensatz nicht gefunden.',
    'P2025': 'Datensatz nicht gefunden.',
    'P2014': 'Diese Änderung würde eine erforderliche Beziehung verletzen.',
    'P2021': 'Datenbanktabelle existiert nicht.',
    'P2024': 'Zeitüberschreitung bei der Datenbankverbindung.',
}

/**
 * Translates Prisma errors to user-friendly messages.
 */
export function translatePrismaError(error: unknown): string {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return PRISMA_ERROR_MESSAGES[error.code] || `Datenbankfehler: ${error.code}`
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return 'Ungültige Daten für die Datenbank.'
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
        console.error('Prisma Rust panic:', error)
        return 'Kritischer Datenbankfehler. Bitte später erneut versuchen.'
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error('Prisma initialization error:', error)
        return 'Datenbankverbindung fehlgeschlagen.'
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        console.error('Prisma unknown error:', error)
        return 'Unbekannter Datenbankfehler.'
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'Ein unerwarteter Fehler ist aufgetreten.'
}

/**
 * Checks if error is a "not found" error.
 */
export function isNotFoundError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

/**
 * Checks if error is a "unique constraint" error.
 */
export function isUniqueConstraintError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}
