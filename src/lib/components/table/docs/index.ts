import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TableRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Table',
	description:
		'A low level set of primitives to display two dimensional data, with support for sorting, selection and custom cell layouts.',
	keywords: ['table', 'data table', 'grid', 'sortable table', 'table row', 'svelte'],
	canonical: '/docs/components/table',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Table — Fluent UI Svelte',
		description: 'A Fluent UI Svelte table with sorting, selection and custom cell layouts.',
		type: 'article',
		url: '/docs/components/table',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Table — Fluent UI Svelte',
		description: 'A Fluent UI Svelte table with sorting, selection and custom cell layouts.'
	},
	// Library-only
	slug: 'table',
	status: 'AI',
	icon: TableRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
