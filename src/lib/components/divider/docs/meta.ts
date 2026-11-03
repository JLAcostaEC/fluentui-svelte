import type { Meta } from '#types';
import { DividerShortRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Divider',
	description: 'A horizontal or vertical rule that visually separates content within a layout, with an optional label.',
	keywords: ['divider', 'separator', 'rule', 'hr', 'layout', 'svelte'],
	canonical: '/docs/components/divider',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Divider — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte divider that separates content horizontally or vertically, with an optional label.',
		type: 'article',
		url: '/docs/components/divider',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Divider — Fluent UI Svelte',
		description: 'A Fluent UI Svelte divider that separates content horizontally or vertically, with an optional label.'
	},
	// Library-only
	slug: 'divider',
	status: '',
	icon: DividerShortRegular
};
