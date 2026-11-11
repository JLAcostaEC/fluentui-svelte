import type { Meta } from '#types';
import { VideoClipRegular } from 'fluentui-icons-svelte';
export const META: Meta = {
	// SEO
	title: 'Media Player',
	description:
		'A video player with Fluent transport controls: seek bar, volume, subtitles, playback speed, full screen and picture-in-picture, powered by Video.js.',
	keywords: ['media player', 'video player', 'video', 'transport controls', 'video.js', 'svelte'],
	canonical: '/docs/components/media-player',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Media Player — Fluent UI Svelte',
		description: 'A Fluent UI Svelte video player with transport controls, powered by Video.js.',
		type: 'article',
		url: '/docs/components/media-player',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Media Player — Fluent UI Svelte',
		description: 'A Fluent UI Svelte video player with transport controls, powered by Video.js.'
	},
	// Library-only
	slug: 'media-player',
	status: 'New',
	icon: VideoClipRegular
};
