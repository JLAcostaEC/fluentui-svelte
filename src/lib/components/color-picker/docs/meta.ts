import type { Meta } from '#types';
import { PaintBucketRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	title: 'ColorPicker',
	description: 'A Fluent color picker with square and circular spectra, RGB and HSV fields, and optional opacity.',
	keywords: ['color picker', 'color spectrum', 'HSV', 'RGB', 'opacity', 'svelte'],
	canonical: '/docs/components/color-picker',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'ColorPicker — Fluent UI Svelte',
		description: 'Select colors with a spectrum, channel fields and optional opacity.',
		type: 'article',
		url: '/docs/components/color-picker',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'ColorPicker — Fluent UI Svelte',
		description: 'Select colors with a spectrum, channel fields and optional opacity.'
	},
	slug: 'color-picker',
	status: 'New',
	icon: PaintBucketRegular
};
