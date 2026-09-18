import type { BeforeOrAfter, PolymorphicProps, Sizes } from '$types';
import type { Snippet, Component } from 'svelte';
import type { HTMLAttributes, HTMLOlAttributes } from 'svelte/elements';

/** How the focus walks the trail. */
export type BreadcrumbFocusMode = 'tab' | 'arrow';

export type BreadcrumbItemGenerics = 'button' | 'a';

export type BreadcrumbItemElementDOMType = {
	button: HTMLButtonElement;
	a: HTMLAnchorElement;
};

/** @propsmith BreadcrumbProps */
export type BreadcrumbProps = {
	/** The DOM reference of the `nav`.
	 * @bindable
	 */
	ref?: HTMLElement;
	/** The DOM reference of the list.
	 * @bindable
	 */
	listRef?: HTMLOListElement;
	/** The props to spread on the list element.
	 * @type HTMLOlAttributes
	 */
	listProps?: HTMLOlAttributes;
	/** The size of every step and divider of the trail.
	 * @default 'medium'
	 */
	size?: Sizes;
	/** How the focus walks the trail: `tab` leaves every step its own tab stop, `arrow` gives the
	 * trail a single one and moves between steps with the arrow keys.
	 * @default 'tab'
	 */
	focusMode?: BreadcrumbFocusMode;
} & HTMLAttributes<HTMLElement>;

/** @propsmith BreadcrumbItemProps */
export type BreadcrumbItemProps = {
	/** The DOM reference of the item.
	 * @bindable
	 */
	ref?: HTMLLIElement;
} & HTMLAttributes<HTMLLIElement>;

/** @propsmith BreadcrumbButtonProps */
export type BreadcrumbButtonProps<T extends BreadcrumbItemGenerics = 'button'> = {
	/** The DOM reference of the step.
	 * @type BreadcrumbItemElementDOMType[T]
	 * @bindable
	 */
	ref?: BreadcrumbItemElementDOMType[T];
	/** The DOM element to render. A step that goes somewhere is an anchor and takes `href`.
	 * @type 'button' | 'a'
	 * @default 'button'
	 */
	as?: T;
	/** The icon to display beside the label.
	 * @type Snippet | Component
	 */
	icon?: Snippet | Component;
	/** Which side of the label the icon sits on.
	 * @default 'before'
	 */
	iconPosition?: BeforeOrAfter;
	/** Marks the step as the page the trail ends at, which is what `aria-current` announces.
	 * @default false
	 */
	current?: boolean;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** Keeps a disabled step focusable, so the tab order stays the same for a keyboard or screen
	 * reader user.
	 * @default false
	 */
	disabledFocusable?: boolean;
} & PolymorphicProps<T>;

/** @propsmith BreadcrumbDividerProps */
export type BreadcrumbDividerProps = {
	/** The DOM reference of the divider.
	 * @bindable
	 */
	ref?: HTMLLIElement;
} & HTMLAttributes<HTMLLIElement>;
