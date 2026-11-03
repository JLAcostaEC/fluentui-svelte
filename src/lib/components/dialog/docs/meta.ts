import type { Meta } from '#types';
import { ReadingModeMobileRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Dialog',
	description:
		'A window overlaid on the page that requires user attention, composed of trigger, surface, title, content, and actions.',
	keywords: ['dialog', 'modal', 'popup', 'overlay', 'alert dialog', 'svelte'],
	canonical: '/docs/components/dialog',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Dialog — Fluent UI Svelte',
		description: 'A Fluent UI Svelte dialog window composed of trigger, surface, title, content, and actions.',
		type: 'article',
		url: '/docs/components/dialog',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Dialog — Fluent UI Svelte',
		description: 'A Fluent UI Svelte dialog window composed of trigger, surface, title, content, and actions.'
	},
	// Library-only
	slug: 'dialog',
	status: '',
	icon: ReadingModeMobileRegular
};
