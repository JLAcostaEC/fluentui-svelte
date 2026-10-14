import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { WindowRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'AppWindow',
	description:
		'The surface of an app: a Mica window built on the Flyout, with its own border and the shell shadow of an active or an inactive window, sized by a width and a height.',
	keywords: ['app window', 'window', 'app shell', 'mica', 'shell shadow', 'flyout', 'windows 11', 'svelte'],
	canonical: '/docs/components/app-window',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'AppWindow — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte app window with a Mica background, a surface stroke and active and inactive shell shadows.',
		type: 'article',
		url: '/docs/components/app-window',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'AppWindow — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte app window with a Mica background, a surface stroke and active and inactive shell shadows.'
	},
	// Library-only
	slug: 'app-window',
	status: 'New',
	icon: WindowRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
