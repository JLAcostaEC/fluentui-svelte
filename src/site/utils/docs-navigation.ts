import { dev } from '$app/env';
import { m } from '#i18n/messages.js';
import type { Meta } from '#types';
import HomeRegular from 'fluentui-icons-svelte/HomeRegular.svelte';
import RocketRegular from 'fluentui-icons-svelte/RocketRegular.svelte';
import SparkleRegular from 'fluentui-icons-svelte/SparkleRegular.svelte';
import AppsRegular from 'fluentui-icons-svelte/AppsRegular.svelte';
import components from './components-index.js';

export const docsPages = [
	{ url: '/docs', label: m.global_overview, icon: HomeRegular },
	{ url: '/docs/getting-started', label: m.global_getting_started, icon: RocketRegular },
	{ url: '/docs/llms', label: m.global_llms, icon: SparkleRegular },
	{ url: '/docs/components', label: m.docs_nav_title, icon: AppsRegular }
];

export const typesPage = { url: '/docs/types', label: m.docs_types_reference };

const categories = [
	{
		id: 'window',
		label: m.site_category_window,
		slugs: ['app-window', 'title-bar', 'side-nav', 'app-surface', 'tab-view']
	},
	{
		id: 'navigation',
		label: m.site_navigation,
		slugs: [
			'top-nav',
			'breadcrumb',
			'hyperlink',
			'annotated-scroll-bar',
			'flip-view',
			'pips-pager',
			'scroll-bar',
			'tree-view'
		]
	},
	{
		id: 'actions',
		label: m.site_actions,
		slugs: ['button', 'pill-button', 'lite-filter']
	},
	{
		id: 'forms',
		label: m.site_category_forms,
		slugs: [
			'label',
			'text-box',
			'textarea',
			'number-box',
			'auto-suggest-box',
			'calendar-date-picker',
			'calendar-view',
			'checkbox',
			'color-picker',
			'date-picker',
			'dropdown',
			'dropdown-select',
			'file-uploader',
			'radio-button',
			'rating',
			'segmented-control',
			'slider',
			'tag-picker',
			'time-picker',
			'toggle-switch'
		]
	},
	{
		id: 'layout',
		label: m.site_category_layout,
		slugs: ['card', 'divider', 'expander']
	},
	{
		id: 'collections',
		label: m.site_category_collections,
		slugs: ['items-view', 'list-view', 'media-player', 'table', 'tag']
	},
	{
		id: 'overlays',
		label: m.site_category_overlays,
		slugs: ['dialog', 'drawer', 'flyout', 'menu', 'teaching-tip', 'tooltip']
	},
	{ id: 'feedback', label: m.site_category_feedback, slugs: [] }
];

export const componentPath = (slug: string) => '/docs/components/' + slug;

export const componentGroups = categories.map(({ id, label, slugs }) => ({
	id,
	label,
	items: components
		.filter(
			(meta: Meta) =>
				(dev || meta.status !== 'Empty') &&
				(id === 'feedback'
					? !categories.some((category) => category.slugs.includes(meta.slug))
					: slugs.includes(meta.slug))
		)
		.sort((a: Meta, b: Meta) => a.title.localeCompare(b.title, 'en'))
}));

export const docsNavigation = [
	...docsPages,
	...componentGroups.flatMap(({ items }) =>
		items.map((meta) => ({ url: componentPath(meta.slug), label: () => meta.title }))
	),
	typesPage
];
