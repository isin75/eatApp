import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import { prisma } from '@/app/lib/prisma'

const s3 = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
})

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData()

		const name = formData.get('name') as string
		const description = formData.get('description') as string
		const guide = formData.get('guide') as string
		const cookedTime = formData.get('cookedTime') as string
		const tags = formData.get('tags') as string
		const type = formData.get('type') as string
		const file = formData.get('image') as File | null

		if (!name || !description || !guide || !cookedTime || !tags || !type) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 }
			)
		}

		let fileUrl = '' // Пустая строка вместо null

		if (file) {
			const fileBuffer = Buffer.from(await file.arrayBuffer())
			const fileName = `${randomUUID()}-${file.name}`

			try {
				await s3.send(
					new PutObjectCommand({
						Bucket: process.env.AWS_BUCKET_NAME!,
						Key: fileName,
						Body: fileBuffer,
						ContentType: file.type || 'application/octet-stream',
					})
				)
				fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
				console.log('File uploaded to S3:', fileUrl) // Лог;
			} catch (error) {
				console.error('Error uploading file to S3:', error)
				return NextResponse.json(
					{ error: 'File upload failed' },
					{ status: 500 }
				)
			}
		} else {
			console.error('No file found')
		}

		const dish = await prisma.dishes.create({
			data: {
				name,
				description,
				guide,
				cookedTime,
				tags: tags.split(',').map(tag => tag.trim()),
				type,
				image: fileUrl,
			},
		})

		return NextResponse.json({ success: true, dish }, { status: 200 })
	} catch (error) {
		console.error('Error during dish creation:', error)
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
