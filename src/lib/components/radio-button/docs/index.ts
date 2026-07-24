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
	// GEO
	geo: {
		summary:
			'RadioButton is a Fluent UI Svelte control for selecting a single option from a set. Group radios with a shared name, or use bind:group to bind the selected value to a variable. Each radio supports label, checked, and disabled.',
		topics: ['forms', 'selection', 'radio group', 'inputs'],
		entities: ['RadioButton', 'group', 'name', 'checked', 'disabled', 'label'],
		category: 'Inputs',
		faq: [
			{
				question: 'How do I group radio buttons?',
				answer: 'Give them the same name to allow only one to be checked, or use bind:group to bind the selected value to a variable.'
			},
			{
				question: 'How do I read the selected radio value?',
				answer: 'Bind a variable with bind:group={value}; it updates to the value of the selected radio button.'
			}
		]
	},
	// Library-only (not SEO/GEO)
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
