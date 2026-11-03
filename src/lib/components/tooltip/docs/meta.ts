import type { Meta } from '#types';
import { TooltipQuoteRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Tooltip',
	description: 'A small popup that displays additional information about an element when the user hovers over it.',
	keywords: ['tooltip', 'popup', 'hint', 'hover', 'floating ui', 'svelte'],
	canonical: '/docs/components/tooltip',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Tooltip — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tooltip that shows extra information about an element on hover.',
		type: 'article',
		url: '/docs/components/tooltip',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tooltip — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tooltip that shows extra information about an element on hover.'
	},
	// Library-only
	slug: 'tooltip',
	status: '',
	icon: TooltipQuoteRegular
};
