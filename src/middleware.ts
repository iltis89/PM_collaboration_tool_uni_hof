/**
 * Next.js Middleware — canonical entry point.
 * Delegates to proxy.ts for route protection and session management.
 */
export { proxy as middleware, config } from './proxy'
