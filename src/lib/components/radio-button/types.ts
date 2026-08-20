import type { HTMLInputAttributes } from 'svelte/elements';
import type { PolymorphicProps } from '$types';

/** @propsmith RadioButtonProps */
export type RadioButtonProps = {
	/** The label displayed next to the radio button. */
	label?: string;
	/** Bindable value representing a group of radio inputs that the input will be bound to.
	 * @bindable
	 */
	group?: unknown;
	/** Whether the radio button is selected.
	 * @default false
	 * @bindable
	 */
	checked?: boolean;
	/** The DOM reference of the radio button element.
	 * @bindable
	 */
	ref?: HTMLInputElement;
	/** The attributes to spread on the label wrapping the radio button.
	 * @type PolymorphicProps
	 */
	labelAttributes?: PolymorphicProps<'label'>;
} & HTMLInputAttributes;
