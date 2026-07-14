import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { ListViewProps, ListViewItemProps } from '../list-view/types.ts';
import type { FlyoutProps } from '../flyout/types.ts';
import type { FSContext } from '$internal';

type multipleValue = {
	multiple: true;
	value?: string[];
};

type singleValue = {
	multiple?: false;
	value?: string;
};

export type DropdownProps = {
	ref?: HTMLDivElement;
	onclick?: (e: MouseEvent) => void;
	wrapperProps?: HTMLAttributes<HTMLDivElement>;
	buttonRef?: HTMLButtonElement;
	buttonProps?: HTMLButtonAttributes;
	inputRef?: HTMLInputElement;
	flyoutRef?: HTMLDivElement;
	flyoutProps?: FlyoutProps;
	flyoutMaxHeight?: string;
	listboxRef?: HTMLUListElement;
	listboxProps?: Omit<ListViewProps<'ul'>, 'ref' | 'children' | 'selectedItems' | 'selectionMode'>;
} & (multipleValue | singleValue) &
	Omit<HTMLInputAttributes, 'value' | 'onclick'>;

export type DropdownOptionProps = {
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
