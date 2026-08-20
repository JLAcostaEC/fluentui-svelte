import type { ComputePositionConfig, VirtualElement } from '@floating-ui/dom';
import type { FSContext } from '$internal';
import type { Component, ComponentProps, Snippet } from 'svelte';
import type { NoUndefinedField, Shapes } from '$types';
import type { Button } from '../../index.ts';
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
	open: boolean;
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
	ref?: HTMLDivElement;
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
	checked?: boolean;
	/** The value reported to the menu when the item is checked. Falls back to the id of the item.
	 * @default id
	 */
	value?: string;
	/** The group of items this one belongs to. Falls back to the id of the item.
	 * @default id
	 */
	name?: string;
} & Omit<MenuItemProps, 'href'> &
	ComponentProps<typeof Button<'div'>>;
