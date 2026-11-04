import type { Meta } from '#types';
import { NavigationRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	title: 'SideNav',
	description:
		'Collapsible app navigation with an icon rail, floating overlay, nested links, custom content and a pinned footer.',
	keywords: ['side navigation', 'sidebar', 'navigation rail', 'drawer', 'app shell', 'svelte'],
	canonical: '/docs/components/side-nav',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'SideNav — Fluent UI Svelte',
		description: 'Accessible app navigation built on ListView, with collapsible and floating modes.',
		type: 'article',
		url: '/docs/components/side-nav',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'SideNav — Fluent UI Svelte',
		description: 'Collapsible app navigation with nested links and a pinned footer.'
	},
	slug: 'side-nav',
	status: 'New',
	icon: NavigationRegular
};
