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
	// GEO
	geo: {
		summary:
			'Label is a Fluent UI Svelte component that renders an accessible <label> caption for a form control. It supports small/medium/large sizes, regular/semibold weights, four label positions (before, after, above, below), a required indicator, and a disabled state.',
		topics: ['forms', 'labels', 'accessibility', 'inputs'],
		entities: ['Label', 'label', 'size', 'weight', 'labelPosition', 'required'],
		category: 'Inputs',
		faq: [
			{
				question: 'How do I mark a Label as required?',
				answer:
					'Pass a required object (e.g. required={{ message: "Required" }}); it renders a required indicator, defaulting to an asterisk.'
			},
			{
				question: 'How do I position the label text relative to a control?',
				answer: "Use the labelPosition prop with 'before', 'after', 'above', or 'below'."
			}
		]
	},
	// Library-only (not SEO/GEO)
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
