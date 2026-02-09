import { NextResponse, type NextRequest } from 'next/server'
import { updateSession, decrypt } from '@/lib/auth'

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const session = request.cookies.get('session')?.value
    const parsedSession = session ? await decrypt(session) : null

    // All matcher routes are protected routes
    if (!parsedSession) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Admin protection
    if (pathname.startsWith('/admin') && parsedSession?.user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Refresh cookie expiry with already parsed token to avoid double decrypt
    const refreshedResponse = await updateSession(request, parsedSession)
    if (refreshedResponse) {
        return refreshedResponse
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/collaboration/:path*',
        '/exam-prep/:path*',
        '/materials/:path*',
        '/audio-learning/:path*',
        '/change-password/:path*',
    ],
}
