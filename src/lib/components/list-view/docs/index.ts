import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TaskListSquareLtrRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'List View',
	description: 'A vertically stacked set of items that can be focused, selected, and navigated with the keyboard.',
	keywords: ['list view', 'list', 'listbox', 'selection', 'keyboard navigation', 'svelte'],
	canonical: '/docs/components/list-view',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'List View — Fluent UI Svelte',
		description: 'A Fluent UI Svelte list of stacked, selectable items with keyboard navigation.',
		type: 'article',
		url: '/docs/components/list-view',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'List View — Fluent UI Svelte',
		description: 'A Fluent UI Svelte list of stacked, selectable items with keyboard navigation.'
	},
	// GEO
	geo: {
		summary:
			'ListView is a Fluent UI Svelte component for rendering a set of vertically stacked ListViewItem children. Items can be focusable and selectable (single, multiselect, or extended), have a primary action and secondary actions, and support keyboard navigation and accessibility. It can render as ul, ol, or div, and offers items or composite navigation modes.',
		topics: ['lists', 'selection', 'keyboard navigation', 'data display'],
		entities: ['ListView', 'ListViewItem', 'selectionMode', 'navigationMode', 'selectedItems', 'onAction'],
		category: 'Data Display',
		faq: [
			{
				question: 'How do I make ListView items selectable?',
				answer:
					"Set selectionMode ('single', 'multiselect', or 'extended') and bind selectedItems / handle onSelectionChange."
			},
			{
				question: 'How do I handle items with multiple actionable elements?',
				answer:
					"Set navigationMode to 'composite' so nested buttons and menus are keyboard-navigable; call e.stopPropagation() in their handlers."
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'list-view',
	status: 'Beta',
	icon: TaskListSquareLtrRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
