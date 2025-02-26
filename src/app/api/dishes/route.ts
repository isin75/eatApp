import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const type = searchParams.get('type')

		let dishes

		if (type) {
			dishes = await prisma.dishes.findMany({
				where: { type },
			})
		} else {
			dishes = await prisma.dishes.findMany()
		}

		return NextResponse.json(dishes, { status: 200 })
	} catch (error) {
		console.error('Error fetching dishes:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch dishes' },
			{ status: 500 }
		)
	}
}
