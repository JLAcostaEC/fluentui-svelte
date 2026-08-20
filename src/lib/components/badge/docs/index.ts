import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { ReOrderDotsHorizontalRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Badge',
	description:
		'A visual decoration for UI elements that displays notifications, status indicators, or counts with configurable colors, shapes, and styles.',
	keywords: ['badge', 'badgeicon', 'notification', 'status indicator', 'counter', 'chip', 'svelte'],
	canonical: '/docs/components/badge',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Badge — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte badge for notifications, status indicators, and counts, with color, size, shape, and icon options.',
		type: 'article',
		url: '/docs/components/badge',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Badge — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte badge for notifications, status indicators, and counts, with color, size, shape, and icon options.'
	},
	// Library-only
	slug: 'badge',
	status: '',
	icon: ReOrderDotsHorizontalRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
