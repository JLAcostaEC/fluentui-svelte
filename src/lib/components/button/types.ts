import type { Component, Snippet } from 'svelte';
import type { Appearances, BeforeOrAfter, PolymorphicProps, Shapes } from '$types';

export type ButtonGenerics = 'button' | 'a' | 'div';

/** @propsmith ButtonProps */
export type ButtonProps<T extends ButtonGenerics = 'button'> = {
	/** The DOM reference of the button element.
	 * @type ButtonElementDOMType[T]
	 * @bindable
	 */
	ref?: ButtonElementDOMType[T];
	/** The DOM element to render.
	 * @type 'button' | 'a' | 'div'
	 * @default 'button'
	 */
	as?: T;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** A button can be rounded, circular, or square.
	 * @default 'rounded'
	 */
	shape?: Shapes;
	/** A button can have its content and borders styled for greater emphasis or to be subtle.
	 * @default 'accent'
	 */
	appearance?: Appearances;
	/** When set, allows the button to be focusable even when it has been disabled.
	 *
	 * This is used in scenarios where it is important to keep a consistent tab order for screen reader and keyboard
	 * users. The primary example of this pattern is when the disabled button is in a menu or a commandbar, and is
	 * seldom used for standalone buttons.
	 * @default false
	 */
	disabledFocusable?: boolean;
	/** Add an icon that indicates the button triggers a menu. */
	isMenuButton?: boolean;
	/** Position of the menu indicator relative to the button content.
	 * @default 'after'
	 */
	indicatorPosition?: BeforeOrAfter;
	/** The icon used to indicate the button triggers a menu.
	 * @type Snippet | Component
	 */
	indicatorIcon?: Snippet<unknown[]> | Component<Record<string, unknown>>;
} & PolymorphicProps<T>;

export type ButtonElementDOMType = {
	button: HTMLButtonElement;
	a: HTMLAnchorElement;
	div: HTMLDivElement;
};

/** @propsmith SplitButtonProps */
export type SplitButtonProps = {
	/** Both buttons can have their content and borders styled for greater emphasis or to be subtle.
	 * @default 'accent'
	 */
	appearance?: Appearances;
	/** Both buttons can be rounded, circular, or square.
	 * @default 'rounded'
	 */
	shape?: Shapes;
	/** Disables the user interaction on both buttons.
	 * @default false
	 */
	disabled?: boolean;
	/** The props to spread on the primary button.
	 * @type ButtonProps
	 */
	primaryButtonProps: ButtonProps<'button'>;
	/** The props to spread on the button that opens the menu.
	 * @type ButtonProps
	 */
	menuTriggerProps: ButtonProps<'button'>;
	/** The DOM reference of the element wrapping both buttons.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement;
	/** The DOM reference of the primary button.
	 * @bindable
	 */
	primaryButtonRef?: HTMLButtonElement;
	/** The DOM reference of the button that opens the menu.
	 * @bindable
	 */
	menuTriggerRef?: HTMLButtonElement;
} & PolymorphicProps<'div'>;
