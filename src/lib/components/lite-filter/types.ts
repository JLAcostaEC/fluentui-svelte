import type { FSContext } from '#internal';
import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, SVGAttributes } from 'svelte/elements';
import type { PillButtonAppearance, PillButtonSize } from '../pill-button/types.ts';

/** @propsmith LiteFilterProps */
export type LiteFilterProps = {
	/** The DOM reference of the root element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
	/** The value of the selected item, or the values of the selected items when `multiple` is set.
	 * @type string | string[]
	 * @bindable
	 */
	selectedValue?: string | string[];
	/** Lets more than one item be selected, and none. */
	multiple?: boolean;
	/** The field name shared by every item. */
	name?: string;
	/** The id of the form that owns the items, when outside that form. */
	form?: string;
	/** Disables every item. */
	disabled?: boolean;
	/** The height and text size of the pills.
	 * @default 'medium'
	 */
	size?: PillButtonSize;
	/** The appearance of the pills.
	 * @default 'filled'
	 */
	appearance?: PillButtonAppearance;
	/** Fired when user interaction changes the selection. */
	onSelectionChange?: (event: Event, value: string | string[]) => void;
	/** Accessible name of the button that scrolls back.
	 * @default 'Scroll back'
	 */
	previousLabel?: string;
	/** Accessible name of the button that scrolls forward.
	 * @default 'Scroll forward'
	 */
	nextLabel?: string;
	/** The items of the filter. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/** @propsmith LiteFilterItemProps */
export type LiteFilterItemProps = {
	/** The DOM reference of the native input.
	 * @bindable
	 */
	ref?: HTMLInputElement | null;
	/** A unique value identifying this item within its filter. */
	value: string;
	/** An optional decorative Fluent icon before the label. */
	icon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	/** Disables this item. */
	disabled?: boolean;
	/** The label of the item. */
	children?: Snippet;
};

export type LiteFilterContext = FSContext<
	{
		readonly multiple: boolean;
		readonly name: string | undefined;
		readonly form: string | undefined;
		readonly disabled: boolean;
		readonly size: PillButtonSize;
		readonly appearance: PillButtonAppearance;
	},
	null,
	null,
	{
		isSelected: (value: string) => boolean;
		select: (event: Event, value: string, checked: boolean) => void;
	}
>;
