import type { FSContext } from '$internal';
import type { PolymorphicProps, Sizes } from '$types';
import type { Snippet, Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/** How the strip and every item in it is painted. */
export type TopNavAppearance = 'transparent' | 'subtle' | 'subtle-circular' | 'filled-circular';

/** An item is a button by default, and an anchor when it goes somewhere. */
export type TopNavItemGenerics = 'button' | 'a';

export type TopNavItemElementDOMType = {
	button: HTMLButtonElement;
	a: HTMLAnchorElement;
};

export type TopNavContext = FSContext<
	{
		appearance: TopNavAppearance;
		size: Sizes;
		vertical: boolean;
		disabled: boolean;
		selectTabOnFocus: boolean;
		reserveSelectedTabSpace: boolean;
	},
	{
		selectedValue: string;
	},
	null,
	{
		selectTab: (event: Event, value: string) => void;
	}
>;

/** @propsmith TopNavProps */
export type TopNavProps = {
	/** The DOM reference of the strip.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** The value of the selected item.
	 * @bindable
	 */
	selectedValue?: string;
	/** Fired when an item is selected. */
	onTabSelect?: (event: Event, value: string) => void;
	/** How the strip is painted: `transparent` has no background of its own, `subtle` fills an item
	 * while it is engaged, and the two circular appearances trade the moving bar for a pill.
	 * @default 'transparent'
	 */
	appearance?: TopNavAppearance;
	/** The size of every item of the strip.
	 * @default 'medium'
	 */
	size?: Sizes;
	/** Arranges the items in a column, with the bar down their leading edge.
	 * @default false
	 */
	vertical?: boolean;
	/** Disables the user interaction on every item.
	 * @default false
	 */
	disabled?: boolean;
	/** Selects an item as soon as the focus reaches it, rather than waiting to be asked.
	 * @default false
	 */
	selectTabOnFocus?: boolean;
	/** A selected item sets its label in semibold, which is wider than the same label at rest. This
	 * holds that width from the start, so selecting an item never shifts the ones beside it.
	 * @default true
	 */
	reserveSelectedTabSpace?: boolean;
	/** Opts the strip out of the tabspot focus management, to wire your own.
	 * @default false
	 */
	disableTabspot?: boolean;
} & HTMLAttributes<HTMLDivElement>;

/** @propsmith TopNavItemProps */
export type TopNavItemProps<T extends TopNavItemGenerics = 'button'> = {
	/** The DOM reference of the item.
	 * @type TopNavItemElementDOMType[T]
	 * @bindable
	 */
	ref?: TopNavItemElementDOMType[T];
	/** The DOM element to render. An anchor takes the attributes of one, `href` among them, and is
	 * what an item that navigates should be.
	 * @type 'button' | 'a'
	 * @default 'button'
	 */
	as?: T;
	/** The value that identifies the item. Defaults to a generated id. */
	value?: string;
	/** The icon to display before the label.
	 * @type Snippet | Component
	 */
	icon?: Snippet | Component;
	/** Disables the user interaction. */
	disabled?: boolean;
} & PolymorphicProps<T>;
