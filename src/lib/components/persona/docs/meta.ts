import type { Meta } from '#types';
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
	// Library-only
	slug: 'persona',
	status: '',
	icon: PersonNoteRegular
};
