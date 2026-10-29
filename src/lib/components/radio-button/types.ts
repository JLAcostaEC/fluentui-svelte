import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';

/** @propsmith RadioButtonProps */
export type RadioButtonProps = {
	/** The label displayed next to the radio button. Inside a `Label`, it is not rendered */
	label?: string;
	/** Bindable value representing a group of radio inputs that the input will be bound to.
	 * @bindable
	 */
	group?: unknown;
	/** Whether the radio button is selected.
	 * @default false
	 * @bindable
	 */
	checked?: boolean | null;
	/** The DOM reference of the radio button element.
	 * @bindable
	 */
	ref?: HTMLInputElement | null;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
	/** The DOM reference of the wrapper element.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement | null;
} & HTMLInputAttributes;
