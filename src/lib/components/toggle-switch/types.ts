import type { HTMLLabelAttributes, SvelteHTMLElements } from 'svelte/elements';

export type ToggleSwitchProps = {
	/** Get the DOM reference of the input element. */
	ref?: HTMLInputElement;
	/** The label displayed next to the input element. */
	label?: string;
	/** Attributes to be spread on the label wrapper element. */
	labelAttributes?: HTMLLabelAttributes;
	/** Get the DOM reference of the label element. */
	labelElement?: HTMLLabelElement;
} & SvelteHTMLElements['input'];
