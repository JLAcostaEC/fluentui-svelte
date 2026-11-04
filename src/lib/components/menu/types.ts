import type { ComputePositionConfig, VirtualElement } from '@floating-ui/dom';
import type { FSContext } from '#internal';
import type { Component, Snippet } from 'svelte';
import type { NoUndefinedField, Shapes } from '#types';
import type { AriaAttributes, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { ButtonProps } from '../button/types.ts';

export type MenuContext = FSContext<
	{ id: string; isSubMenu: boolean; parentHasCheckmarks: boolean; parentHasIcons: boolean } & Omit<
		MenuProps,
		'element' | 'children' | 'onOpenChange' | 'open' | 'onCheckedValueChange' | 'checkedValues'
	>,
	MenuState,
	NoUndefinedField<Pick<MenuProps, 'onCheckedValueChange' | 'onOpenChange'>>,
	{
		toggle: (e: Event) => void;
		open: (e: Event) => void;
		close: (e: Event) => void;
		toggleCheckbox: (e: Event, value: string, name: string) => void;
		toggleRadio: (e: Event, value: string, name: string) => void;
	}
>;

export type MenuState = {
	open: boolean | undefined;
	ref: HTMLElement | VirtualElement | null | undefined;
	locked: boolean;
	checkedValues: MenuProps['checkedValues'];
};

/** @propsmith MenuProps */
export type MenuProps = {
	/** The position configuration handed over to floating-ui.
	 * @type ComputePositionConfig
	 */
	positionConfig?: Partial<ComputePositionConfig>;
	/** Reserves the room every item needs for an icon, so the labels line up. */
	hasIcons?: boolean;
	/** Reserves the room every item needs for a checkmark, so the labels line up. */
	hasCheckmarks?: boolean;
	/** Controls the open state of the menu. */
	open?: boolean;
	/** Called whenever the menu opens or closes. */
	onOpenChange?: (e: Event, open: boolean) => void;
	/** The checked values of the menu, grouped by the `name` of each item.
	 * @default {}
	 */
	checkedValues?: Record<string, string[]>;
	/** Called whenever a checkbox or radio item changes.
	 * @type (e: Event, checkedValues: Record<string, string[]>) => void
	 */
	onCheckedValueChange?: (e: Event, checkedValues: Record<string, string[]>) => void;
	/** Opens the menu on hover instead of on click.
	 * @default false
	 */
	openOnHover?: boolean;
	/** How long to wait, in milliseconds, before opening the menu.
	 * @default 0
	 */
	openingDelay?: number;
	/** Keeps the menu open after an item is activated.
	 * @default false
	 */
	persistOnItemActivation?: boolean;
	/** The parts of the menu: a trigger and a popover. */
	children?: Snippet;
};

/** @propsmith MenuPopoverProps */
export type MenuPopoverProps = {
	/** The element used to position the popover. */
	ref?: HTMLElement | null;
	/** Controls the open state of the popover.
	 * @bindable
	 */
	open?: boolean | null;
	/** Keeps the popover mounted in the DOM while it is closed.
	 * @default false
	 */
	keepMounted?: boolean;
	/** Where the popover is positioned relative to its trigger. */
	placement?: ComputePositionConfig['placement'];
	/** The position configuration handed over to floating-ui.
	 * @type ComputePositionConfig
	 */
	positionConfig?: Partial<ComputePositionConfig>;
	/** The content of the popover. */
	children: Snippet;
};

/** @propsmith MenuTriggerProps */
export type MenuTriggerProps = {
	/** Disables the user interaction. */
	disabled?: boolean;
	/** The trigger can be rounded, circular, or square. */
	shape?: Shapes;
	/** An optional icon for the trigger.
	 * @type Snippet | Component
	 */
	icon?: Snippet | Component;
	/** A custom trigger. It receives the menu state and the props to spread on your own buttons.
	 * @type Snippet
	 */
	children?: Snippet<
		[
			{
				state: MenuState;
				menuTriggerProps: ButtonProps<'button'>;
				primaryButtonProps: ButtonProps<'button'>;
			}
		]
	>;
};

/** @propsmith MenuGroupProps */
export type MenuGroupProps = {
	/** The DOM reference of the group element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
	/** The label of the group. */
	header?: string;
	/** The items of the group. */
	children: Snippet;
};

/** @propsmith MenuItemProps */
export type MenuItemProps = {
	/** The icon to display before the label.
	 * @type Snippet | Component
	 */
	icon?: Snippet<[{ class: string }]> | Component<{ class: string }>;
	/** Right aligned text, usually a keyboard shortcut. */
	secondaryContent?: string;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** A second line of text below the label. */
	subText?: string;
	/** Renders the item as a link pointing to this URL. */
	href?: string;
};

/** @propsmith MenuItemActionableProps */
export type MenuItemActionableProps = {
	/** Whether the item is checked.
	 * @bindable
	 */
	checked?: boolean | null;
	/** The value reported to the menu when the item is checked. Falls back to the id of the item.
	 * @default id
	 */
	value?: string;
	/** The group of items this one belongs to. Falls back to the id of the item.
	 * @default id
	 */
	name?: string;
} & Omit<MenuItemProps, 'href'> &
	ButtonProps<'button'>;
/** @propsmith MenuCommandBarProps */
export type MenuCommandBarProps = {
	/** The DOM reference of the command bar element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
	/** Where the bar sits in the menu. A bar at the top has its divider below it, and one at the bottom has it above.
	 * @type 'top' | 'bottom'
	 * @default 'top'
	 */
	position?: 'top' | 'bottom';
	/** The accessible name of the group of commands.
	 * @default 'Commands'
	 */
	label?: string;
	/** The accessible name of the button that opens the overflow.
	 * @default 'More options'
	 */
	overflowLabel?: string;
	/** The secondary commands. When present, a "more" button at the end of the bar opens them in a submenu. */
	overflow?: Snippet;
	/** Shows the label of every command below its icon. Without labels, every command is a square.
	 * @default false
	 */
	showLabels?: boolean;
	/** Draws a divider between every two commands.
	 * @default false
	 */
	showDividers?: boolean;
	/** The primary commands, as `MenuCommandBarItem`s. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>;

/** @propsmith MenuCommandBarItemProps */
export type MenuCommandBarItemProps = {
	/** The DOM reference of the button element.
	 * @bindable
	 */
	ref?: HTMLButtonElement | null;
	/** The icon of the command.
	 * @type Snippet | Component
	 */
	icon: Snippet<[{ class: string }]> | Component<{ class: string }>;
	/** The name of the command. Without visible labels it is the accessible name of the button and shows as its tooltip; with them it shows below the icon. */
	label: string;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** Called when the command is activated. The menu closes afterwards, unless it persists on item activation.
	 * @type (e: MouseEvent) => void
	 */
	onclick?: (e: MouseEvent) => void;
} & Omit<AriaAttributes, 'aria-label'> &
	Pick<HTMLButtonAttributes, 'id' | 'class' | 'onkeydown' | 'onfocus' | 'onblur'>;
