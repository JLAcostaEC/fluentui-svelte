import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, HTMLDetailsAttributes, SVGAttributes } from 'svelte/elements';

/** @propsmith ExpanderProps */
export type ExpanderProps = {
	/** Label of the expander. */
	header: string;
	/** Description to render below the header. */
	description?: string;
	/** Set the opening direction of the expander.
	 * @default 'down'
	 */
	direction?: 'down' | 'up';
	/** The expander is justified to the full width of the container.
	 * @default false
	 */
	justify?: boolean;
	/** Disables the user interaction.
	 * @default false
	 */
	disabled?: boolean;
	/** The animation configuration. Reduced motion is always honoured over this. */
	animation?: {
		duration: number;
		easing: string;
	};
	/** Control the opening state of the expander.
	 * @default false
	 * @bindable
	 */
	expanded?: boolean;
	/** The DOM reference of the expander element.
	 * @bindable
	 */
	ref?: HTMLDetailsElement;
	/** The icon to display before the label.
	 * @type Snippet | Component
	 */
	Icon?: Snippet<[SVGAttributes<SVGElement>] | []> | Component<SVGAttributes<SVGElement>>;
	/** The DOM reference of the summary element.
	 * @bindable
	 */
	summaryRef?: HTMLElement;
	/** The props to spread on the summary element.
	 * @type HTMLAttributes
	 */
	summaryProps?: HTMLAttributes<HTMLElement>;
} & HTMLDetailsAttributes;
