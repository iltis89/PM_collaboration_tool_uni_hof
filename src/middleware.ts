import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession, decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    // 1. Update session if it exists (extend expiry)
    await updateSession(request)

    const session = request.cookies.get('session')?.value
    const parsedSession = session ? await decrypt(session) : null

    // 2. Protect routes
    if (request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/collaboration') ||
        request.nextUrl.pathname.startsWith('/exam-prep')) {

        if (!parsedSession) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // 3. Admin protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (parsedSession?.user?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
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
