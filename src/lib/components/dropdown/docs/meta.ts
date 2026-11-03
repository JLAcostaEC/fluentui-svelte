import type { Meta } from '#types';
import { ArrowAutofitDownRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Dropdown',
	description: 'A custom dropdown that lets users select one or more options from a list, with rich option content.',
	keywords: ['dropdown', 'select', 'combobox', 'options', 'multiselect', 'svelte'],
	canonical: '/docs/components/dropdown',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Dropdown — Fluent UI Svelte',
		description: 'A Fluent UI Svelte dropdown for selecting one or more options, with rich option content.',
		type: 'article',
		url: '/docs/components/dropdown',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Dropdown — Fluent UI Svelte',
		description: 'A Fluent UI Svelte dropdown for selecting one or more options, with rich option content.'
	},
	// Library-only
	slug: 'dropdown',
	status: '',
	icon: ArrowAutofitDownRegular
};
