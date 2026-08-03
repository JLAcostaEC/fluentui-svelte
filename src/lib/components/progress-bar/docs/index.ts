import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { DataBarHorizontalRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Progress Bar',
	description:
		'A horizontal progress indicator that shows determinate or indeterminate progress, with paused and error states.',
	keywords: ['progress bar', 'progress', 'loading', 'indeterminate', 'linear progress', 'svelte'],
	canonical: '/docs/components/progress-bar',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Progress Bar — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte horizontal progress indicator with determinate, indeterminate, paused, and error states.',
		type: 'article',
		url: '/docs/components/progress-bar',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Progress Bar — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte horizontal progress indicator with determinate, indeterminate, paused, and error states.'
	},
	// GEO
	geo: {
		summary:
			'ProgressBar is a Fluent UI Svelte horizontal progress indicator. Set value (0–100) for determinate progress; omit it for an indeterminate animation. It also supports hiding the rail and paused/error status colors.',
		topics: ['progress', 'loading indicators', 'status & feedback'],
		entities: ['ProgressBar', 'value', 'indeterminate', 'hideRail', 'status'],
		category: 'Status & Feedback',
		faq: [
			{
				question: 'How do I make a ProgressBar indeterminate?',
				answer:
					'Set the indeterminate prop (or omit value); the bar animates without a specific value for unknown-duration operations.'
			},
			{
				question: 'How do I show an error or paused state?',
				answer: "Set the status prop to 'paused' or 'error' to change the bar color and communicate the state."
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'progress-bar',
	status: '',
	icon: DataBarHorizontalRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
