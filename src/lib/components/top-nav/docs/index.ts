import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { NavigationRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'TopNav',
	description:
		'A row of navigation items with a bar that travels to whichever one is selected, in four appearances and three sizes.',
	keywords: ['top nav', 'tab list', 'tabs', 'navigation', 'tab strip', 'svelte'],
	canonical: '/docs/components/top-nav',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'TopNav — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tab list with a selection bar that travels between items.',
		type: 'article',
		url: '/docs/components/top-nav',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'TopNav — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tab list with a selection bar that travels between items.'
	},
	// Library-only
	slug: 'top-nav',
	status: 'New',
	icon: NavigationRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
