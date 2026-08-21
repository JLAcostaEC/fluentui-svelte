import type { HTMLLabelAttributes } from 'svelte/elements';
import type { Sizes } from '$types';

/** @propsmith LabelProps */
export type LabelProps = {
	/** The text of the label. Falls back to the rendered children.
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
} & HTMLLabelAttributes;
