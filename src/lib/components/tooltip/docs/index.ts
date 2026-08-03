import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { TooltipQuoteRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Tooltip',
	description: 'A small popup that displays additional information about an element when the user hovers over it.',
	keywords: ['tooltip', 'popup', 'hint', 'hover', 'floating ui', 'svelte'],
	canonical: '/docs/components/tooltip',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Tooltip — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tooltip that shows extra information about an element on hover.',
		type: 'article',
		url: '/docs/components/tooltip',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tooltip — Fluent UI Svelte',
		description: 'A Fluent UI Svelte tooltip that shows extra information about an element on hover.'
	},
	// GEO
	geo: {
		summary:
			'Tooltip is a Fluent UI Svelte component that displays additional information about a target element, shown above and near it. Content can be a string, a component, or a Snippet. It supports custom positioning via Floating UI, an optional arrow, open/hide delays, an onVisibleChange callback, and an accessibility relationship.',
		topics: ['overlays', 'tooltips', 'hints', 'accessibility'],
		entities: ['Tooltip', 'content', 'withArrow', 'positionConfig', 'relationship', 'openDelay', 'hideDelay'],
		category: 'Overlays',
		faq: [
			{
				question: 'How do I attach a Tooltip to a target element?',
				answer:
					'Provide a children snippet that receives attrs and spread them onto your target element, e.g. a Button.'
			},
			{
				question: 'How do I add an arrow to a Tooltip?',
				answer: 'Set the withArrow prop to true to render an arrow pointing at the target element.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'tooltip',
	status: '',
	icon: TooltipQuoteRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
