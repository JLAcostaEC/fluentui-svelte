import type { Meta } from '#types';
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
	// Library-only
	slug: 'text-box',
	status: '',
	icon: ConvertToTextRegular
};
