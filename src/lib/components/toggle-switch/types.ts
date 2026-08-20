import type { HTMLLabelAttributes, SvelteHTMLElements } from 'svelte/elements';

/** @propsmith ToggleSwitchProps */
export type ToggleSwitchProps = {
	/** Whether the switch is on.
	 * @bindable
	 */
	checked?: boolean;
	/** The DOM reference of the input element.
	 * @bindable
	 */
	ref?: HTMLInputElement;
	/** The label displayed next to the input element. */
	label?: string;
	/** The attributes to spread on the label wrapping the switch.
	 * @type HTMLLabelAttributes
	 */
	labelAttributes?: HTMLLabelAttributes;
	/** The DOM reference of the label element. */
	labelElement?: HTMLLabelElement;
} & SvelteHTMLElements['input'];
