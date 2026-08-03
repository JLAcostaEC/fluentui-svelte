import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { ReadingModeMobileRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Dialog',
	description:
		'A window overlaid on the page that requires user attention, composed of trigger, surface, title, content, and actions.',
	keywords: ['dialog', 'modal', 'popup', 'overlay', 'alert dialog', 'svelte'],
	canonical: '/docs/components/dialog',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Dialog — Fluent UI Svelte',
		description: 'A Fluent UI Svelte dialog window composed of trigger, surface, title, content, and actions.',
		type: 'article',
		url: '/docs/components/dialog',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Dialog — Fluent UI Svelte',
		description: 'A Fluent UI Svelte dialog window composed of trigger, surface, title, content, and actions.'
	},
	// GEO
	geo: {
		summary:
			'Dialog is a Fluent UI Svelte window overlaid on the page. Content outside a modal dialog is inert. It is composed of Dialog (root/context), DialogTrigger, DialogSurface (the <dialog> element), DialogTitle, DialogContent, and DialogActions. The dialog type can be modal, non-modal, or alert.',
		topics: ['overlays', 'modals', 'dialogs', 'accessibility'],
		entities: ['Dialog', 'DialogTrigger', 'DialogSurface', 'DialogTitle', 'DialogContent', 'DialogActions'],
		category: 'Overlays',
		faq: [
			{
				question: 'What components make up a Dialog?',
				answer:
					'Dialog (root/context), DialogTrigger, DialogSurface, DialogTitle, DialogContent, and DialogActions work together through a shared context.'
			},
			{
				question: 'How do I close a Dialog programmatically?',
				answer:
					'Bind the Dialog with bind:this and call its closeDialog() method, or control it with the bindable open prop.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'dialog',
	status: '',
	icon: ReadingModeMobileRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
