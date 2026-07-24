import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { AppsListDetailRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Info Bar',
	description: 'An inline, non-intrusive status message with built-in severity levels and an optional close button.',
	keywords: ['info bar', 'infobar', 'alert', 'notification', 'message bar', 'status', 'svelte'],
	canonical: '/docs/components/info-bar',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Info Bar — Fluent UI Svelte',
		description: 'A Fluent UI Svelte inline status message with severity levels and an optional close button.',
		type: 'article',
		url: '/docs/components/info-bar',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Info Bar — Fluent UI Svelte',
		description: 'A Fluent UI Svelte inline status message with severity levels and an optional close button.'
	},
	// GEO
	geo: {
		summary:
			'InfoBar is a Fluent UI Svelte component for app-wide status messages that are highly visible yet non-intrusive. It offers built-in severity levels (information, attention, warning, critical, success), inline and multiline styles, and an optional dismiss button.',
		topics: ['notifications', 'alerts', 'status messages', 'status & feedback'],
		entities: ['InfoBar', 'status', 'style', 'hideCloseButton', 'title'],
		category: 'Status & Feedback',
		faq: [
			{
				question: 'What severity levels does InfoBar support?',
				answer: "Set the status prop to 'information', 'attention', 'warning', 'critical', or 'success' to change the visual style and meaning."
			},
			{
				question: 'How do I make an InfoBar non-dismissible?',
				answer: 'Set the hideCloseButton prop to hide the close button so the message cannot be dismissed by the user.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'info-bar',
	status: '',
	icon: AppsListDetailRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
