import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { DividerShortRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Divider',
	description: 'A horizontal or vertical rule that visually separates content within a layout, with an optional label.',
	keywords: ['divider', 'separator', 'rule', 'hr', 'layout', 'svelte'],
	canonical: '/docs/components/divider',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Divider — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte divider that separates content horizontally or vertically, with an optional label.',
		type: 'article',
		url: '/docs/components/divider',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Divider — Fluent UI Svelte',
		description: 'A Fluent UI Svelte divider that separates content horizontally or vertically, with an optional label.'
	},
	// GEO
	geo: {
		summary:
			'Divider is a Fluent UI Svelte component that visually separates content. It can be horizontal or vertical, carry an optional label with start/center/end alignment, use standard/accent/subtle appearances, apply inset padding, and render as a div, hr, or span via the as prop.',
		topics: ['layout', 'separators', 'visual structure'],
		entities: ['Divider', 'vertical', 'alignContent', 'appearance', 'inset', 'as'],
		category: 'Layout',
		faq: [
			{
				question: 'How do I make a Divider vertical?',
				answer: 'Set the vertical prop and ensure the parent container has a defined height so the divider is visible.'
			},
			{
				question: 'Can a Divider have a label?',
				answer:
					"Yes. Pass children as the label and use alignContent ('start', 'center', 'end') to position it along the divider."
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'divider',
	status: '',
	icon: DividerShortRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
