'use server'

import { verifySession } from '../lib/session'

export async function banUser() {
	const session = await verifySession()
	const role = session?.role

	if (role !== 'admin') {
		return {
			status: 403,
			body: 'Forbidden',
		}
	}
}
