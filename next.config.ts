import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'my-next-app-bucket1.s3.eu-north-1.amazonaws.com',
			},
		],
	},
}

export default nextConfig
