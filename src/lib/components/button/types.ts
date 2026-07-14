import type { Component, Snippet } from 'svelte';
import type { Appearances, BeforeOrAfter, PolymorphicProps, Shapes } from '$types';

export type ButtonGenerics = 'button' | 'a' | 'div';

export type ButtonProps<T extends ButtonGenerics = 'button'> = {
	/** Get the DOM reference of the button element. */
	ref?: ButtonElementDOMType[T];
	/** The DOM element to be render. `'button' | 'a' | 'div'` */
	as?: T;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** A button can be rounded, circular, or square. */
	shape?: Shapes;
	/** A button can have its content and borders styled for greater emphasis or to be subtle. */
	appearance?: Appearances;
	/** When set, allows the button to be focusable even when it has been disabled. This is used in scenarios where it is important to keep a consistent tab order for screen reader and keyboard users. The primary example of this pattern is when the disabled button is in a menu or a commandbar and is seldom used for standalone buttons. */
	disabledFocusable?: boolean;
	/** Add an icon that indicates the button triggers a menu. */
	isMenuButton?: boolean;
	/** Position of the icon relative to the button content. */
	indicatorPosition?: BeforeOrAfter;
	/** The icon used to indicate the button triggers a menu. */
	indicatorIcon?: Snippet<unknown[]> | Component<Record<string, unknown>>;
} & PolymorphicProps<T>;

export type ButtonElementDOMType = {
	button: HTMLButtonElement;
	a: HTMLAnchorElement;
	div: HTMLDivElement;
};

export type SplitButtonProps = PolymorphicProps<'div'> & {
	appearance?: Appearances;
	shape?: Shapes;
	disabled?: boolean;
	wrapperRef?: HTMLDivElement;
	primaryButtonRef?: HTMLButtonElement;
	menuTriggerRef?: HTMLButtonElement;
} & {
	primaryButtonProps: ButtonProps<'button'>;
	menuTriggerProps: ButtonProps<'button'>;
};
