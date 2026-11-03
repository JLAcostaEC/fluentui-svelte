import type { Meta } from '#types';
import { StarRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Rating',
	description: 'A control that lets users give a value to an item by selecting one of a row of stars.',
	keywords: ['rating', 'stars', 'star rating', 'review', 'score', 'feedback', 'svelte'],
	canonical: '/docs/components/rating',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Rating — Fluent UI Svelte',
		description: 'A Fluent UI Svelte control for giving a value to an item by selecting one of a row of stars.',
		type: 'article',
		url: '/docs/components/rating',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Rating — Fluent UI Svelte',
		description: 'A Fluent UI Svelte control for giving a value to an item by selecting one of a row of stars.'
	},
	// Library-only
	slug: 'rating',
	status: 'New',
	icon: StarRegular
};
