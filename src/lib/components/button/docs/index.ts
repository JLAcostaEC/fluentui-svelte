import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { CursorHoverRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Button',
	description: 'A button triggers an action or event when activated, with accent, standard, and subtle appearances.',
	keywords: ['button', 'split button', 'menu button', 'action', 'cta', 'svelte'],
	canonical: '/docs/components/button',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Button — Fluent UI Svelte',
		description: 'A Fluent UI Svelte button that triggers actions, with accent, standard, and subtle appearances.',
		type: 'article',
		url: '/docs/components/button',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Button — Fluent UI Svelte',
		description: 'A Fluent UI Svelte button that triggers actions, with accent, standard, and subtle appearances.'
	},
	// GEO
	geo: {
		summary:
			'Button is a Fluent UI Svelte component that triggers an action or event. It supports accent, standard, and subtle appearances, circular/rounded/square shapes, polymorphic rendering via the as prop (button, a, div), a menu-button indicator, and a companion SplitButton for a primary action plus a menu.',
		topics: ['actions', 'buttons', 'forms', 'split button', 'menu button'],
		entities: ['Button', 'SplitButton', 'appearance', 'shape', 'as', 'isMenuButton'],
		category: 'Buttons',
		faq: [
			{
				question: 'What element does a Button render?',
				answer: 'By default a <button>, but the as prop lets it render as an anchor (a) or a div for polymorphic usage.'
			},
			{
				question: 'What is a SplitButton?',
				answer:
					'SplitButton combines a primary action button with a menu trigger, so users get a default action plus additional options. Attach a menu via its props (see the Menu documentation).'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'button',
	status: '',
	icon: CursorHoverRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
