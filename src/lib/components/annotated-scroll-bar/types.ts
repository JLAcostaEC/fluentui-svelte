import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/** Where a label starts: an offset in pixels or the element it names. */
type Start =
	| {
			/** The pixels from the top of the content. */
			offset: number;
			selector?: never;
	  }
	| {
			/** A CSS selector of the element in the content. */
			selector: string;
			offset?: never;
	  };

/** A label on the rail. */
export type AnnotatedScrollBarLabel = Start & {
	/** The text of the label. */
	label: string;
	/** The labels within this one, such as the months of a year. */
	subgroups?: readonly (Start & { label: string })[];
};

/** The position the rail points at. */
export type AnnotatedScrollBarDetail = {
	/** The content offset in pixels. */
	offset: number;
	/** The label at the offset. */
	label?: string;
	/** The subgroups at the offset. */
	subgroups: string[];
};

/** @propsmith AnnotatedScrollBarProps */
export type AnnotatedScrollBarProps = {
	/** The element to scroll. */
	scrollRef: HTMLElement | null;
	/** The labels. Without them, the bar reads them from the content with `selector`. */
	labels?: readonly AnnotatedScrollBarLabel[];
	/** A CSS selector of the elements in the content that start a label.
	 * @default '[data-scroll-label]'
	 */
	selector?: string;
	/** The side of the content the bar is on.
	 * @default 'right'
	 */
	position?: 'left' | 'right';
	/** Pixels scrolled per arrow press.
	 * @default 48
	 */
	arrowStep?: number;
	/** The minimum space in pixels between labels.
	 * @default 4
	 */
	labelSpacing?: number;
	/** Hides the arrow buttons. */
	hideArrows?: boolean;
	/** Hides the subgroup labels on the rail. */
	hideSubgroups?: boolean;
	/** Disables the bar. */
	disabled?: boolean;
	/** The content of the tooltip that previews a position.
	 * @type Snippet
	 */
	detail?: Snippet<[AnnotatedScrollBarDetail]>;
	/** Called before the bar scrolls the content. Return `false` to cancel. */
	onScrolling?: (offset: number, kind: 'click' | 'drag' | 'arrow' | 'wheel' | 'keyboard') => boolean | void;
	/** The root element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
