import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLOptionAttributes, HTMLSelectAttributes } from 'svelte/elements';

/** @propsmith DropdownSelectProps */
export type DropdownSelectProps = {
	/** The selected value. An array of values when `multiple` is set.
	 * @type string | string[]
	 * @default multiple ? [] : ''
	 * @bindable
	 */
	value?: string | string[];
	/** Allows more than one option to be selected at a time. */
	multiple?: boolean;
	/** The text shown while no option is selected.
	 * @default 'Native Select Dropdown'
	 */
	placeholder?: string;
	/** Keeps the placeholder out of the option list once a value is selected. */
	hidePlaceholder?: boolean;
	/** The DOM reference of the select element.
	 * @bindable
	 */
	ref?: HTMLSelectElement;
	/** The DOM reference of the wrapper element.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperProps?: HTMLAttributes<HTMLDivElement>;
} & HTMLSelectAttributes;

/** @propsmith DropdownSelectOptionProps */
export type DropdownSelectOptionProps = {
	/** The value reported to the select when the option is picked. */
	value?: string;
	/** The label of the option. Falls back to the rendered children. */
	text?: string;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** The DOM reference of the option element.
	 * @bindable
	 */
	ref?: HTMLElement;
	/** The content of the option, used when no `text` is given. */
	children?: Snippet;
} & HTMLOptionAttributes;
