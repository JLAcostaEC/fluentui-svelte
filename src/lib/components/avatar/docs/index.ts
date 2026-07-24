import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
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
	// GEO
	geo: {
		summary:
			'Avatar is a Fluent UI Svelte component that gives a graphical representation of a user, team, or entity. It can display an image, an icon, or initials derived from a name, and supports different sizes, shapes, colors, activity indicators, and a presence badge.',
		topics: ['user representation', 'profile images', 'initials', 'presence status', 'data display'],
		entities: ['Avatar', 'PresenceBadge', 'name', 'image', 'icon', 'badge', 'shape', 'color', 'idForColor'],
		category: 'Data Display',
		faq: [
			{
				question: 'What does an Avatar display when no image is provided?',
				answer:
					'When there is no image, the Avatar shows the initials derived from the name prop. If neither an image nor initials are available, it can display an icon instead.'
			},
			{
				question: 'How does the colorful color option pick a color?',
				answer:
					'Setting color to "colorful" automatically picks a color based on the name prop. When a name is unavailable, idForColor can be used to determine the color from another unique identifier.'
			},
			{
				question: 'How do I show a presence status on an Avatar?',
				answer:
					'Pass a badge object such as badge={{ status: "available" }} to display a presence badge. See the PresenceBadge component for the available statuses.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'avatar',
	status: '',
	icon: PersonRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
