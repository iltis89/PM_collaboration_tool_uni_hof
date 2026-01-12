/**
 * Standardized result type for all server actions.
 * Provides consistent error handling across the application.
 */

/**
 * Success result with typed data
 */
export interface ActionSuccess<T> {
    success: true
    data: T
}

/**
 * Error result with message
 */
export interface ActionError {
    success: false
    error: string
    code?: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION' | 'RATE_LIMITED' | 'INTERNAL'
}

/**
 * Union type for action results
 */
export type ActionResult<T> = ActionSuccess<T> | ActionError

/**
 * Helper to create a success result
 */
export function success<T>(data: T): ActionSuccess<T> {
    return { success: true, data }
}

/**
 * Helper to create an error result
 */
export function error(message: string, code?: ActionError['code']): ActionError {
    return { success: false, error: message, code }
}

/**
 * Helper to wrap async operations with error handling
 */
export async function safeAction<T>(
    fn: () => Promise<T>,
    errorMessage = 'Ein Fehler ist aufgetreten'
): Promise<ActionResult<T>> {
    try {
        const data = await fn()
        return success(data)
    } catch (err) {
        console.error('Action error:', err)
        const message = err instanceof Error ? err.message : errorMessage
        return error(message, 'INTERNAL')
    }
}
