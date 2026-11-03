import type { Meta } from '#types';
import { CursorHoverRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Button',
	description: 'A button triggers an action or event when activated, with accent, standard, and subtle appearances.',
	keywords: ['button', 'split button', 'menu button', 'action', 'cta', 'svelte'],
	canonical: '/docs/components/button',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Button — Fluent UI Svelte',
		description: 'A Fluent UI Svelte button that triggers actions, with accent, standard, and subtle appearances.',
		type: 'article',
		url: '/docs/components/button',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Button — Fluent UI Svelte',
		description: 'A Fluent UI Svelte button that triggers actions, with accent, standard, and subtle appearances.'
	},
	// Library-only
	slug: 'button',
	status: '',
	icon: CursorHoverRegular
};
