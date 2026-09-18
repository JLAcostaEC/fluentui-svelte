import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TabRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'TabView',
	description:
		'A strip of document tabs, with icons, close buttons and a new tab button, that owns the selection and leaves the content to you.',
	keywords: ['tab view', 'tabs', 'tab list', 'tab strip', 'tabbed interface', 'svelte'],
	canonical: '/docs/components/tab-view',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'TabView — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tab strip with icons, closable tabs and a new tab button.',
		type: 'article',
		url: '/docs/components/tab-view',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'TabView — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tab strip with icons, closable tabs and a new tab button.'
	},
	// Library-only
	slug: 'tab-view',
	status: 'New',
	icon: TabRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
