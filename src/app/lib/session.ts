import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const key = new TextEncoder().encode(process.env.SECRET)

const cookie = {
	name: 'session',
	options: {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
	},
	duration: 24 * 60 * 60 * 1000,
}

export async function encrypt(payload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1day')
		.sign(key)
}

export async function decrypt(session) {
	try {
		const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] })
		return payload
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return null
	}
}

export async function createSession(userId: string) {
	const expires = new Date(Date.now() + cookie.duration)
	const session = await encrypt({ userId, expires })
	console.log('createSession')

	const cookieStore = await cookies()
	cookieStore.set(cookie.name, session, {
		...cookie.options,
		sameSite: 'lax',
		expires,
	})
	redirect('/menu')
}

export async function verifySession() {
	const cookieStore = await cookies()
	const cookie = cookieStore.get(cookies.name)?.value
	const session = await decrypt(cookie)
	if (!session?.userId || typeof session.userId !== 'string') {
		redirect('/login')
	}
	return { userId: session.userId }
}

export async function deleteSession() {
	const cookieStore = await cookies()
	cookieStore.delete(cookie.name)
	redirect('/login')
}
