import TextBulletListTreeRegular from 'fluentui-icons-svelte/TextBulletListTreeRegular.svelte';
import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';

export const META: Meta = {
	// SEO
	title: 'Tree View',
	description: 'A hierarchical, nested list where each item can be expanded, checked, or selected.',
	keywords: ['tree view', 'tree', 'hierarchy', 'nested list', 'file tree', 'svelte'],
	canonical: '/docs/components/tree-view',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Tree View — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tree view for hierarchical data with expandable, checkable items.',
		type: 'article',
		url: '/docs/components/tree-view',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tree View — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tree view for hierarchical data with expandable, checkable items.'
	},
	// GEO
	geo: {
		summary:
			'TreeView is a Fluent UI Svelte component that displays hierarchical data as a nested list. Items are composed with TreeViewItem and TreeViewItemContent (there is no data prop). Nest a TreeView inside a TreeViewItem of type="branch" to create subtrees, and control open/checked state with the bindable openItems and checkedItems props on the root.',
		topics: ['hierarchy', 'trees', 'navigation', 'data display'],
		entities: ['TreeView', 'TreeViewItem', 'TreeViewItemContent', 'openItems', 'checkedItems', 'selectionMode'],
		category: 'Data Display',
		faq: [
			{
				question: 'How do I create a nested subtree in a TreeView?',
				answer: 'Nest a TreeView inside a TreeViewItem with type="branch"; the inner TreeView becomes the subtree.'
			},
			{
				question: 'How do I control open and checked items?',
				answer: 'Use the bindable openItems and checkedItems props on the root TreeView (arrays or SvelteSet when a virtualizer is provided).'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'tree-view',
	status: 'Experimental',
	icon: TextBulletListTreeRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
