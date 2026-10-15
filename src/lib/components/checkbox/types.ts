import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';

/** @propsmith CheckboxProps */
export type CheckboxProps = {
	/** The DOM reference of the checkbox element.
	 * @bindable
	 */
	ref?: HTMLInputElement;
	/** The DOM reference of the checkbox wrapper element.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
	/** Renders the checkbox in its mixed state, neither checked nor unchecked.
	 * @bindable
	 */
	indeterminate?: boolean;
	/** The name submitted with the form. Falls back to the id of the checkbox.
	 * @default id
	 */
	name?: string | null;
	/** The value of the group of checkboxes this input belongs to. */
	group?: string | null;
	/** Whether the checkbox is checked.
	 * @bindable
	 */
	checked?: boolean;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** The content of the label associated with the checkbox.
	 * @type Snippet
	 */
	children?: Snippet;
} & Omit<HTMLInputAttributes, 'on:' | 'children'>;
