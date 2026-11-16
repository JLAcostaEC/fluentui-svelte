import type { ComputePositionConfig, Placement } from '@floating-ui/dom';
import type { FSContext } from '#internal';
import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/** @propsmith TeachingTipProps */
export type TeachingTipProps = {
	/** The DOM reference of the teaching tip element.
	 * @bindable
	 */
	ref?: HTMLElement | null;
	/** The id of the teaching tip element. Falls back to a generated one. */
	id?: string;
	/** Controls the open state of the teaching tip.
	 * @default false
	 * @bindable
	 */
	open?: boolean;
	/** Called whenever the teaching tip opens or closes from within. */
	onOpenChange?: (open: boolean) => void;
	/** The element the teaching tip points at. Without it, the teaching tip stays in the normal flow. */
	target?: HTMLElement | null;
	/** Where the teaching tip is placed relative to its target.
	 * @default 'top'
	 */
	placement?: Placement;
	/** The position configuration handed over to floating-ui.
	 * @type ComputePositionConfig
	 */
	positionConfig?: Partial<ComputePositionConfig>;
	/** Closes the teaching tip on a click outside of it and its target.
	 * @default false
	 */
	lightDismiss?: boolean;
	/** The parts of the teaching tip: a preview, a header, the content and a footer. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/** @propsmith TeachingTipPreviewProps */
export type TeachingTipPreviewProps = {
	/** The DOM reference of the preview element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
	/** The media to preview, usually an image. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/** @propsmith TeachingTipHeaderProps */
export type TeachingTipHeaderProps = {
	/** The DOM reference of the header element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
	/** The title of the teaching tip. A snippet or a component receives the id the teaching tip is labelled by.
	 * @type Snippet | Component | string
	 */
	title: Snippet<[attrs: { id: string }]> | Component<{ id: string }> | string;
	/** The level of the heading that holds a string title, to fit the headings of the page around it.
	 * @default 3
	 */
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
	/** The icon rendered before the title.
	 * @type Snippet | Component
	 */
	icon?: Snippet | Component;
	/** A second line of text below the title.
	 * @type Snippet | Component | string
	 */
	description?: Snippet | Component | string;
	/** The current step of a tour. The step counter shows when `totalSteps` is set too. */
	step?: number;
	/** The number of steps of a tour. The step counter shows when `step` is set too. */
	totalSteps?: number;
	/** Formats the text of the step counter, which reads "1 of 3" by default. */
	formatStep?: (step: number, totalSteps: number) => string;
	/** Removes the button that closes the teaching tip. */
	hideCloseButton?: boolean;
	/** The accessible name of the close button.
	 * @default 'Close'
	 */
	closeLabel?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>;

/** @propsmith TeachingTipFooterProps */
export type TeachingTipFooterProps = {
	/** The DOM reference of the footer element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
	/** The actions rendered inside the footer.
	 * @type Snippet | Component
	 */
	action?: Snippet | Component;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type TeachingTipContext = FSContext<
	{
		/** The id of the teaching tip, which every part uses to build its own ids. */
		readonly id: string;
	},
	{
		readonly open: boolean;
	},
	null,
	{
		close: () => void;
	}
>;
