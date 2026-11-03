import type { Meta } from '#types';
import { ArrowAutofitDownRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Dropdown Select',
	description: 'A native-select-based dropdown for choosing one or more options, with support for rich option content.',
	keywords: ['dropdown select', 'select', 'native select', 'combobox', 'multiselect', 'svelte'],
	canonical: '/docs/components/dropdown-select',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Dropdown Select — Fluent UI Svelte',
		description: 'A Fluent UI Svelte native-select dropdown for choosing one or more options.',
		type: 'article',
		url: '/docs/components/dropdown-select',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Dropdown Select — Fluent UI Svelte',
		description: 'A Fluent UI Svelte native-select dropdown for choosing one or more options.'
	},
	// Library-only
	slug: 'dropdown-select',
	status: 'New',
	icon: ArrowAutofitDownRegular
};
