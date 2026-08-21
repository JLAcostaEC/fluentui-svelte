import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TextboxMoreRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Menu',
	description:
		'A dropdown list of actions or options, with support for groups, submenus, checkable items, and context menus.',
	keywords: ['menu', 'dropdown menu', 'context menu', 'submenu', 'menu item', 'svelte'],
	canonical: '/docs/components/menu',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Menu — Fluent UI Svelte',
		description: 'A Fluent UI Svelte menu with groups, submenus, checkable items, and context-menu support.',
		type: 'article',
		url: '/docs/components/menu',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Menu — Fluent UI Svelte',
		description: 'A Fluent UI Svelte menu with groups, submenus, checkable items, and context-menu support.'
	},
	// Library-only
	slug: 'menu',
	status: '',
	icon: TextboxMoreRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
