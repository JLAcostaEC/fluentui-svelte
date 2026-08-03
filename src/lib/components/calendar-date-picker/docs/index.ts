import Docs from './docs.svx';
import Examples from './examples.svx';
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
	geo: {
		summary:
			'CalendarDatePicker is a Fluent UI Svelte component that combines a button trigger with a CalendarView popup. Clicking the trigger opens the calendar, and selecting a day updates the bound value and closes the popup. Calendar props such as blackoutDates, minDate, maxDate, weekStart and headers are forwarded to the popup calendar.',
		topics: ['date selection', 'calendars', 'inputs', 'forms'],
		entities: ['CalendarDatePicker', 'CalendarView', 'value', 'minDate', 'maxDate', 'blackoutDates'],
		category: 'Inputs',
		faq: [
			{
				question: 'How do I read the selected date from a CalendarDatePicker?',
				answer:
					'Bind a variable to the value prop (bind:value); it updates to the chosen Date when the user selects a day.'
			},
			{
				question: 'Can I restrict which dates are selectable?',
				answer: 'Yes. Use minDate, maxDate, and blackoutDates, which are forwarded to the underlying CalendarView.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'calendar-date-picker',
	status: '',
	icon: CalendarEditRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
