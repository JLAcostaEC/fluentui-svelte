import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { CalendarLtrRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Calendar View',
	description: 'An inline calendar for browsing days, months, and years and selecting dates or a range.',
	keywords: ['calendar view', 'calendar', 'date selection', 'date range', 'datepicker', 'month view', 'svelte'],
	canonical: '/docs/components/calendar-view',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Calendar View — Fluent UI Svelte',
		description: 'A Fluent UI Svelte inline calendar for browsing dates and selecting one or more days.',
		type: 'article',
		url: '/docs/components/calendar-view',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Calendar View — Fluent UI Svelte',
		description: 'A Fluent UI Svelte inline calendar for browsing dates and selecting one or more days.'
	},
	// Library-only
	slug: 'calendar-view',
	status: '',
	icon: CalendarLtrRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
