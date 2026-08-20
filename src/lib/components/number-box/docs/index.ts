import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { NumberSymbolSquareRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Number Box',
	description: 'A numeric input with min, max, and step constraints and optional spinner buttons.',
	keywords: ['number box', 'number input', 'numeric input', 'spinner', 'stepper', 'svelte'],
	canonical: '/docs/components/number-box',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Number Box — Fluent UI Svelte',
		description: 'A Fluent UI Svelte numeric input with min/max/step constraints and optional spinner buttons.',
		type: 'article',
		url: '/docs/components/number-box',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Number Box — Fluent UI Svelte',
		description: 'A Fluent UI Svelte numeric input with min/max/step constraints and optional spinner buttons.'
	},
	// Library-only
	slug: 'number-box',
	status: '',
	icon: NumberSymbolSquareRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
