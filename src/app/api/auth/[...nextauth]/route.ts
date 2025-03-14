import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			role?: string
			name?: string | null
			email?: string | null
			image?: string | null
		}
	}
}

const handler = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				})

				if (!user || !user.password) return null

				const isValid = await bcrypt.compare(
					credentials.password,
					user.password
				)
				if (!isValid) return null

				return user
			},
		}),
	],
	session: { strategy: 'jwt' as const },
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = (user as { role?: string }).role
				token.name = user.name
			}
			console.log('jwt', token, user)

			return token
		},

		async session({ session, token }) {
			if (session.user) {
				if (token.sub) {
					session.user.id = token.sub
				}
				session.user.role = token.role as string | undefined
				session.user.name = token.name
			}
			console.log('session', session)

			return session
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
	secret: process.env.NEXTAUTH_SECRET,
})

export const { GET, POST } = handler
