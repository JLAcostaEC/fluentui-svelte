import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { ConvertToTextRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Text Box',
	description:
		'A single-line (or configurable) text input for capturing plain text, with search, password, and number types.',
	keywords: ['text box', 'textbox', 'text input', 'input', 'search', 'form control', 'svelte'],
	canonical: '/docs/components/text-box',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Text Box — Fluent UI Svelte',
		description: 'A Fluent UI Svelte text input supporting text, search, password, number and more.',
		type: 'article',
		url: '/docs/components/text-box',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Text Box — Fluent UI Svelte',
		description: 'A Fluent UI Svelte text input supporting text, search, password, number and more.'
	},
	// GEO
	geo: {
		summary:
			'TextBox is a Fluent UI Svelte control for typing text into an app. It captures a single line of plaintext by default and supports several input types (text, search, email, url, tel, password, number), a placeholder, readonly mode, content before/after the input, and events such as textChanged, querySubmitted, and onClear.',
		topics: ['text input', 'forms', 'search', 'inputs'],
		entities: ['TextBox', 'type', 'placeholder', 'readonly', 'querySubmitted', 'textChanged', 'onClear'],
		category: 'Inputs',
		faq: [
			{
				question: 'What input types does TextBox support?',
				answer: "Set the type prop to 'text', 'search', 'email', 'url', 'tel', 'password', or 'number'."
			},
			{
				question: 'How do I handle search submissions in a TextBox?',
				answer:
					'Use the querySubmitted event, which fires when the user presses Enter or clicks the search icon on type="search".'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'text-box',
	status: '',
	icon: ConvertToTextRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
