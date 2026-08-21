import type { FSContext } from '$internal';
import type { TextBoxProps } from '../text-box/types.ts';
import type { ListViewItemProps } from '../list-view/types.ts';
import type { FlyoutProps } from '../flyout/types.ts';
import type { HTMLAttributes } from 'svelte/elements';

export type FSAutoSuggestBox = {
	ref?: HTMLElement;
	inputRef?: HTMLInputElement;
	value?: string;
	open?: boolean;
	multiselect?: boolean;
	selectOnFocus?: boolean;
	showTextualMultiselect?: boolean;
	notFoundText?: string;
	selectedOptions?: { id: string; value: string }[];
	/**
	 * The suggestionsChosen event occurs when:
	 * 1. selectOnFocus is true and the user focuses an item.
	 * 2. When a user hits Enter, Space, click or taps an item.
	 */
	suggestionChosen?: (e: Event, selection: string) => void;
	/**
	 * The QuerySubmitted event occurs when:
	 * 1. While the focus is in the text box, press Enter and no item is available to select or click the query icon (when input type is search) with/without item selected */
	querySubmitted?: (e: MouseEvent | KeyboardEvent, query: string) => void;
	virtualizer?: AutoSuggestVirtualizer;
	maxItemsInView?: number;
	textBoxRef?: HTMLInputElement;
	textBoxProps?: Omit<TextBoxProps, 'type' | 'ref' | 'placeholder' | 'hideActionButtons' | 'textChanged'>;
	flyoutRef?: HTMLElement;
	flyoutProps?: Omit<FlyoutProps, 'children' | 'ref'>;
	listViewRef?: HTMLUListElement;
	listViewProps?: Omit<ListViewItemProps, 'as' | 'role' | 'ref' | 'navigationMode' | 'selectedItems'>;
} & Pick<TextBoxProps, 'type' | 'placeholder' | 'hideActionButtons' | 'textChanged'> &
	HTMLAttributes<HTMLDivElement>;

/**
 * Bridge to a windowed list. `size` is the total number of suggestions, not the
 * number currently rendered — it is how the box knows where the list really ends
 * and which index to scroll to when the cursor walks past the rendered window.
 */
export type AutoSuggestVirtualizer = {
	size: number;
	scrollToIndex?: (index: number) => void | Promise<void>;
	scrollToTop?: () => void | Promise<void>;
	scrollToBottom?: () => void | Promise<void>;
};

export type AutoSuggestBoxContext = FSContext<
	{
		readonly selectOnFocus?: boolean;
		readonly virtualized?: AutoSuggestVirtualizer;
		multiselect?: boolean;
	},
	{
		readonly searchValue?: string;
		readonly textBoxRef?: HTMLInputElement;
		readonly lastTypedValue?: string;
		open?: boolean;
		activeOption?: OptionType | null;
	},
	null,
	{
		setOption: (item: OptionType) => void;
		deleteOption: (id: string) => void;
		toggleSelection: (e: Event, id: string) => void;
	}
>;

export type OptionType = { id: string; index: number; value: string; text?: string; disabled?: boolean };

export type AutoSuggestOptionProps = {
	value?: string;
	text?: string;
	id?: string;
	ref?: HTMLLIElement;
	disabled?: boolean;
	index: number;
} & Omit<ListViewItemProps<'li'>, 'as' | 'value'>;
