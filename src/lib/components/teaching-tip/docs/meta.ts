import type { Meta } from '#types';
import { LightbulbRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	title: 'TeachingTip',
	description:
		'A flyout that points at an element to inform, remind and teach users about a feature, with an optional preview, a header, content and actions.',
	keywords: ['teaching tip', 'teachingtip', 'teaching popover', 'coach mark', 'tour', 'onboarding', 'flyout', 'svelte'],
	canonical: '/docs/components/teaching-tip',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'TeachingTip | Fluent UI Svelte',
		description: 'Point at an element to teach users about a feature, or walk them through a tour.',
		type: 'article',
		url: '/docs/components/teaching-tip',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'TeachingTip | Fluent UI Svelte',
		description: 'Point at an element to teach users about a feature, or walk them through a tour.'
	},
	slug: 'teaching-tip',
	status: 'AI',
	icon: LightbulbRegular
};
