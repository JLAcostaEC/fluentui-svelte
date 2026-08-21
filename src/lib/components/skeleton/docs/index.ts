import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { LineStyleRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Skeleton',
	description: 'A placeholder that indicates where content will appear while it is loading.',
	keywords: ['skeleton', 'placeholder', 'loading', 'shimmer', 'content loader', 'svelte'],
	canonical: '/docs/components/skeleton',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Skeleton — Fluent UI Svelte',
		description: 'A Fluent UI Svelte loading placeholder that shows where content will appear.',
		type: 'article',
		url: '/docs/components/skeleton',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Skeleton — Fluent UI Svelte',
		description: 'A Fluent UI Svelte loading placeholder that shows where content will appear.'
	},
	// Library-only
	slug: 'skeleton',
	status: '',
	icon: LineStyleRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
