import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { ChevronRightRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Breadcrumb',
	description:
		'A navigation landmark that shows where a page sits in the hierarchy above it, in three sizes and with room for an overflow menu.',
	keywords: ['breadcrumb', 'breadcrumbs', 'navigation', 'trail', 'hierarchy', 'svelte'],
	canonical: '/docs/components/breadcrumb',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Breadcrumb — Fluent UI Svelte',
		description: 'A Fluent UI Svelte breadcrumb with three sizes, icons and room for an overflow menu.',
		type: 'article',
		url: '/docs/components/breadcrumb',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Breadcrumb — Fluent UI Svelte',
		description: 'A Fluent UI Svelte breadcrumb with three sizes, icons and room for an overflow menu.'
	},
	// Library-only
	slug: 'breadcrumb',
	status: 'New',
	icon: ChevronRightRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
