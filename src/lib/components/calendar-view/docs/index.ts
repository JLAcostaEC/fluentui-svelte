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
	geo: {
		summary:
			'CalendarView is a Fluent UI Svelte inline calendar that lets users browse days, months, and years and select one date, several dates, or a range. It supports single, multiple and range selection, min/max dates, blackout dates, a configurable week start and locale, and can be rendered as a popup via the floating prop.',
		topics: ['calendars', 'date selection', 'date ranges', 'inputs'],
		entities: ['CalendarView', 'value', 'selectionMode', 'range', 'minDate', 'maxDate', 'weekStart', 'blackoutDates'],
		category: 'Inputs',
		faq: [
			{
				question: 'How do I allow selecting multiple dates in CalendarView?',
				answer: 'Set selectionMode to multiple; value then becomes an array of the selected dates.'
			},
			{
				question: 'How do I select a date range in CalendarView?',
				answer:
					'Set selectionMode to range and bind the range prop. The first click sets start and leaves end null; the second click closes the range.'
			},
			{
				question: 'How do I change the first day of the week?',
				answer: 'Use the weekStart prop (0 = Sunday, 1 = Monday). The default is 1.'
			}
		]
	},
	// Library-only (not SEO/GEO)
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
