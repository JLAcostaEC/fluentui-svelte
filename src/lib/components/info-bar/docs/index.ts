import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { AppsListDetailRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Info Bar',
	description: 'An inline, non-intrusive status message with built-in severity levels and an optional close button.',
	keywords: ['info bar', 'infobar', 'alert', 'notification', 'message bar', 'status', 'svelte'],
	canonical: '/docs/components/info-bar',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Info Bar — Fluent UI Svelte',
		description: 'A Fluent UI Svelte inline status message with severity levels and an optional close button.',
		type: 'article',
		url: '/docs/components/info-bar',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Info Bar — Fluent UI Svelte',
		description: 'A Fluent UI Svelte inline status message with severity levels and an optional close button.'
	},
	// Library-only
	slug: 'info-bar',
	status: '',
	icon: AppsListDetailRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
