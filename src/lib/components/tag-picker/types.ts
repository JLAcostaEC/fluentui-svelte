import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, HTMLInputAttributes, SVGAttributes } from 'svelte/elements';
import type { FSContext } from '$internal';
import type { ListViewItemProps } from '../list-view/types.ts';
import type { TagGroupProps } from '../tag/types.ts';

export type TagPickerSizes = 'medium' | 'large' | 'extra-large';

/** @propsmith TagPickerProps */
export type TagPickerProps = {
	/** The DOM reference of the wrapper element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** The DOM reference of the input element.
	 * @bindable
	 */
	inputRef?: HTMLInputElement;
	/** The values of the chosen options, shown as tags in the control. A value no option has is shown as it is.
	 * @default []
	 * @bindable
	 */
	selectedOptions?: string[];
	/** The text typed in the input. It filters the options, and is cleared when one is chosen.
	 * @default ''
	 * @bindable
	 */
	value?: string;
	/** Controls the open state of the option list.
	 * @default false
	 * @bindable
	 */
	open?: boolean;
	/** Limits the picker to one tag: choosing an option replaces the current one and closes the list. */
	single?: boolean;
	/** Disables the user interaction: the input, the tags and the list. */
	disabled?: boolean;
	/** The size of the control. It also picks the size of the tags.
	 * @default 'medium'
	 */
	size?: TagPickerSizes;
	/** The placeholder text of the input. */
	placeholder?: string;
	/** The message shown in place of the list when there is no option left to choose.
	 * @default 'No options available'
	 */
	notFoundText?: string;
	/** The dropdown arrow. Pass `null` to remove it.
	 * @default ChevronDownRegular
	 * @type Snippet | Component | null
	 */
	expandIcon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>> | null;
	/** A button-like element rendered at the end of the control, before the dropdown arrow. */
	secondaryAction?: Snippet;
	/** Renders the tag of a chosen option, to give it media or custom text. Falls back to a plain tag.
	 * Render a `Tag` with the given `value`, and `role="listitem"`.
	 * @type Snippet<[{ value: string; text: string }]>
	 */
	tag?: Snippet<[{ value: string; text: string }]>;
	/** The props to spread on the group holding the tags. This is where its `aria-label` goes.
	 * @type TagGroupProps
	 */
	tagGroupProps?: Omit<
		TagGroupProps,
		'children' | 'size' | 'appearance' | 'disabled' | 'dismissible' | 'selectedValues' | 'onTagSelect' | 'onDismiss'
	>;
	/** The props to spread on the input. This is where its accessible name (`aria-label`) and
	 * `readonly` (to turn the input into a plain trigger) go.
	 * @type HTMLInputAttributes
	 */
	inputProps?: Omit<HTMLInputAttributes, 'value' | 'type' | 'role' | 'disabled' | 'oninput' | 'onkeydown'>;
	/** Called when an option is chosen, or a tag is removed. */
	onSelectionChange?: (e: Event, selectedOptions: string[]) => void;
	/** Called when Enter is pressed with text in the input and no option under the cursor. This is
	 * where a free-form tag is added.
	 */
	querySubmitted?: (e: KeyboardEvent, query: string) => void;
	/** The options. Leave it out to get a picker without a list. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type OptionType = { id: string; value: string; disabled?: boolean };

export type TagPickerContext = FSContext<
	null,
	{
		readonly query: string;
		readonly selectedOptions: string[];
		readonly open: boolean;
	},
	null,
	{
		/** Remembers what the tag of `value` says. Every option calls it, on screen or not. */
		setLabel: (value: string, text: string) => void;
		setOption: (option: OptionType) => void;
		deleteOption: (id: string) => void;
		chooseOption: (e: Event, id: string) => void;
	}
>;

/** @propsmith TagPickerOptionProps */
export type TagPickerOptionProps = {
	/** The value added to `selectedOptions` when the option is chosen. */
	value: string;
	/** The text the option is filtered by, and the text of its tag. Falls back to `value`. */
	text?: string;
	/** The id of the option element, referenced by the input through `aria-activedescendant`.
	 * Falls back to a generated id.
	 */
	id?: string;
	/** The DOM reference of the option element.
	 * @bindable
	 */
	ref?: HTMLLIElement;
	/** Takes the option out of reach: it is shown, but the cursor steps over it. */
	disabled?: boolean;
} & Omit<ListViewItemProps<'li'>, 'as' | 'value' | 'onAction' | 'checkmark'>;

/** @propsmith TagPickerOptionGroupProps */
export type TagPickerOptionGroupProps = {
	/** The label of the group. */
	label: string;
	/** The DOM reference of the group element.
	 * @bindable
	 */
	ref?: HTMLUListElement;
	/** The options of the group. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLUListElement>, 'children'>;
