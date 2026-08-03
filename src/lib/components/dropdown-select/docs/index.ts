import Docs from './docs.svx';
import Examples from './examples.svx';
import Footer from './footer.svx';
import LLMS from './llms.md?raw';
import type { ConfigDocs, Meta } from '$types';
import { ArrowAutofitDownRegular } from 'fluentui-icons-svelte';

export const META: Meta = {
	// SEO
	title: 'Dropdown Select',
	description: 'A native-select-based dropdown for choosing one or more options, with support for rich option content.',
	keywords: ['dropdown select', 'select', 'native select', 'combobox', 'multiselect', 'svelte'],
	canonical: '/docs/components/dropdown-select',
	robots: 'index, follow',
	locale: 'en_US',
	openGraph: {
		title: 'Dropdown Select — Fluent UI Svelte',
		description: 'A Fluent UI Svelte native-select dropdown for choosing one or more options.',
		type: 'article',
		url: '/docs/components/dropdown-select',
		siteName: 'Fluent UI Svelte'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Dropdown Select — Fluent UI Svelte',
		description: 'A Fluent UI Svelte native-select dropdown for choosing one or more options.'
	},
	// GEO
	geo: {
		summary:
			'DropdownSelect is a Fluent UI Svelte dropdown built on the native <select> element. It lets users choose one option (or several with the multiple prop) from DropdownSelectOption children, supports rich option content, and is currently an early-access prototype.',
		topics: ['selection', 'native select', 'dropdowns', 'forms'],
		entities: ['DropdownSelect', 'DropdownSelectOption', 'value', 'multiple', 'placeholder'],
		category: 'Inputs',
		faq: [
			{
				question: 'Is DropdownSelect production-ready?',
				answer:
					'No. It is an early-access prototype and will be rebuilt on FloatingUI Svelte, so its API may change significantly.'
			},
			{
				question: 'How is DropdownSelect different from Dropdown?',
				answer:
					'DropdownSelect is built on the native <select> element, whereas Dropdown is a fully custom flyout-based control.'
			}
		]
	},
	// Library-only (not SEO/GEO)
	slug: 'dropdown-select',
	status: 'Prototype',
	icon: ArrowAutofitDownRegular
};

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples],
	footer: Footer,
	llms: LLMS
};
