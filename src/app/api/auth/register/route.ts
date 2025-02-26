import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
	name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
	email: z.string().email('Некорректный email'),
	password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const validatedData = registerSchema.parse(body)

		const existingUser = await prisma.user.findUnique({
			where: { email: validatedData.email },
		})

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Email all ready exit' },
				{ status: 400 }
			)
		}

		const hashedPassword = await hash(validatedData.password, 10)

		const newUser = await prisma.user.create({
			data: {
				name: validatedData.name,
				email: validatedData.email,
				password: hashedPassword,
			},
		})

		return NextResponse.json({ message: 'Register Success', user: newUser })
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 })
		}
		return NextResponse.json({ error: 'Something wrong' }, { status: 500 })
	}
}
