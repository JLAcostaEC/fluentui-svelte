import type { Meta } from '#types';
import { LinkRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Hyperlink',
	description:
		'A clickable link that navigates to a specified URL, following Fluent UI design principles with built-in accessibility.',
	keywords: ['hyperlink', 'link', 'anchor', 'navigation', 'href', 'svelte'],
	canonical: '/docs/components/hyperlink',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Hyperlink — Fluent UI Svelte',
		description: 'A Fluent UI Svelte link component for navigating to a URL with accessible defaults.',
		type: 'article',
		url: '/docs/components/hyperlink',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Hyperlink — Fluent UI Svelte',
		description: 'A Fluent UI Svelte link component for navigating to a URL with accessible defaults.'
	},
	// Library-only
	slug: 'hyperlink',
	status: '',
	icon: LinkRegular
};
