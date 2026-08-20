import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TextboxAlignMiddleRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Flyout',
	description: 'A floating panel that displays additional information or options in a non-intrusive, accessible way.',
	keywords: ['flyout', 'popover', 'floating panel', 'overlay', 'floating ui', 'svelte'],
	canonical: '/docs/components/flyout',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Flyout — Fluent UI Svelte',
		description: 'A Fluent UI Svelte floating panel for showing extra information or options non-intrusively.',
		type: 'article',
		url: '/docs/components/flyout',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Flyout — Fluent UI Svelte',
		description: 'A Fluent UI Svelte floating panel for showing extra information or options non-intrusively.'
	},
	// Library-only
	slug: 'flyout',
	status: '',
	icon: TextboxAlignMiddleRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
