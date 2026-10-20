import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLLabelAttributes } from 'svelte/elements';
import type { Sizes } from '$types';

/** @propsmith LabelProps */
export type LabelProps = {
	/** The element used to wrap the label and its field.
	 * @default 'div'
	 */
	as?: 'div' | 'span';
	/** The field described by the label, rendered beside the label text.
	 * @type Snippet
	 */
	children?: Snippet;
	/** The DOM reference of the wrapper element.
	 * @type HTMLDivElement | HTMLSpanElement
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement | HTMLSpanElement;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement | HTMLSpanElement>;
	/** The text of the label.
	 * @default 'Label Element'
	 */
	label?: string;
	/** The size of the label text.
	 * @default 'medium'
	 */
	size?: Sizes;
	/** The weight of the label text.
	 * @default 'regular'
	 */
	weight?: 'regular' | 'semibold';
	/** Where the label sits relative to the field it describes.
	 * @default 'after'
	 */
	labelPosition?: 'before' | 'after' | 'above' | 'below';
	/** Marks the field as required, and describes why through the given message. */
	required?: {
		abbr?: string;
		message: string;
	};
	/** Renders the label as disabled, to match the field it describes. */
	disabled?: boolean;
	/** The DOM reference of the label element.
	 * @bindable
	 */
	ref?: HTMLLabelElement;
	/** The id of the label element. Pickers name their visible control after the labels of their native field through it.
	 * @default Generated
	 */
	id?: string;
} & HTMLLabelAttributes;
