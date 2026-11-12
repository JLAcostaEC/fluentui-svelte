import type { HTMLAttributes } from 'svelte/elements';
import type { Horientation } from '#types';

/** @propsmith FlipViewProps */
export type FlipViewProps = {
	/** The index of the visible item.
	 * @bindable
	 * @default 0
	 */
	index?: number;
	/** The direction the items flip in.
	 * @default 'horizontal'
	 */
	orientation?: Horientation;
	/** Accessible name of the previous button.
	 * @default 'Previous'
	 */
	previousLabel?: string;
	/** Accessible name of the next button.
	 * @default 'Next'
	 */
	nextLabel?: string;
	/** Called when the visible item changes. */
	onIndexChange?: (index: number) => void;
	/** The root element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
	/** The element that holds and scrolls the items.
	 * @bindable
	 */
	viewportRef?: HTMLDivElement | null;
} & HTMLAttributes<HTMLDivElement>;
