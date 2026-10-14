import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { LayerRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'AppSurface',
	description:
		'The area of an app that holds its content: a layer over the window or its Mica, with the top-left and bottom-right corners rounded, in the colors of an active or an inactive window.',
	keywords: ['app surface', 'surface', 'content area', 'layer', 'mica', 'app shell', 'windows 11', 'svelte'],
	canonical: '/docs/components/app-surface',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'AppSurface — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte app surface: a layer or Mica content area with two rounded corners and active and inactive colors.',
		type: 'article',
		url: '/docs/components/app-surface',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'AppSurface — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte app surface: a layer or Mica content area with two rounded corners and active and inactive colors.'
	},
	// Library-only
	slug: 'app-surface',
	status: 'New',
	icon: LayerRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
