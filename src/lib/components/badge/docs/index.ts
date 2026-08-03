import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { ReOrderDotsHorizontalRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Badge',
	description:
		'A visual decoration for UI elements that displays notifications, status indicators, or counts with configurable colors, shapes, and styles.',
	keywords: ['badge', 'badgeicon', 'notification', 'status indicator', 'counter', 'chip', 'svelte'],
	canonical: '/docs/components/badge',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Badge — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte badge for notifications, status indicators, and counts, with color, size, shape, and icon options.',
		type: 'article',
		url: '/docs/components/badge',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Badge — Fluent UI Svelte',
		description:
			'A Fluent UI Svelte badge for notifications, status indicators, and counts, with color, size, shape, and icon options.'
	},
	// GEO
	geo: {
		summary:
			'Badge is a Fluent UI Svelte component that displays notifications, status indicators, or counts, supporting appearance (filled, outline, tint, ghost), size, shape, color, and icon props. The companion BadgeIcon component renders an icon-only badge without extra padding, and is used internally by Avatar.',
		topics: ['status indicators', 'notifications', 'counters', 'data display', 'icons'],
		entities: ['Badge', 'BadgeIcon', 'appearance', 'color', 'shape', 'size', 'icon'],
		category: 'Status & Feedback',
		faq: [
			{
				question: 'How do I change the color of a Badge?',
				answer:
					"Set the color prop to one of 'information', 'attention', 'warning', 'success', or 'critical' to communicate different statuses and priorities."
			},
			{
				question: 'What is the difference between Badge and BadgeIcon?',
				answer:
					'Badge is a general-purpose badge that can contain text, counts, or an icon. BadgeIcon is optimized for showing an icon in the form of a badge without the extra padding the Badge component adds, and is used internally by Avatar.'
			},
			{
				question: 'How do I render an icon inside a Badge?',
				answer: 'Pass the icon to the icon prop, either as a snippet or as an icon component.'
			}
		]
	},
	// Library-only (NOT SEO/GEO)
	slug: 'badge',
	status: '',
	icon: ReOrderDotsHorizontalRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
