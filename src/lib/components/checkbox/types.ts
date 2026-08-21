import type { HTMLInputAttributes } from 'svelte/elements';
import type { PolymorphicProps } from '$types';
import type { Snippet } from 'svelte';

/** @propsmith CheckboxProps */
export type CheckboxProps<T extends 'div' | 'label' = 'div'> = {
	/** The DOM reference of the checkbox element.
	 * @bindable
	 */
	ref?: HTMLInputElement;
	/** The DOM element used to wrap the checkbox. Use a label to make the whole wrapper toggle the checkbox.
	 * @type 'div' | 'label'
	 * @default 'div'
	 */
	wrapperAs?: T;
	/** The DOM reference of the checkbox wrapper element.
	 * @type HTMLDivElement | HTMLLabelElement
	 * @bindable
	 */
	wrapperRef?: WrapperRef[T];
	/** The attributes to spread on the wrapper element.
	 * @type PolymorphicProps
	 */
	wrapperAttributes?: PolymorphicProps<T>;
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
	/** The content of the label. Only rendered when wrapperAs is set to label.
	 * @type Snippet
	 */
	children?: T extends 'label' ? Snippet : never;
} & Omit<HTMLInputAttributes, 'on:' | 'children'>;

export type WrapperRef = {
	label: HTMLLabelElement;
	div: HTMLDivElement;
};
