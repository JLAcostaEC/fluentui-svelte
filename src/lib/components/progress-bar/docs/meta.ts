import type { Meta } from '#types';
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
	// Library-only
	slug: 'progress-bar',
	status: '',
	icon: DataBarHorizontalRegular
};
