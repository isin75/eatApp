'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
	PlusIcon,
	MinusIcon,
	ShoppingCartIcon,
} from '@heroicons/react/24/outline'

import { Button } from './button'
import { Dish } from '../menu/page'
import { useDispatch } from 'react-redux'
import { addItem } from '../store/orderSlice'

export default function DishCard({ dishes }: { dishes: Dish[] }) {
	const [count, setCount] = useState(0)
	const dispatch = useDispatch()

	const handleAddToCart = (id: string, name: string, count: number) => {
		dispatch(addItem({ id, title: name, count }))
	}

	const increment = () => setCount(count + 1)
	const decrement = () => (count === 0 ? 0 : setCount(count - 1))

	return (
		<>
			{dishes?.map((dish: Dish) => (
				<div key={dish.id} className='p-4 border rounded-lg shadow'>
					<Image
						width={50}
						height={30}
						src={dish.image}
						alt={dish.name}
						className='w-full h-40 object-cover rounded'
					/>
					<h2 className='text-lg font-bold mt-2'>{dish.name}</h2>
					<p className='text-sm text-gray-600'>{dish.description}</p>
					<div className='flex justify-between items-center mt-4'>
						{dish.tags.map(tag => {
							return (
								<p key={tag} className='text-sm text-gray-600'>
									{tag}
								</p>
							)
						})}
						<div className='flex items-center space-x-2'>
							<Button onClick={decrement}>
								<MinusIcon color='white' className='h-5 w-5 text-white' />
							</Button>
							<p className='w-5 text-center'>{count}</p>
							<Button onClick={increment}>
								<PlusIcon className='h-5 w-5' />
							</Button>
						</div>
						<Button
							onClick={() => handleAddToCart(dish.id, dish.name, count)}
							className='bg-blue-500 text-white px-4 py-2 rounded'
						>
							<ShoppingCartIcon className='h-5 w-5' />
						</Button>
					</div>
				</div>
			))}
		</>
	)
}
