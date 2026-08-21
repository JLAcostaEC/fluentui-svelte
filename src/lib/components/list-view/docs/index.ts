import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TaskListSquareLtrRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'List View',
	description: 'A vertically stacked set of items that can be focused, selected, and navigated with the keyboard.',
	keywords: ['list view', 'list', 'listbox', 'selection', 'keyboard navigation', 'svelte'],
	canonical: '/docs/components/list-view',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'List View — Fluent UI Svelte',
		description: 'A Fluent UI Svelte list of stacked, selectable items with keyboard navigation.',
		type: 'article',
		url: '/docs/components/list-view',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'List View — Fluent UI Svelte',
		description: 'A Fluent UI Svelte list of stacked, selectable items with keyboard navigation.'
	},
	// Library-only
	slug: 'list-view',
	status: 'Beta',
	icon: TaskListSquareLtrRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
