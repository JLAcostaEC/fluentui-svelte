import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLSelectAttributes } from 'svelte/elements';
import type { ListViewProps, ListViewItemProps } from '../list-view/types.ts';
import type { FlyoutProps } from '../flyout/types.ts';
import type { FSContext, NativeFieldAttributes } from '#internal';

/** The value shape of a dropdown that allows more than one selection. */
export type DropdownMultipleValue = {
	multiple: true;
	value?: string[];
};

/** The value shape of a dropdown that allows a single selection. */
export type DropdownSingleValue = {
	multiple?: false;
	value?: string;
};

/** @propsmith DropdownProps */
export type DropdownProps = {
	/** The selected value. An array of values when `multiple` is set.
	 * @type string | string[]
	 * @default multiple ? [] : ''
	 * @bindable
	 */
	value?: string | string[];
	/** Allows more than one option to be selected at a time. */
	multiple?: boolean;
	/** The text shown by the trigger while no option is selected.
	 * @default 'Select an option'
	 */
	placeholder?: string;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** The name the value is submitted under. Without one, the form leaves the value out, as with any field. */
	name?: string | null;
	/** The DOM reference of the wrapper element.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement | null;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
	/** The DOM reference of the native select that holds the value. The other attributes of the dropdown are applied to it.
	 * @bindable
	 */
	ref?: HTMLSelectElement | null;
	/** The DOM reference of the button that opens the dropdown.
	 * @bindable
	 */
	buttonRef?: HTMLButtonElement | null;
	/** The attributes to spread on the button that opens the dropdown.
	 * @type HTMLButtonAttributes
	 */
	buttonAttributes?: Omit<HTMLButtonAttributes, 'type' | 'role' | 'value'>;
	/** The DOM reference of the flyout element.
	 * @bindable
	 */
	flyoutRef?: HTMLDivElement | null;
	/** The props to spread on the flyout.
	 * @type FlyoutProps
	 */
	flyoutProps?: FlyoutProps;
	/** The maximum height of the flyout, as a CSS length. */
	flyoutMaxHeight?: string;
	/** The DOM reference of the listbox element.
	 * @bindable
	 */
	listboxRef?: HTMLUListElement | null;
	/** The props to spread on the listbox rendered inside the flyout.
	 * @type ListViewProps
	 */
	listboxProps?: Omit<ListViewProps<'ul'>, 'ref' | 'children' | 'selectedItems' | 'selectionMode'>;
	/** The `DropdownOption` elements of the list. */
	children?: Snippet;
} & (DropdownMultipleValue | DropdownSingleValue) &
	NativeFieldAttributes<HTMLSelectAttributes>;

/** @propsmith DropdownOptionProps */
export type DropdownOptionProps = {
	/** The text shown by the dropdown once the option is selected. Falls back to the rendered children, which the server cannot read: pass it when rendering on the server. */
	text?: string;
} & ListViewItemProps<'li'>;

/** What an option tells the trigger, read live. */
export type DropdownOptionLabel = {
	readonly value?: string;
	readonly text?: string;
};

export type DropdownContext = FSContext<
	null,
	null,
	null,
	{
		/** Options report their display text so the trigger can show a label instead of the raw value. Returns the call that withdraws the option. */
		registerOption: (option: DropdownOptionLabel) => () => void;
	}
>;
