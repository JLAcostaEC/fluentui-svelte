import type { HTMLAttributes } from 'svelte/elements';
import type { Horientation } from '#types';

/** When the previous and next buttons are shown. */
export type PipsPagerButtonVisibility = 'hidden' | 'visible' | 'hover';

/** @propsmith PipsPagerProps */
export type PipsPagerProps = {
	/** The index of the selected page.
	 * @bindable
	 * @default 0
	 */
	index?: number;
	/** The number of pages. */
	numberOfPages: number;
	/** The number of pips shown at once; the rest scroll into view.
	 * @default 5
	 */
	maxVisiblePips?: number;
	/** The direction the pips are laid out in.
	 * @default 'horizontal'
	 */
	orientation?: Horientation;
	/** When the previous and next buttons are shown: never, always or on hover and focus.
	 * @default 'hidden'
	 */
	buttonVisibility?: PipsPagerButtonVisibility;
	/** Whether the buttons and arrow keys wrap from the last page to the first and back. */
	wrap?: boolean;
	/** Whether the page number replaces the dot on hover, on focus and briefly after a selection. */
	showNumbers?: boolean;
	/** Accessible name of the previous button.
	 * @default 'Previous page'
	 */
	previousLabel?: string;
	/** Accessible name of the next button.
	 * @default 'Next page'
	 */
	nextLabel?: string;
	/** Returns the accessible name of each pip from its page number.
	 * @default (page) => `Page ${page}`
	 */
	formatPage?: (page: number) => string;
	/** Called when the selected page changes. */
	onIndexChange?: (index: number) => void;
	/** The root element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
} & HTMLAttributes<HTMLDivElement>;
