import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { BookmarkRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Label',
	description:
		'An accessible caption for a form control, with configurable size, weight, position, and required state.',
	keywords: ['label', 'form label', 'caption', 'accessibility', 'required field', 'svelte'],
	canonical: '/docs/components/label',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Label — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte label that captions form controls, with size, weight, position, and required options.',
		type: 'article',
		url: '/docs/components/label',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Label — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte label that captions form controls, with size, weight, position, and required options.'
	},
	// Library-only
	slug: 'label',
	status: '',
	icon: BookmarkRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
