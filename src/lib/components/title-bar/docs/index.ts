import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { AppTitleRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'TitleBar',
	description:
		'The top bar of an app shell, laid out like a Windows 11 title bar: navigation and app identity at the start, a flexible search at the center, and the person picture and window controls at the end.',
	keywords: [
		'title bar',
		'titlebar',
		'app shell',
		'window controls',
		'caption buttons',
		'search',
		'windows 11',
		'svelte'
	],
	canonical: '/docs/components/title-bar',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'TitleBar — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte title bar with back and navigation buttons, app identity, a collapsible search and window controls.',
		type: 'article',
		url: '/docs/components/title-bar',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'TitleBar — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte title bar with back and navigation buttons, app identity, a collapsible search and window controls.'
	},
	// Library-only
	slug: 'title-bar',
	status: 'New',
	icon: AppTitleRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
