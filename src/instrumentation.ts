/**
 * Next.js Instrumentation Hook.
 * Runs once when the server starts — used for environment validation.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
    // Triggers env validation on server startup
    await import('@/lib/env')
}
