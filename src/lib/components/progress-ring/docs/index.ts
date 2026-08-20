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
	// Library-only
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
