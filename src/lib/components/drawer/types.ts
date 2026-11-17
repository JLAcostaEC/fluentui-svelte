import type { FSContext } from '#internal';
import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type DrawerType = 'modal' | 'non-modal' | 'alert' | 'inline';
export type DrawerPosition = 'start' | 'end' | 'top' | 'bottom';
export type DrawerSize = 'small' | 'medium' | 'large' | 'full';
/** What closes the drawer from within: Escape, a click on the backdrop, the close button of the header or a parent drawer that closes. */
export type DrawerCloseReason = 'escape' | 'backdrop' | 'close-button' | 'parent';

/** @propsmith DrawerProps */
export type DrawerProps = {
	/** The DOM reference of the drawer element.
	 * @type HTMLDialogElement | HTMLDivElement
	 * @bindable
	 */
	ref?: HTMLDialogElement | HTMLDivElement | null;
	/** The id of the drawer element. Falls back to a generated one. */
	id?: string;
	/** Controls the open state of the drawer.
	 * @default false
	 * @bindable
	 */
	open?: boolean;
	/** Called whenever the drawer opens or closes from within. */
	onOpenChange?: (open: boolean) => void;
	/** How the drawer behaves once open.
	 *
	 * `modal`: overlays the page, blocks it and traps the focus.
	 *
	 * `non-modal`: overlays the page and leaves it interactive.
	 *
	 * `alert`: a modal that cannot be dismissed with Escape or by clicking outside.
	 *
	 * `inline`: sits in the layout next to the content and pushes it aside.
	 * @default 'modal'
	 */
	type?: DrawerType;
	/** The edge the drawer opens from. Start and end follow the text direction.
	 * @default 'start'
	 */
	position?: DrawerPosition;
	/** The width of the drawer, or its height at the top or the bottom: a preset (320px, 592px, 940px, the whole viewport) or any CSS length.
	 * @type DrawerSize | string
	 * @default 'small'
	 * @bindable
	 */
	size?: DrawerSize | (string & {});
	/** Detaches the drawer from the edge of the viewport, with rounded corners and a shadow. */
	floating?: boolean;
	/** Removes the dimmed backdrop behind a modal drawer. A click outside still closes it. */
	hideBackdrop?: boolean;
	/** Adds a handle on the inner edge that resizes the drawer with the pointer or the arrow keys. */
	resizable?: boolean;
	/** The accessible name of the resize handle.
	 * @default 'Resize'
	 */
	resizeLabel?: string;
	/** Called before the drawer closes from within. Return `false` to keep it open. */
	onBeforeClose?: (reason: DrawerCloseReason) => boolean | void;
	/** The parts of the drawer: a header, a body and a footer. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

/** @propsmith DrawerHeaderProps */
export type DrawerHeaderProps = {
	/** The DOM reference of the header element.
	 * @bindable
	 */
	ref?: HTMLElement | null;
	/** The title of the drawer. A snippet or a component receives the id the drawer is labelled by.
	 * @type Snippet | Component | string
	 */
	title: Snippet<[attrs: { id: string }]> | Component<{ id: string }> | string;
	/** The level of the heading that holds a string title, to fit the headings of the page around it.
	 * @default 2
	 */
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
	/** Extra actions rendered before the close button.
	 * @type Snippet | Component
	 */
	action?: Snippet | Component;
	/** Removes the button that closes the drawer. */
	hideCloseButton?: boolean;
	/** The accessible name of the close button.
	 * @default 'Close'
	 */
	closeLabel?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'>;

/** @propsmith DrawerBodyProps */
export type DrawerBodyProps = {
	/** The DOM reference of the body element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
} & HTMLAttributes<HTMLDivElement>;

/** @propsmith DrawerFooterProps */
export type DrawerFooterProps = {
	/** The DOM reference of the footer element.
	 * @bindable
	 */
	ref?: HTMLElement | null;
} & HTMLAttributes<HTMLElement>;

export type DrawerContext = FSContext<
	{
		/** The id of the drawer, which every part uses to build its own ids. */
		readonly id: string;
		/** 0 for a drawer at the root, 1 for a drawer inside it, and on. */
		readonly level: number;
	},
	{
		readonly open: boolean;
	},
	null,
	{
		close: (reason: DrawerCloseReason) => void;
	}
>;
