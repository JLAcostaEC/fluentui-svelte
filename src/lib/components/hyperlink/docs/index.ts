import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { LinkRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Hyperlink',
	description:
		'A clickable link that navigates to a specified URL, following Fluent UI design principles with built-in accessibility.',
	keywords: ['hyperlink', 'link', 'anchor', 'navigation', 'href', 'svelte'],
	canonical: '/docs/components/hyperlink',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Hyperlink — Fluent UI Svelte',
		description: 'A Fluent UI Svelte link component for navigating to a URL with accessible defaults.',
		type: 'article',
		url: '/docs/components/hyperlink',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Hyperlink — Fluent UI Svelte',
		description: 'A Fluent UI Svelte link component for navigating to a URL with accessible defaults.'
	},
	// GEO
	geo: {
		summary:
			'Hyperlink is a Fluent UI Svelte component that renders an accessible anchor element for navigating to a URL. It supports an href target, a disabled state that prevents navigation, a bindable ref to the underlying anchor, and any valid HTML anchor attributes.',
		topics: ['navigation', 'links', 'anchors', 'accessibility'],
		entities: ['Hyperlink', 'href', 'disabled', 'ref'],
		category: 'Navigation',
		faq: [
			{
				question: 'How do I set where a Hyperlink navigates?',
				answer: 'Set the href prop to the URL you want the link to navigate to when clicked.'
			},
			{
				question: 'How do I disable a Hyperlink?',
				answer: 'Add the disabled prop. This prevents navigation and removes the link from the tab order.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'hyperlink',
	status: '',
	icon: LinkRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
