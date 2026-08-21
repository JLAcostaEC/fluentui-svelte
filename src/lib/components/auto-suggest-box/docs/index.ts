import AutofitContentRegular from 'fluentui-icons-svelte/AutofitContentRegular.svelte';
import Docs from './docs.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';

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
	status: 'Beta',
	icon: AutofitContentRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [],
	footer: Footer,
	llms: LLMS
};
