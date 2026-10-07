import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TagSearchRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Tag Picker',
	description:
		'A text field and a dropdown that let people choose several options from a list, or enter their own, each choice shown as a dismissible tag.',
	keywords: ['tag picker', 'tagpicker', 'multiselect', 'combobox', 'autocomplete', 'tags', 'chips', 'svelte'],
	canonical: '/docs/components/tag-picker',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Tag Picker — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte tag picker that turns each chosen option into a dismissible tag, with filtering, groups and single or multiple selection.',
		type: 'article',
		url: '/docs/components/tag-picker',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tag Picker — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte tag picker that turns each chosen option into a dismissible tag, with filtering, groups and single or multiple selection.'
	},
	// Library-only
	slug: 'tag-picker',
	status: 'AI',
	icon: TagSearchRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
