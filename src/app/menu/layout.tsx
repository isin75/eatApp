/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Suspense, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SideNav from '@/app/ui/menu/sidenav'
import { Provider } from 'react-redux'
import store from '../store/store'
import { SessionProvider, useSession } from 'next-auth/react'
import { Button } from '../ui/button'
import { XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { decrementItem, incrementItem } from '../store/orderSlice'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<SessionProvider>
				<Suspense fallback={<p>Loading menu...</p>}>
					<LayoutContent>{children}</LayoutContent>
				</Suspense>
			</SessionProvider>
		</Provider>
	)
}

// Вынес логику в отдельный компонент, чтобы он рендерился внутри <Provider>
function LayoutContent({ children }: { children: React.ReactNode }) {
	const [isCartOpen, setIsCartOpen] = useState(false)
	const { data: session } = useSession()

	// Получаем товары из Redux
	const cartItem = useSelector((state: any) => state.order?.order ?? [])

	const dispatch = useDispatch()

	const handleOrder = async () => {
		if (cartItem.length === 0) {
			alert('Корзина пуста')
			return
		}

		try {
			const response = await fetch('/api/email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					cartItem,
					name: session?.user?.name ?? null,
				}),
			})
			console.log(response)
			const result = await response.json()
			if (result.success) {
				alert('Заказ оформлен! Вам придет подтверждение на почту.')
			} else {
				alert('Ошибка при оформлении заказа.')
			}
		} catch (error) {
			console.error('Ошибка:', error)
			alert('Ошибка сервера')
		}
	}
	return (
		<div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
			<div className='w-full flex-none md:w-64'>
				<SideNav />
			</div>
			<div className='flex-grow p-6 md:overflow-y-auto md:p-12'>{children}</div>

			{/* Кнопка корзины */}
			<Button
				className='fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600'
				onClick={() => setIsCartOpen(!isCartOpen)}
			>
				<ShoppingCartIcon className='w-6 h-6' />
			</Button>

			{/* Выезжающая корзина */}
			<div
				className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl transition-transform duration-300 ${
					isCartOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				{/* Заголовок корзины */}
				<div className='p-4 border-b flex justify-between items-center'>
					<h2 className='text-lg font-bold'>Корзина</h2>
					<button onClick={() => setIsCartOpen(false)}>
						<XMarkIcon className='w-6 h-6' />
					</button>
				</div>

				{/* Товары */}
				<div className='p-4 flex flex-col space-y-4'>
					{cartItem.length > 0 ? (
						cartItem.map((item: any) => (
							<div
								key={item.id}
								className='flex justify-between items-center border-b pb-2'
							>
								<span>{item.title}</span>
								<div className='flex items-center space-x-2'>
									{/* Кнопка уменьшения количества */}
									<button
										onClick={() => dispatch(decrementItem(item.id))}
										className={clsx(
											'flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
										)}
									>
										-
									</button>
									<span className='text-lg font-bold'>{item.count}</span>
									{/* Кнопка увеличения количества */}
									<button
										onClick={() => dispatch(incrementItem(item.id))}
										className={clsx(
											'flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
										)}
									>
										+
									</button>
								</div>
							</div>
						))
					) : (
						<p className='text-center text-gray-500'>Корзина пуста</p>
					)}
				</div>

				{/* Кнопка заказа */}
				<div className='absolute bottom-4 left-0 right-0 p-4'>
					<Button
						className='w-full bg-green-500 hover:bg-green-600 text-white'
						onClick={handleOrder}
					>
						Оформить заказ
					</Button>
				</div>
			</div>
		</div>
	)
}
