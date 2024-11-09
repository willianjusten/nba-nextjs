import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'GameDay',
		short_name: 'GameDay',
		description:
			'See NBA game results and standings powered by Next.js',
		display: 'standalone',
		orientation: 'portrait',
		scope: '/',
		start_url: '/',
		background_color: '#0e192c',
		theme_color: '#0e192c',
		icons: [
			{
				src: '/icon-192.png',
				type: 'image/png',
				sizes: '192x192',
			},
			{
				src: '/icon-192.png',
				type: 'image/png',
				sizes: '192x192',
				purpose: 'maskable',
			},
			{
				src: '/icon-512.png',
				type: 'image/png',
				sizes: '512x512',
			},
			{
				src: '/icon-512.png',
				type: 'image/png',
				sizes: '512x512',
				purpose: 'maskable',
			},
		],
	}
}
