/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useState } from 'react'
import {
	PhotoIcon,
	TagIcon,
	PencilIcon,
	ClockIcon,
} from '@heroicons/react/24/outline'
import { Button } from './button'

export default function DishForm() {
	const [formData, setFormData] = useState({
		image: null as File | null,
		name: '',
		description: '',
		guide: '',
		cookedTime: '',
		tags: '',
		type: '',
	})
	const [previewImage, setPreviewImage] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const image = e.target.files?.[0] || null

		if (image) {
			setFormData(prev => ({ ...prev, image }))
			setPreviewImage(URL.createObjectURL(image))
		} else {
			console.log('No file selected')
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setMessage(null)

		const formDataToSend = new FormData()
		formDataToSend.append('name', formData.name)
		formDataToSend.append('description', formData.description)
		formDataToSend.append('guide', formData.guide)
		formDataToSend.append('cookedTime', formData.cookedTime)
		formDataToSend.append('tags', formData.tags)
		formDataToSend.append('type', formData.type)

		if (formData.image) {
			console.log('Appending image to form data', formData.image)
			formDataToSend.append('image', formData.image)
		} else {
			console.log('No image found to append')
		}

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formDataToSend,
			})
			const result = await response.json()

			if (result.success) {
				setMessage('Dish added successfully!')
				setFormData({
					image: null,
					name: '',
					description: '',
					guide: '',
					cookedTime: '',
					tags: '',
					type: '',
				})
				setPreviewImage(null)
			} else {
				setMessage('Failed to add dish. Try again.')
			}
		} catch (error) {
			setMessage('Something went wrong!')
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		if (formData.image) {
			const objectUrl = URL.createObjectURL(formData.image)
			setPreviewImage(objectUrl)

			return () => URL.revokeObjectURL(objectUrl)
		}
	}, [formData.image])

	return (
		<form onSubmit={handleSubmit} className='space-y-3'>
			<div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
				<h1 className='mb-3 text-2xl font-semibold text-gray-900'>
					Add a New Dish
				</h1>
				{message && <p className='text-sm text-center'>{message}</p>}
				<div className='w-full space-y-4'>
					{typeof window !== 'undefined' && previewImage && (
						<div className='mb-3'>
							<img
								src={previewImage}
								alt='Preview'
								className='w-full h-48 object-cover rounded-md border'
							/>
						</div>
					)}

					<div>
						<label
							className='block text-xs font-medium text-gray-900'
							htmlFor='image'
						>
							Upload Image
						</label>
						<div className='relative'>
							<input
								className='block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500'
								id='image'
								type='file'
								name='image'
								accept='image/*'
								onInput={handleFileChange}
								required
							/>
							<PhotoIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500' />
						</div>
					</div>

					<div>
						<label
							className='block text-xs font-medium text-gray-900'
							htmlFor='name'
						>
							Dish Name
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='name'
								type='text'
								name='name'
								value={formData.name}
								onChange={handleChange}
								placeholder='Enter dish name'
								required
							/>
							<PencilIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500' />
						</div>
					</div>

					<div>
						<label
							className='block text-xs font-medium text-gray-900'
							htmlFor='description'
						>
							Description
						</label>
						<textarea
							className='w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500'
							id='description'
							name='description'
							value={formData.description}
							onChange={handleChange}
							placeholder='Enter description'
							required
						/>
					</div>

					<div>
						<label
							className='block text-xs font-medium text-gray-900'
							htmlFor='guide'
						>
							Cooking Guide
						</label>
						<textarea
							className='w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500'
							id='guide'
							name='guide'
							value={formData.guide}
							onChange={handleChange}
							placeholder='Enter cooking guide'
							required
						/>
					</div>

					<div>
						<label
							className='block text-xs font-medium text-gray-900'
							htmlFor='cookedTime'
						>
							Cooking Time
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='cookedTime'
								type='text'
								name='cookedTime'
								value={formData.cookedTime}
								onChange={handleChange}
								placeholder='e.g., 30 minutes'
								required
							/>
							<ClockIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500' />
						</div>
					</div>

					<div>
						<label
							className='block text-xs font-medium text-gray-900'
							htmlFor='tags'
						>
							Tags (comma-separated)
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='tags'
								type='text'
								name='tags'
								value={formData.tags}
								onChange={handleChange}
								placeholder='e.g., spicy, vegetarian, gluten-free'
							/>
							<TagIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500' />
						</div>
					</div>

					<div>
						<label
							className='block text-xs font-medium text-gray-900'
							htmlFor='type'
						>
							Dish Type
						</label>
						<input
							className='peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500'
							id='type'
							type='text'
							name='type'
							value={formData.type}
							onChange={handleChange}
							placeholder='e.g., main course, dessert'
							required
						/>
					</div>
				</div>

				<Button type='submit' className='mt-4 w-full' aria-disabled={loading}>
					{loading ? 'Adding...' : 'Add Dish'}
				</Button>
			</div>
		</form>
	)
}
