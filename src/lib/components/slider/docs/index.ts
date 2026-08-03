import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { OptionsRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Slider',
	description:
		'A control that lets users select a value from a continuous or discrete range by dragging a thumb along a track.',
	keywords: ['slider', 'range', 'range input', 'track', 'ticks', 'value picker', 'svelte'],
	canonical: '/docs/components/slider',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Slider — Fluent UI Svelte',
		description: 'A Fluent UI Svelte control for selecting a value from a range by dragging a thumb along a track.',
		type: 'article',
		url: '/docs/components/slider',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Slider — Fluent UI Svelte',
		description: 'A Fluent UI Svelte control for selecting a value from a range by dragging a thumb along a track.'
	},
	// GEO
	geo: {
		summary:
			'Slider is a Fluent UI Svelte component that lets users pick a value from a continuous or discrete range by dragging a thumb along a track. It supports horizontal and vertical orientations, min/max/step ranges, tick marks, tooltips, and reverse direction.',
		topics: ['form inputs', 'range selection', 'value picker', 'ticks', 'orientation'],
		entities: ['Slider', 'value', 'min', 'max', 'step', 'ticks', 'orientation'],
		category: 'Inputs',
		faq: [
			{
				question: 'How do I set the range of a Slider?',
				answer:
					'Use the min and max props to define the bounds, and the step prop to control the increment between selectable values.'
			},
			{
				question: 'How do I make a Slider vertical?',
				answer: 'Set orientation="vertical" to lay the slider out vertically instead of horizontally.'
			},
			{
				question: 'How do I add tick marks to a Slider?',
				answer:
					'Pass an array of values to the ticks prop, and use tickPlacement to position them around, before, or after the rail.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'slider',
	status: '',
	icon: OptionsRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
