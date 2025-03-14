import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './app/lib/session'

export default async function middelware(req: NextRequest) {
	const protectedRoutes = ['/menu']
	const currentPath = req.nextUrl.pathname
	const isProtectedRoute = protectedRoutes.includes(currentPath)

	if (isProtectedRoute) {
		const cookieStore = await cookies()
		const cookie = cookieStore.get('session')?.value
		const session = cookie ? await decrypt(cookie) : null

		if (!session?.userId) {
			return NextResponse.redirect(new URL('/login', req.nextUrl))
		}
	}
	return NextResponse.next()
}

export const config = {
	// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
