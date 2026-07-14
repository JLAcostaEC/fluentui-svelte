import type { HTMLAnchorAttributes } from 'svelte/elements';

export type HyperlinkProps = {
	/** Disable the user interaction. */
	disabled?: boolean;
	/** The URL that the hyperlink points to. */
	ref?: HTMLAnchorElement;
} & HTMLAnchorAttributes;
