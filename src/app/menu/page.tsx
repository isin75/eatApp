'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import DishCard from '../ui/dishes-card'

export type Dish = {
	id: number
	name: string
	description: string
	image: string
	type: string
	tags: string[]
}

export default function Menu() {
	const [dishes, setDishes] = useState<Dish[]>([])
	const [loading, setLoading] = useState(true)
	const searchParams = useSearchParams()
	const currentType = searchParams.get('type') || 'all'

	useEffect(() => {
		setLoading(true)
		const fetchDishes = async () => {
			try {
				const res = await fetch(`/api/dishes?type=${currentType}`)
				const data = await res.json()
				setDishes(data)
			} catch (error) {
				console.error('Error fetching dishes:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchDishes()
	}, [currentType])

	if (loading) return <p>Loading...</p>

	return (
		<div className='grid grid-cols-3 gap-4'>
			<DishCard dishes={dishes} />
		</div>
	)
}
