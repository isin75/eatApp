'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'

// Карточки меню с иконками Iconify
const links = [
	{
		name: 'Закуски',
		href: '/menu?type=snacks',
		icon: 'twemoji:green-salad',
	},
	{
		name: 'Супы',
		href: '/menu?type=soups',
		icon: 'twemoji:pot-of-food',
	},
	{
		name: 'Основные блюда',
		href: '/menu?type=mainCourses',
		icon: 'twemoji:cut-of-meat',
	},
	{
		name: 'Гарниры',
		href: '/menu?type=sideDishes',
		icon: 'twemoji:curry-rice',
	},
	{
		name: 'Пицца',
		href: '/menu?type=pizza',
		icon: 'twemoji:pizza',
	},
	{
		name: 'Паста и лапша',
		href: '/menu?type=pastaAndNoodles',
		icon: 'twemoji:steaming-bowl',
	},
	{
		name: 'Десерты',
		href: '/menu?type=desserts',
		icon: 'twemoji:pie',
	},
	{
		name: 'Напитки',
		href: '/menu?type=drinks',
		icon: 'twemoji:cocktail-glass',
	},
]

export default function NavLinks() {
	const searchParams = useSearchParams()
	const currentType = searchParams.get('type') || 'all'

	return (
		<>
			{links.map(link => (
				<Link
					key={link.name}
					href={link.href}
					className={clsx(
						'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
						{
							'bg-sky-100 text-blue-600':
								`/menu?type=${currentType}` === link.href,
						}
					)}
				>
					<Icon icon={link.icon} className='w-6 h-6 text-gray-700' />
					<p className='hidden md:block'>{link.name}</p>
				</Link>
			))}
		</>
	)
}
