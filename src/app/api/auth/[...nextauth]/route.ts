import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
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
				token.role = user.role
				token.name = user.name
			}
			console.log('jwt', token, user)

			return token
		},

		async session({ session, token }) {
			if (token?.sub) {
				session.user.id = token.sub
				session.user.role = token.role
				session.user.name = token.name // Теперь роль будет в сессии
			}
			console.log('session', session)

			return session
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
	secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
