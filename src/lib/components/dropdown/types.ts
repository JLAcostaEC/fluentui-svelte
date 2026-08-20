import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { ListViewProps, ListViewItemProps } from '../list-view/types.ts';
import type { FlyoutProps } from '../flyout/types.ts';
import type { FSContext } from '$internal';

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
	/** The name submitted with the form. Falls back to the id of the dropdown.
	 * @default id
	 */
	name?: string | null;
	/** The DOM reference of the dropdown element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** Called when the dropdown is clicked. */
	onclick?: (e: MouseEvent) => void;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperProps?: HTMLAttributes<HTMLDivElement>;
	/** The DOM reference of the button that opens the dropdown.
	 * @bindable
	 */
	buttonRef?: HTMLButtonElement;
	/** The attributes to spread on the button that opens the dropdown.
	 * @type HTMLButtonAttributes
	 */
	buttonProps?: HTMLButtonAttributes;
	/** The DOM reference of the hidden input holding the value. */
	inputRef?: HTMLInputElement;
	/** The DOM reference of the flyout element.
	 * @bindable
	 */
	flyoutRef?: HTMLDivElement;
	/** The props to spread on the flyout.
	 * @type FlyoutProps
	 */
	flyoutProps?: FlyoutProps;
	/** The maximum height of the flyout, as a CSS length. */
	flyoutMaxHeight?: string;
	/** The DOM reference of the listbox element.
	 * @bindable
	 */
	listboxRef?: HTMLUListElement;
	/** The props to spread on the listbox rendered inside the flyout.
	 * @type ListViewProps
	 */
	listboxProps?: Omit<ListViewProps<'ul'>, 'ref' | 'children' | 'selectedItems' | 'selectionMode'>;
} & (DropdownMultipleValue | DropdownSingleValue) &
	Omit<HTMLInputAttributes, 'value' | 'onclick'>;

/** @propsmith DropdownOptionProps */
export type DropdownOptionProps = {
	/** The text shown by the dropdown once the option is selected. Falls back to the rendered children. */
	text?: string;
} & ListViewItemProps<'li'>;

export type DropdownContext = FSContext<
	null,
	null,
	null,
	{
		/** Options report their display text so the trigger can show a label instead of the raw value. */
		registerOption: (value: string, text: string) => void;
	}
>;
