import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/** @propsmith AppSurfaceProps */
export type AppSurfaceProps = {
	/** The DOM reference of the surface element.
	 * @bindable
	 */
	ref?: HTMLElement;
	/** The material of the surface: a `layer` over the window, or the `mica` of the window itself.
	 * @default 'layer'
	 */
	mode?: 'layer' | 'mica';
	/** Whether the window the surface lives in is the active one, which picks the color of the surface.
	 * @default false
	 */
	active?: boolean;
	/** The content of the surface. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
