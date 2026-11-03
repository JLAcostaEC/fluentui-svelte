import type { Meta } from '#types';
import { PersonRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Avatar',
	description:
		'A graphical representation of a user, team, or entity, showing an image, icon, or initials with optional presence status.',
	keywords: ['avatar', 'profile picture', 'user icon', 'initials', 'presence', 'persona', 'svelte'],
	canonical: '/docs/components/avatar',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Avatar — Fluent UI Svelte',
		description: 'A Fluent UI Svelte avatar that displays an image, icon, or initials with optional presence status.',
		type: 'article',
		url: '/docs/components/avatar',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Avatar — Fluent UI Svelte',
		description: 'A Fluent UI Svelte avatar that displays an image, icon, or initials with optional presence status.'
	},
	// Library-only
	slug: 'avatar',
	status: '',
	icon: PersonRegular
};
