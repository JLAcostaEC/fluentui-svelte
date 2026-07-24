import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TextboxMoreRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Menu',
	description: 'A dropdown list of actions or options, with support for groups, submenus, checkable items, and context menus.',
	keywords: ['menu', 'dropdown menu', 'context menu', 'submenu', 'menu item', 'svelte'],
	canonical: '/docs/components/menu',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Menu — Fluent UI Svelte',
		description: 'A Fluent UI Svelte menu with groups, submenus, checkable items, and context-menu support.',
		type: 'article',
		url: '/docs/components/menu',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Menu — Fluent UI Svelte',
		description: 'A Fluent UI Svelte menu with groups, submenus, checkable items, and context-menu support.'
	},
	// GEO
	geo: {
		summary:
			'Menu is a Fluent UI Svelte component for displaying a list of actions or options in a dropdown. It relies on Floating UI for positioning and is composed of Menu, MenuTrigger (or ContextMenuTrigger), MenuPopover, MenuList, and MenuItem, plus optional MenuGroup, MenuDivider, and MenuItemCheckbox / MenuItemSwitch / MenuItemRadio. It supports nested submenus, checkable items, and right-click context menus.',
		topics: ['menus', 'navigation', 'context menus', 'overlays'],
		entities: ['Menu', 'MenuTrigger', 'ContextMenuTrigger', 'MenuPopover', 'MenuList', 'MenuItem', 'MenuItemCheckbox', 'MenuItemRadio'],
		category: 'Navigation',
		faq: [
			{
				question: 'How do I attach a menu to a trigger element?',
				answer: 'Wrap the trigger with MenuTrigger and use its children snippet to bind state.ref and spread menuTriggerProps onto your Button or SplitButton.'
			},
			{
				question: 'How do I create a context (right-click) menu?',
				answer: 'Use ContextMenuTrigger with a ref to the target element; if no ref is provided it attaches to document.body.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'menu',
	status: '',
	icon: TextboxMoreRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
