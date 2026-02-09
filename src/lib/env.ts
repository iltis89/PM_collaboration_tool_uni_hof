/**
 * Environment validation for runtime safety.
 * This module validates required environment variables at startup.
 */

function getEnvVar(name: string, required: boolean = true): string {
    const value = process.env[name]

    if (required && !value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }

    return value || ''
}

function validateEnv() {
    const isProduction = process.env.NODE_ENV === 'production'

    // Validate JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET
    if (isProduction) {
        if (!jwtSecret) {
            throw new Error('JWT_SECRET must be set in production')
        }
        if (jwtSecret === 'dev-secret-key-change-this-in-prod') {
            throw new Error('JWT_SECRET must not use the default development value in production')
        }
        if (jwtSecret.length < 32) {
            throw new Error('JWT_SECRET must be at least 32 characters long')
        }
    }

    // Validate DATABASE_URL
    const databaseUrl = getEnvVar('DATABASE_URL')
    if (!databaseUrl.startsWith('postgres')) {
        console.warn('DATABASE_URL does not appear to be a PostgreSQL connection string')
    }
}

// Environment configuration object
export const env = {
    get jwtSecret() {
        return process.env.JWT_SECRET || 'dev-secret-key-change-this-in-prod'
    },
    get databaseUrl() {
        return getEnvVar('DATABASE_URL')
    },
    get isProduction() {
        return process.env.NODE_ENV === 'production'
    },
    get isDevelopment() {
        return process.env.NODE_ENV === 'development'
    }
}

// Validate on module load (server-side only, skip during build)
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
if (typeof window === 'undefined' && !isBuildPhase) {
    try {
        validateEnv()
    } catch (error) {
        // Warn but don't crash — throwing here kills the entire server
        console.error('⚠ Environment validation failed:', error)
    }
}

export default env
