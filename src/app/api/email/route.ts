import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
	try {
		const {
			cartItem,
			name,
		}: { cartItem: { title: string; count: number }[]; name: string } =
			await req.json()

		if (!cartItem || cartItem.length === 0) {
			return NextResponse.json({ error: 'Order is empty' }, { status: 400 })
		}

		// Создаем SMTP-транспорт
		const transporter = nodemailer.createTransport({
			service: 'gmail', // или другой SMTP-сервер
			auth: {
				user: process.env.SMTP_EMAIL!,
				pass: process.env.SMTP_PASSWORD!,
			},
		})

		// Формируем содержимое письма
		const mailOptions = {
			from: process.env.SMTP_EMAIL!,
			to: process.env.ADMIN_EMAIL!, // Куда отправлять заказ
			subject: 'Новый заказ',
			html: `
				<h2>Новый заказ</h2>
				<p>Email клиента: ${name}</p>
				<ul>
					${cartItem.map(item => `<li>${item.title} - ${item.count} шт.</li>`).join('')}
				</ul>
			`,
		}

		// Отправляем письмо
		await transporter.sendMail(mailOptions)

		return NextResponse.json({ success: true }, { status: 200 })
	} catch (error) {
		console.error('Error sending order:', error)
		return NextResponse.json({ error: 'Failed to send order' }, { status: 500 })
	}
}
