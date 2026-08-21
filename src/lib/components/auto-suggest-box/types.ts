import type { FSContext } from '$internal';
import type { TextBoxProps } from '../text-box/types.ts';
import type { ListViewItemProps } from '../list-view/types.ts';
import type { FlyoutProps } from '../flyout/types.ts';
import type { HTMLAttributes } from 'svelte/elements';

/** @propsmith AutoSuggestBoxProps */
export type AutoSuggestBoxProps = {
	/** The DOM reference of the wrapper element.
	 * @bindable
	 */
	ref?: HTMLElement;
	/** The DOM reference of the text box element.
	 * @bindable
	 */
	inputRef?: HTMLInputElement;
	/** The current text of the box.
	 * @default ''
	 * @bindable
	 */
	value?: string;
	/** Controls the open state of the suggestion list.
	 * @default false
	 * @bindable
	 */
	open?: boolean;
	/** Lets more than one suggestion be chosen, and keeps the list open after each one. */
	multiselect?: boolean;
	/** Mirrors the suggestion under the cursor into the text box as it is walked over.
	 * Not supported together with `multiselect`.
	 */
	selectOnFocus?: boolean;
	/** Lists every chosen suggestion in the text box, comma separated. Multiselect only. */
	showTextualMultiselect?: boolean;
	/** The message shown in place of the list when nothing matches.
	 * @default 'No results found'
	 */
	notFoundText?: string;
	/** The suggestions currently chosen.
	 * @default []
	 * @bindable
	 */
	selectedOptions?: { id: string; value: string }[];
	/** Called when a suggestion is chosen: by clicking it, by pressing Enter on it, or by
	 * walking onto it while `selectOnFocus` is set.
	 */
	suggestionChosen?: (e: Event, selection: string) => void;
	/** Called when Enter is pressed with no suggestion under the cursor, or when the search
	 * button is clicked. This is where a fresh set of suggestions is fetched.
	 */
	querySubmitted?: (e: MouseEvent | KeyboardEvent, query: string) => void;
	/** Bridge to a windowed list, for suggestion sets too long to render whole.
	 * @type AutoSuggestVirtualizer
	 */
	virtualizer?: AutoSuggestVirtualizer;
	/** How many suggestions are visible before the list scrolls.
	 * @default 6
	 */
	maxItemsInView?: number;
	/** The DOM reference of the underlying text box input.
	 * @bindable
	 */
	textBoxRef?: HTMLInputElement;
	/** The props to spread on the text box.
	 * @type TextBoxProps
	 */
	textBoxProps?: Omit<TextBoxProps, 'type' | 'ref' | 'placeholder' | 'hideActionButtons' | 'textChanged'>;
	/** The DOM reference of the flyout holding the suggestion list.
	 * @bindable
	 */
	flyoutRef?: HTMLElement;
	/** The props to spread on the flyout.
	 * @type FlyoutProps
	 */
	flyoutProps?: Omit<FlyoutProps, 'children' | 'ref'>;
	/** The DOM reference of the suggestion list.
	 * @bindable
	 */
	listViewRef?: HTMLUListElement;
	/** The props to spread on the suggestion list.
	 * @type ListViewItemProps
	 */
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

/** @propsmith AutoSuggestOptionProps */
export type AutoSuggestOptionProps = {
	/** The value reported to the box when the suggestion is chosen. Falls back to the id. */
	value?: string;
	/** The text shown in the box once the suggestion is chosen. Falls back to `value`. */
	text?: string;
	/** The id of the option element, referenced by the box through `aria-activedescendant`.
	 * Falls back to a generated id.
	 */
	id?: string;
	/** The DOM reference of the option element.
	 * @bindable
	 */
	ref?: HTMLLIElement;
	/** Takes the suggestion out of reach: it is shown, but the cursor steps over it. */
	disabled?: boolean;
	/** Where the suggestion sits in the whole set. A windowed list needs the real index,
	 * not the position within the rendered slice.
	 */
	index: number;
} & Omit<ListViewItemProps<'li'>, 'as' | 'value'>;
