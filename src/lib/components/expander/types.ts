import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, HTMLDetailsAttributes, SVGAttributes } from 'svelte/elements';

export type ExpanderProps = {
	/** Label of the expander. */
	header: string;
	/** Description to render below the header. */
	description?: string;
	/** Set the opening direction of the expander. */
	direction?: 'down' | 'up';
	/** The expander is justified to the full width of the container. */
	justify?: boolean;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** The animation configuration. */
	animation?: {
		duration: number;
		easing: string;
	};
	/** Control the opening state of the expander. */
	expanded?: boolean;
	/** Get the DOM reference of the expander element. */
	ref?: HTMLDetailsElement;
	/** The icon to display before the label. */
	Icon?: Snippet<[SVGAttributes<SVGElement>] | []> | Component<SVGAttributes<SVGElement>>;
	summaryRef?: HTMLElement;
	/** The props to spread on the summary element. */
	summaryProps?: HTMLAttributes<HTMLElement>;
} & HTMLDetailsAttributes;
