'use client'

import { useActionState } from 'react'
import {
	ArrowRightIcon,
	AtSymbolIcon,
	ExclamationCircleIcon,
	KeyIcon,
	UserIcon,
} from '@heroicons/react/24/outline'
import { lusitana } from './fonts'
import { Button } from './button'
import { signup } from '@/app/signup/actions'

export default function RegisterForm() {
	const [state, action, isPending] = useActionState(signup)
	// const [formData, setFormData] = useState({
	// 	name: '',
	// 	email: '',
	// 	password: '',
	// })
	// const [error, setError] = useState<string | null>(null)
	// const router = useRouter()
	// const searchParams = useSearchParams()
	// const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

	// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	setFormData({ ...formData, [e.target.name]: e.target.value })
	// }

	// const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault()
	// 	setError(null)

	// 	const res = await fetch('/api/auth/register', {
	// 		method: 'POST',
	// 		headers: { 'Content-Type': 'application/json' },
	// 		body: JSON.stringify(formData),
	// 	})

	// 	const data = await res.json()

	// 	if (!res.ok) {
	// 		setError(
	// 			typeof data.error === 'string' ? data.error : 'Ошибка регистрации'
	// 		)
	// 		return
	// 	}

	// 	router.push('/auth/signin')
	// }

	return (
		<form action={sigup} className='space-y-3'>
			<div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
				<h1 className={`${lusitana.className} mb-3 text-2xl`}>
					Please Sign in to continue.
				</h1>
				<div className='w-full'>
					<div>
						<label
							className='mb-3 mt-5 block text-xs font-medium text-gray-900'
							htmlFor='email'
						>
							Email
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='email'
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='Enter your email address'
								required
							/>
							<AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
						</div>
					</div>
					<div className='mt-4'>
						<label
							className='mb-3 mt-5 block text-xs font-medium text-gray-900'
							htmlFor='password'
						>
							Password
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='password'
								type='password'
								name='password'
								value={formData.password}
								onChange={handleChange}
								placeholder='Enter password'
								required
								minLength={6}
							/>
							<KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
						</div>
						<div className='mt-4'>
							<label
								className='mb-3 mt-5 block text-xs font-medium text-gray-900'
								htmlFor='password'
							>
								User Name
							</label>
							<div className='relative'>
								<input
									className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
									id='name'
									type='name'
									name='name'
									value={formData.name}
									onChange={handleChange}
									placeholder='Enter name'
									required
									minLength={4}
								/>
								<UserIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
							</div>
						</div>
					</div>
				</div>
				<input type='hidden' name='redirectTo' value={callbackUrl} />
				<Button className='mt-4 w-full' aria-disabled={isPending}>
					Sign in <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
				</Button>
				<div className='flex h-8 items-end space-x-1'>
					{state?.errors && (
						<>
							<ExclamationCircleIcon className='h-5 w-5 text-red-500' />
							<p className='text-sm text-red-500'>{state?.errors}</p>
						</>
					)}
				</div>
			</div>
		</form>
	)
}
