import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';

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
	/** The label displayed next to the input element. Inside a `Label`, it is not rendered */
	label?: string;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
	/** The DOM reference of the wrapper element.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement;
} & HTMLInputAttributes;
