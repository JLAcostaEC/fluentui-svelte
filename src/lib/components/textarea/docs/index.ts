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
	// Library-only
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
