/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'


const nextConfig = withPWA({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development',
})

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	...nextConfig,
}

