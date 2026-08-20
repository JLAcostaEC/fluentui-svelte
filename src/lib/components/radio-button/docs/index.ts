import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { RadioButtonFilled } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Radio Button',
	description: 'A control for choosing a single option from a set of mutually exclusive choices.',
	keywords: ['radio button', 'radio', 'radio group', 'single choice', 'form control', 'svelte'],
	canonical: '/docs/components/radio-button',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Radio Button — Fluent UI Svelte',
		description: 'A Fluent UI Svelte radio button for choosing a single option from a group.',
		type: 'article',
		url: '/docs/components/radio-button',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Radio Button — Fluent UI Svelte',
		description: 'A Fluent UI Svelte radio button for choosing a single option from a group.'
	},
	// Library-only
	slug: 'radio-button',
	status: '',
	icon: RadioButtonFilled
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
