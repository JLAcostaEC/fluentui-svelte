import Docs from './docs.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { CalendarEditRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Calendar Date Picker',
	description: 'A button trigger paired with a CalendarView popup for selecting a single date.',
	keywords: ['calendar date picker', 'date picker', 'calendar', 'date input', 'datepicker', 'svelte'],
	canonical: '/docs/components/calendar-date-picker',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Calendar Date Picker — Fluent UI Svelte',
		description: 'A Fluent UI Svelte date picker that opens a CalendarView popup to select a single date.',
		type: 'article',
		url: '/docs/components/calendar-date-picker',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Calendar Date Picker — Fluent UI Svelte',
		description: 'A Fluent UI Svelte date picker that opens a CalendarView popup to select a single date.'
	},
	// Library-only (not SEO/GEO)
	slug: 'calendar-date-picker',
	status: '',
	icon: CalendarEditRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [],
	footer: Footer,
	llms: LLMS
};
