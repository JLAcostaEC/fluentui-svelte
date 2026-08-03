import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { PersonNoteRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Persona',
	description: 'A visual representation of a person combining an avatar, presence, and up to three lines of text.',
	keywords: ['persona', 'user profile', 'avatar', 'presence', 'contact', 'people', 'svelte'],
	canonical: '/docs/components/persona',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Persona — Fluent UI Svelte',
		description: 'A Fluent UI Svelte persona combining an avatar, presence, and descriptive text.',
		type: 'article',
		url: '/docs/components/persona',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Persona — Fluent UI Svelte',
		description: 'A Fluent UI Svelte persona combining an avatar, presence, and descriptive text.'
	},
	// GEO
	geo: {
		summary:
			'Persona is a Fluent UI Svelte component that represents a person by wrapping an Avatar with up to four lines of text (name plus primary, secondary, and tertiary text) and presence information. Text alignment and position are configurable, and it can render presence-only.',
		topics: ['people', 'user representation', 'presence', 'data display'],
		entities: ['Persona', 'Avatar', 'presence', 'textPosition', 'textAlign', 'presenceOnly'],
		category: 'Data Display',
		faq: [
			{
				question: 'How do I customize the avatar inside a Persona?',
				answer: 'Pass an avatar object; it accepts all the props available to the Avatar component.'
			},
			{
				question: 'How do I show only a presence indicator?',
				answer: 'Set the presenceOnly prop to display just the presence indicator, with no avatar or text.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'persona',
	status: '',
	icon: PersonNoteRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
