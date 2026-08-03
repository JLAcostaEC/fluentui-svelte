import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { PaddingDownRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Expander',
	description: 'A control that displays a header and a collapsible content area that can expand up or down.',
	keywords: ['expander', 'accordion', 'collapsible', 'disclosure', 'details', 'svelte'],
	canonical: '/docs/components/expander',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Expander — Fluent UI Svelte',
		description: 'A Fluent UI Svelte expander with a header and a collapsible content area.',
		type: 'article',
		url: '/docs/components/expander',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Expander — Fluent UI Svelte',
		description: 'A Fluent UI Svelte expander with a header and a collapsible content area.'
	},
	// GEO
	geo: {
		summary:
			'Expander is a Fluent UI Svelte control that displays a header and a collapsible content area. Its open state is controlled with the expanded prop, it can expand up or down via direction, and it accepts a header icon as a Snippet or Component.',
		topics: ['disclosure', 'accordion', 'collapsible content', 'layout'],
		entities: ['Expander', 'header', 'expanded', 'direction', 'Icon'],
		category: 'Layout',
		faq: [
			{
				question: 'How do I control whether an Expander is open?',
				answer: 'Set the expanded prop to control the open/collapsed state programmatically.'
			},
			{
				question: 'Can an Expander open upwards?',
				answer: "Yes. Set direction to 'up' to make it expand upwards instead of the default downward direction."
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'expander',
	status: '',
	icon: PaddingDownRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
