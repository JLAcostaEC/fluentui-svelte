import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/** @propsmith AppWindowProps */
export type AppWindowProps = {
	/** The DOM reference of the window element.
	 * @bindable
	 */
	ref?: HTMLElement;
	/** The width of the window. A number is in pixels, a string is any CSS length.
	 * @default '100%'
	 */
	width?: number | string;
	/** The height of the window. A number is in pixels, a string is any CSS length.
	 * @default '100%'
	 */
	height?: number | string;
	/** Whether the window is the active one, which picks the shell shadow it casts: a deeper one while active, a lighter one while inactive.
	 * @default false
	 */
	active?: boolean;
	/** The content of the window, such as a `TitleBar` and the page below it. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
