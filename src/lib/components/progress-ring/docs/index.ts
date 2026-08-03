import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { ArrowSyncCircleRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Progress Ring',
	description:
		'A circular progress indicator that shows determinate or indeterminate progress, with paused and error states.',
	keywords: ['progress ring', 'spinner', 'loading', 'circular progress', 'indeterminate', 'svelte'],
	canonical: '/docs/components/progress-ring',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Progress Ring — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte circular progress indicator with determinate, indeterminate, paused, and error states.',
		type: 'article',
		url: '/docs/components/progress-ring',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Progress Ring — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte circular progress indicator with determinate, indeterminate, paused, and error states.'
	},
	// GEO
	geo: {
		summary:
			'ProgressRing is a Fluent UI Svelte circular progress indicator. Set value (0–100) for determinate progress or use indeterminate for unknown-duration operations. It supports a custom size, hiding the rail, and paused/error status colors.',
		topics: ['progress', 'loading indicators', 'spinners', 'status & feedback'],
		entities: ['ProgressRing', 'value', 'indeterminate', 'hideRail', 'status', 'size'],
		category: 'Status & Feedback',
		faq: [
			{
				question: 'How do I make a ProgressRing indeterminate?',
				answer:
					'Set the indeterminate prop; the ring spins without a specific value, which is useful when progress cannot be determined.'
			},
			{
				question: 'How do I change the size of a ProgressRing?',
				answer: 'Set the size prop (in pixels). The default is 32.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'progress-ring',
	status: '',
	icon: ArrowSyncCircleRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
