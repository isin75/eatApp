/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from 'react'
import { prisma } from '../lib/prisma'
import { verifySession } from '../lib/session'
import { taintUniqueValue } from 'next/dist/server/app-render/rsc/taint'

function canViewAuditTrail(auditTrail: any, role: string) {
	return role === 'admin' ? auditTrail : null
}

function userDTO(user: any) {
	taintUniqueValue(
		'Do not pass a user session token to the client',
		user,
		user.session.token
	)
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		session: user.session,
		auditTrail: canViewAuditTrail(user.auditTrail, user.role),
	}
}

export const getUser = cache(async () => {
	console.log('User')

	const session = await verifySession()
	if (!session) {
		return null
	}
	const user = await prisma.user.findUnique({
		where: {
			id: session.userId,
		},
	})

	return userDTO(user)
})
