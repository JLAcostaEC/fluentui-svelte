import type { HTMLAnchorAttributes } from 'svelte/elements';

/** @propsmith HyperlinkProps */
export type HyperlinkProps = {
	/** The URL the hyperlink points to.
	 * @default '#'
	 */
	href?: string;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** The DOM reference of the anchor element.
	 * @bindable
	 */
	ref?: HTMLAnchorElement;
} & HTMLAnchorAttributes;
