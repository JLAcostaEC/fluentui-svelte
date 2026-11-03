import type { Meta } from '#types';
import { CheckboxCheckedRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Checkbox',
	description: 'A control a user can check or clear, and that can also report an indeterminate (mixed) state.',
	keywords: ['checkbox', 'check box', 'toggle', 'indeterminate', 'form control', 'svelte'],
	canonical: '/docs/components/checkbox',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Checkbox — Fluent UI Svelte',
		description: 'A Fluent UI Svelte checkbox that supports checked, unchecked, and indeterminate states.',
		type: 'article',
		url: '/docs/components/checkbox',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Checkbox — Fluent UI Svelte',
		description: 'A Fluent UI Svelte checkbox that supports checked, unchecked, and indeterminate states.'
	},
	// Library-only
	slug: 'checkbox',
	status: '',
	icon: CheckboxCheckedRegular
};
