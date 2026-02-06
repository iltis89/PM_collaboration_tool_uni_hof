import { NextResponse, type NextRequest } from 'next/server'
import { updateSession, decrypt } from '@/lib/auth'

const PROTECTED_PREFIXES = [
    '/dashboard',
    '/admin',
    '/collaboration',
    '/exam-prep',
    '/materials',
    '/audio-learning',
    '/change-password'
]

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const refreshedResponse = await updateSession(request)

    const session = request.cookies.get('session')?.value
    const parsedSession = session ? await decrypt(session) : null

    // 1) Protect authenticated routes
    const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))
    if (isProtectedRoute && !parsedSession) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 2) Admin protection
    if (pathname.startsWith('/admin') && parsedSession?.user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 3) Use refreshed response when a session cookie was rolled
    if (refreshedResponse) {
        return refreshedResponse
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login page (in this case root /)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|$).*)',
    ],
}
