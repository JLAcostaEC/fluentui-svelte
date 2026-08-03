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
	// GEO
	geo: {
		summary:
			'NumberBox is a Fluent UI Svelte input for numeric values with min, max, and step constraints. It builds on TextBox (inheriting its props), offers inline and compact variants, and can hide its action buttons.',
		topics: ['numeric input', 'forms', 'inputs', 'steppers'],
		entities: ['NumberBox', 'TextBox', 'value', 'variant', 'min', 'max', 'step'],
		category: 'Inputs',
		faq: [
			{
				question: 'How do I constrain the values of a NumberBox?',
				answer: 'Use the min, max, and step props to bound and increment the numeric value.'
			},
			{
				question: 'Does NumberBox share props with TextBox?',
				answer: 'Yes. NumberBox inherits TextBox props, so most TextBox configuration also applies.'
			}
		]
	},
	// Library-only (not SEO/GEO)
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
