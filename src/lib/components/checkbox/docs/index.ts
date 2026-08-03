import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { CheckboxCheckedRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Checkbox',
	description: 'A control a user can check or clear, and that can also report an indeterminate (mixed) state.',
	keywords: ['checkbox', 'check box', 'toggle', 'indeterminate', 'form control', 'svelte'],
	canonical: '/docs/components/checkbox',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Checkbox — Fluent UI Svelte',
		description: 'A Fluent UI Svelte checkbox that supports checked, unchecked, and indeterminate states.',
		type: 'article',
		url: '/docs/components/checkbox',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Checkbox — Fluent UI Svelte',
		description: 'A Fluent UI Svelte checkbox that supports checked, unchecked, and indeterminate states.'
	},
	geo: {
		summary:
			'Checkbox is a Fluent UI Svelte control that a user can select (check) or clear (uncheck), and that can also report an indeterminate state for mixed selections. Set wrapperAs="label" to render a visible label wrapping the input.',
		topics: ['forms', 'selection', 'inputs', 'indeterminate state'],
		entities: ['Checkbox', 'checked', 'indeterminate', 'disabled', 'value', 'wrapperAs'],
		category: 'Inputs',
		faq: [
			{
				question: 'How do I add a visible label to a Checkbox?',
				answer:
					'Set wrapperAs="label" and pass the label text as children; the wrapper then renders as a <label> that wraps the input.'
			},
			{
				question: 'How do I show an indeterminate Checkbox?',
				answer: 'Set the indeterminate prop, which is useful for representing a mixed selection across a group.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'checkbox',
	status: '',
	icon: CheckboxCheckedRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
