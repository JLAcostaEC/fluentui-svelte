import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { ClockRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Time Picker',
	description:
		'An input for selecting a time from carousel-style hour, minute, and second columns, in 12- or 24-hour format.',
	keywords: ['time picker', 'timepicker', 'time input', 'clock', '12 hour', '24 hour', 'svelte'],
	canonical: '/docs/components/time-picker',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Time Picker — Fluent UI Svelte',
		description: 'A Fluent UI Svelte time picker with hour, minute, and second columns in 12- or 24-hour format.',
		type: 'article',
		url: '/docs/components/time-picker',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Time Picker — Fluent UI Svelte',
		description: 'A Fluent UI Svelte time picker with hour, minute, and second columns in 12- or 24-hour format.'
	},
	// Library-only
	slug: 'time-picker',
	status: 'AI',
	icon: ClockRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
