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
	// GEO
	geo: {
		summary:
			'TimePicker is a Fluent UI Svelte input for selecting a time via hour, minute, and second columns. It supports a 24-hour or 12-hour (with AM/PM) clock, a value in HH:mm or HH:mm:ss format, and hiding individual columns.',
		topics: ['time selection', 'inputs', 'forms'],
		entities: ['TimePicker', 'value', 'format', 'hideHours', 'hideMinutes', 'hideSeconds'],
		category: 'Inputs',
		faq: [
			{
				question: 'How do I switch between 12- and 24-hour format?',
				answer: 'Set the format prop to 12 (with an AM/PM column) or 24. The default is 24.'
			},
			{
				question: 'What format does the TimePicker value use?',
				answer: 'The value is a 24-hour HH:mm or HH:mm:ss string, matching the underlying <input type="time">.'
			}
		]
	},
	// Library-only (not SEO/GEO)
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
