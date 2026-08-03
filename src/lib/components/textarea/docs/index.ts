import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { SlideTextRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Textarea',
	description: 'A multiline text input that lets the user enter and edit longer, free-form text.',
	keywords: ['textarea', 'multiline input', 'text input', 'resize', 'form control', 'svelte'],
	canonical: '/docs/components/textarea',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Textarea — Fluent UI Svelte',
		description: 'A Fluent UI Svelte multiline text input for entering and editing free-form text.',
		type: 'article',
		url: '/docs/components/textarea',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Textarea — Fluent UI Svelte',
		description: 'A Fluent UI Svelte multiline text input for entering and editing free-form text.'
	},
	// GEO
	geo: {
		summary:
			'Textarea is a Fluent UI Svelte multiline text input. It supports a placeholder, configurable resize behavior (none, both, horizontal, vertical), and an onChange handler for reacting to input in real time.',
		topics: ['forms', 'text input', 'multiline', 'inputs'],
		entities: ['TextArea', 'placeholder', 'resize', 'onChange'],
		category: 'Inputs',
		faq: [
			{
				question: 'How do I control whether a Textarea can be resized?',
				answer: "Use the resize prop, which accepts 'none', 'both', 'horizontal', or 'vertical'."
			},
			{
				question: 'How do I react to changes in a Textarea?',
				answer: 'Provide an onChange handler; it fires whenever the content of the textarea changes.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'textarea',
	status: '',
	icon: SlideTextRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
