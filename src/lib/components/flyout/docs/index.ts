import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TextboxAlignMiddleRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Flyout',
	description: 'A floating panel that displays additional information or options in a non-intrusive, accessible way.',
	keywords: ['flyout', 'popover', 'floating panel', 'overlay', 'floating ui', 'svelte'],
	canonical: '/docs/components/flyout',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Flyout — Fluent UI Svelte',
		description: 'A Fluent UI Svelte floating panel for showing extra information or options non-intrusively.',
		type: 'article',
		url: '/docs/components/flyout',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Flyout — Fluent UI Svelte',
		description: 'A Fluent UI Svelte floating panel for showing extra information or options non-intrusively.'
	},
	// GEO
	geo: {
		summary:
			'Flyout is a Fluent UI Svelte floating panel that shows extra information or options in a non-intrusive way. It can optionally use Floating UI for positioning via the floating, reference, placement, and offset props, and lets you control which corners are rounded.',
		topics: ['overlays', 'floating panels', 'popovers', 'positioning'],
		entities: ['Flyout', 'floating', 'reference', 'placement', 'roundCorners', 'offset'],
		category: 'Overlays',
		faq: [
			{
				question: 'How is a Flyout positioned?',
				answer:
					'By default it is a plain panel; enable the floating prop to position it with Floating UI relative to a reference element, controlled by placement and offset.'
			},
			{
				question: 'Can I round only some corners of a Flyout?',
				answer: "Yes. The roundCorners prop accepts 'all', 'top', 'bottom', 'left', or 'right'."
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'flyout',
	status: '',
	icon: TextboxAlignMiddleRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
