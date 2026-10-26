import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLLabelAttributes } from 'svelte/elements';
import type { Sizes } from '$types';
import type { TooltipProps } from '../tooltip/types.ts';

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
	/** The id of the label element. A control inside the label is named after it, including a picker whose visible control stands in for its native field.
	 * @default Generated
	 */
	id?: string;
	/** The id of the field the label is for. Without it, the label is for the first field inside it, which takes a generated id when it has none of its own. With `labelPosition` `before` or `above` and a field that has an id of its own, pass that id here, so the server renders the association too.
	 * @default The field inside
	 */
	for?: string;
	/** More about the field, in a tooltip shown from a badge after the label text, on hover and on focus. People cannot move into a tooltip, so keep links and buttons out of it.
	 * @type string | Snippet | Component
	 */
	tooltipContent?: string | Snippet | Component;
	/** What the badge that shows the tooltip displays. Only rendered with `tooltipContent`.
	 * @type Snippet | Component
	 * @default InfoRegular
	 */
	tooltipBadge?: Snippet | Component;
	/** The props to spread on the tooltip.
	 * @type TooltipProps
	 */
	tooltipProps?: Omit<TooltipProps, 'content' | 'relationship' | 'children'>;
	/** The attributes to spread on the button of the badge. Its name is the label text followed by its `aria-label`.
	 * @type HTMLButtonAttributes
	 */
	tooltipButtonAttributes?: HTMLButtonAttributes;
} & Omit<HTMLLabelAttributes, 'for'>;
