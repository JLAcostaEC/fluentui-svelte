import type { Meta } from '#types';
import { TextboxAlignCenterRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Card',
	description: 'A card is a container that displays content and actions on a single topic.',
	keywords: ['card', 'container', 'content', 'actions', 'svelte'],
	canonical: '/docs/components/card',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Card — Fluent UI Svelte',
		description: 'A Fluent UI Svelte card that displays content and actions on a single topic.',
		type: 'article',
		url: '/docs/components/card',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Card — Fluent UI Svelte',
		description: 'A Fluent UI Svelte card that displays content and actions on a single topic.'
	},
	// Library-only
	slug: 'card',
	status: '',
	icon: TextboxAlignCenterRegular
};
