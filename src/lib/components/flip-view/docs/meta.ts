import type { Meta } from '#types';
import { ImageMultipleRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	title: 'FlipView',
	description: 'Shows one item at a time, such as images or sections, and flips through them.',
	keywords: ['flip view', 'flipview', 'carousel', 'slider', 'slideshow', 'gallery', 'svelte'],
	canonical: '/docs/components/flip-view',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'FlipView — Fluent UI Svelte',
		description: 'Flip through images or sections one at a time.',
		type: 'article',
		url: '/docs/components/flip-view',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'FlipView — Fluent UI Svelte',
		description: 'Flip through images or sections one at a time.'
	},
	slug: 'flip-view',
	status: 'AI',
	icon: ImageMultipleRegular
};
