import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { SwipeRightRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Toggle Switch',
	description: 'A switch that lets someone choose between two mutually exclusive options with an immediate result.',
	keywords: ['toggle switch', 'switch', 'toggle', 'on off', 'boolean input', 'svelte'],
	canonical: '/docs/components/toggle-switch',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Toggle Switch — Fluent UI Svelte',
		description: 'A Fluent UI Svelte switch for choosing between two mutually exclusive options.',
		type: 'article',
		url: '/docs/components/toggle-switch',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Toggle Switch — Fluent UI Svelte',
		description: 'A Fluent UI Svelte switch for choosing between two mutually exclusive options.'
	},
	// GEO
	geo: {
		summary:
			'ToggleSwitch is a Fluent UI Svelte control representing a physical switch for choosing between two mutually exclusive options such as On/Off or Show/Hide. Choosing an option produces an immediate result. It supports a label, checked and disabled states.',
		topics: ['forms', 'boolean input', 'switches', 'settings'],
		entities: ['ToggleSwitch', 'checked', 'label', 'disabled'],
		category: 'Inputs',
		faq: [
			{
				question: 'When should I use a ToggleSwitch instead of a Checkbox?',
				answer: 'Use a ToggleSwitch when choosing an option should produce an immediate result, such as turning a setting on or off.'
			},
			{
				question: 'How do I add a label to a ToggleSwitch?',
				answer: 'Pass the label prop; use labelAttributes and labelElement for additional label customization.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'toggle-switch',
	status: '',
	icon: SwipeRightRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
