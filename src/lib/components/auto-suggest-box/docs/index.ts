import AutofitContentRegular from 'fluentui-icons-svelte/AutofitContentRegular.svelte';
import Docs from './docs.svx';
import Examples from './examples.svx';
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
	// GEO
	geo: {
		summary:
			'AutoSuggestBox is a Fluent UI Svelte input component that displays a filtered list of AutoSuggestBoxOption children as the user types, with keyboard navigation, single/multi select, and suggestionChosen / querySubmitted events.',
		topics: ['autocomplete', 'search', 'form inputs', 'combobox', 'keyboard navigation'],
		entities: ['AutoSuggestBox', 'AutoSuggestBoxOption', 'suggestionChosen', 'querySubmitted', 'maxItemsInView'],
		category: 'Inputs',
		faq: [
			{
				question: 'How do I provide suggestions to an AutoSuggestBox?',
				answer:
					'Render AutoSuggestBoxOption components as children of AutoSuggestBox. As the user types, matching options are shown.'
			},
			{
				question: 'How do I handle when a suggestion is chosen?',
				answer:
					'Use the suggestionChosen callback; it receives the event and the chosen suggestion value as its second argument.'
			},
			{
				question: 'How do I limit how many suggestions are visible?',
				answer: 'Set the maxItemsInView prop. When the option count exceeds it, the flyout scrolls. Default is 6.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'auto-suggest-box',
	status: 'Beta',
	icon: AutofitContentRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
