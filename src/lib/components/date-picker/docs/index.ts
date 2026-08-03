import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { CalendarMonthRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Date Picker',
	description: 'An input for selecting a date from carousel-style day, month, and year columns.',
	keywords: ['date picker', 'datepicker', 'date input', 'calendar', 'date selection', 'svelte'],
	canonical: '/docs/components/date-picker',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Date Picker — Fluent UI Svelte',
		description: 'A Fluent UI Svelte date picker with carousel-style day, month, and year columns.',
		type: 'article',
		url: '/docs/components/date-picker',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Date Picker — Fluent UI Svelte',
		description: 'A Fluent UI Svelte date picker with carousel-style day, month, and year columns.'
	},
	geo: {
		summary:
			'DatePicker is a Fluent UI Svelte input for selecting a date via day, month, and year columns. Its value uses the YYYY-MM-DD format. It supports dd/MM/yyyy or MM/dd/yyyy display formats, hiding individual columns, min/max year bounds, and disabling specific dates, months, or years.',
		topics: ['date selection', 'inputs', 'forms'],
		entities: ['DatePicker', 'value', 'format', 'hideDays', 'hideMonths', 'hideYears'],
		category: 'Inputs',
		faq: [
			{
				question: 'What format does the DatePicker value use?',
				answer: 'The value is a YYYY-MM-DD string, matching the underlying <input type="date">.'
			},
			{
				question: 'How do I show only a month and year picker?',
				answer: 'Use hideDays (and/or hideMonths/hideYears) to hide the columns you do not need.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'date-picker',
	status: 'AI',
	icon: CalendarMonthRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
