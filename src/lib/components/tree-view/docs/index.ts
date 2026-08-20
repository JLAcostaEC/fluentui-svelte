import TextBulletListTreeRegular from 'fluentui-icons-svelte/TextBulletListTreeRegular.svelte';
import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';

export const META: Meta = {
	// SEO
	title: 'Tree View',
	description: 'A hierarchical, nested list where each item can be expanded, checked, or selected.',
	keywords: ['tree view', 'tree', 'hierarchy', 'nested list', 'file tree', 'svelte'],
	canonical: '/docs/components/tree-view',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Tree View — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tree view for hierarchical data with expandable, checkable items.',
		type: 'article',
		url: '/docs/components/tree-view',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tree View — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tree view for hierarchical data with expandable, checkable items.'
	},
	// Library-only
	slug: 'tree-view',
	status: 'Experimental',
	icon: TextBulletListTreeRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
