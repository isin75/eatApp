import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
	const users = await prisma.user.findMany()
	return NextResponse.json(users)
}

export async function POST(req: Request) {
	const { name, email } = await req.json()
	const newUser = await prisma.user.create({
		data: { name, email },
	})
	return NextResponse.json(newUser)
}
