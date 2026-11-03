import type { Meta } from '#types';
import AutofitContentRegular from 'fluentui-icons-svelte/AutofitContentRegular.svelte';

export const META: Meta = {
	// SEO
	title: 'Auto Suggest Box',
	description: 'An input field that shows dynamic suggestions as the user types, improving form and search efficiency.',
	keywords: ['auto suggest box', 'autocomplete', 'autosuggest', 'combobox', 'typeahead', 'search input', 'svelte'],
	canonical: '/docs/components/auto-suggest-box',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Auto Suggest Box — Fluent UI Svelte',
		description: 'A Fluent UI Svelte input that surfaces dynamic suggestions as you type.',
		type: 'article',
		url: '/docs/components/auto-suggest-box',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Auto Suggest Box — Fluent UI Svelte',
		description: 'A Fluent UI Svelte input that surfaces dynamic suggestions as you type.'
	},
	// Library-only
	slug: 'auto-suggest-box',
	status: 'New',
	icon: AutofitContentRegular
};
