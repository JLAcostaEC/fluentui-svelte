import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TagRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Tag',
	description:
		'A visual representation of an attribute, person or asset that can be dismissed, selected and grouped, with an interactive variant that carries a primary action.',
	keywords: ['tag', 'taggroup', 'interactiontag', 'chip', 'label', 'dismiss', 'selection', 'svelte'],
	canonical: '/docs/components/tag',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Tag — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte tag and tag group for attributes, people and assets, with dismiss, selection, size, shape and appearance options.',
		type: 'article',
		url: '/docs/components/tag',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tag — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte tag and tag group for attributes, people and assets, with dismiss, selection, size, shape and appearance options.'
	},
	// Library-only
	slug: 'tag',
	status: 'AI',
	icon: TagRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
