'use server'

import bcrypt from 'bcryptjs'
import { SignupFormSchema } from '@/app/lib/definitions'
import { prisma } from '../lib/prisma'
import { createSession } from '../lib/session'

export async function signup(state, formData) {
	const validationResult = SignupFormSchema.safeParse({
		name: formData.get('name'),
		email: formData.get('email'),
		password: formData.get('password'),
	})

	if (!validationResult.success) {
		return {
			status: 400,
			errors: validationResult.error.flatten().fieldErrors,
		}
	}
	const [name, email, password] = validationResult.data
	const existingUser = await prisma.user.findUnique({
		where: { email },
	})

	if (existingUser) {
		return {
			status: 400,
			errors: { email: 'Email already exists' },
		}
	}
	const hashedPassword = await bcrypt.hash(password, 10)

	const newUser = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	})

	await createSession(newUser.id)
}
