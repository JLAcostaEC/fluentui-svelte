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
	// Library-only
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
