import type { Meta } from '#types';
import { PaddingDownRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Expander',
	description: 'A control that displays a header and a collapsible content area that can expand up or down.',
	keywords: ['expander', 'accordion', 'collapsible', 'disclosure', 'details', 'svelte'],
	canonical: '/docs/components/expander',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Expander — Fluent UI Svelte',
		description: 'A Fluent UI Svelte expander with a header and a collapsible content area.',
		type: 'article',
		url: '/docs/components/expander',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Expander — Fluent UI Svelte',
		description: 'A Fluent UI Svelte expander with a header and a collapsible content area.'
	},
	// Library-only
	slug: 'expander',
	status: '',
	icon: PaddingDownRegular
};
