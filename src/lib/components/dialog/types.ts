import type { Snippet } from 'svelte';
import type { FSContext } from '$internal';
import type { HTMLAttributes } from 'svelte/elements';
import type { ButtonProps } from '../button/types.ts';
import type { PolymorphicProps, XDirection } from '$types';

export type DialogType = 'modal' | 'non-modal' | 'alert';
export type DialogAnimation = 'fade' | 'zoom' | 'slide' | 'bounce';
export type DialogDuration =
	number | 'fast' | 'normal' | 'slow' | 'slower' | 'very-slow' | 'extra-slow' | `--${string}`;
export type DialogPosition =
	| 'top-start'
	| 'top-center'
	| 'top-end'
	| 'middle-start'
	| 'middle-center'
	| 'middle-end'
	| 'bottom-start'
	| 'bottom-center'
	| 'bottom-end';
export type DialogTitleTag = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/** @propsmith DialogProps */
export type DialogProps = {
	/** How the dialog behaves once open.
	 *
	 * `modal`: blocks the page behind it and traps the focus.
	 *
	 * `non-modal`: leaves the page behind it interactive.
	 *
	 * `alert`: a modal that cannot be dismissed with Escape or by clicking outside.
	 * @default 'modal'
	 */
	type?: DialogType;
	/** Where the dialog sits in the viewport. Start and end follow the text direction.
	 * @default 'middle-center'
	 */
	position?: DialogPosition;
	/** The entrance and exit animation. Bounce uses a subtle overshoot.
	 * @default 'zoom'
	 */
	animation?: DialogAnimation;
	/** Duration in milliseconds, a theme duration name, or a CSS custom property name. Use 0 for no motion.
	 * @default 'normal'
	 */
	duration?: DialogDuration;
	/** Controls the open state of the dialog.
	 * @bindable
	 */
	open?: boolean | null;
	/** Called whenever the dialog opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** The parts of the dialog: a trigger and a surface. */
	children?: Snippet;
};

/** @propsmith DialogSurfaceProps */
export type DialogSurfaceProps = {
	/** The DOM reference of the dialog element.
	 * @bindable
	 */
	ref?: HTMLDialogElement | null;
} & HTMLAttributes<HTMLDialogElement>;

/** @propsmith DialogTriggerProps */
export type DialogTriggerProps = {
	/** The DOM reference of the trigger element.
	 * @bindable
	 */
	ref?: HTMLButtonElement | null;
} & ButtonProps<'button'>;

/** @propsmith DialogContentProps */
export type DialogContentProps = {
	/** The DOM reference of the content element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
} & HTMLAttributes<HTMLDivElement>;

/** @propsmith DialogActionsProps */
export type DialogActionsProps = {
	/** The DOM reference of the actions element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
	/** Stretches every action to share the available width evenly. */
	fluid?: boolean;
	/** Where the actions sit along the main axis.
	 * @default 'end'
	 */
	position?: XDirection;
} & HTMLAttributes<HTMLDivElement>;

type DialogTitleRefType = {
	div: HTMLDivElement;
	h1: HTMLHeadingElement;
	h2: HTMLHeadingElement;
	h3: HTMLHeadingElement;
	h4: HTMLHeadingElement;
	h5: HTMLHeadingElement;
	h6: HTMLHeadingElement;
};

/** @propsmith DialogTitleProps */
export type DialogTitleProps<T extends DialogTitleTag> = {
	/** The DOM reference of the title element.
	 * @type HTMLDivElement | HTMLHeadingElement
	 * @bindable
	 */
	ref?: DialogTitleRefType[T] | null;
	/** The HTML element to render the title as.
	 * @type DialogTitleTag
	 * @default 'h3'
	 */
	as?: T;
} & PolymorphicProps<T>;

export type DialogContext = FSContext<
	{
		type: DialogType;
		position: DialogPosition;
		animation: DialogAnimation;
		duration: DialogDuration;
	},
	{
		dialogRef: HTMLDialogElement | undefined;
		readonly open: boolean | null | undefined;
		/** Set by `DialogTitle`, to allow the surface pointing `aria-labelledby` at it. */
		titleId: string | undefined;
	},
	null,
	{
		openDialog: () => void;
		closeDialog: () => void;
	}
>;
