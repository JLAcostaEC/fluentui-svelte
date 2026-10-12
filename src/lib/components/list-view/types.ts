import type { CheckboxProps } from '../checkbox/types.ts';
import type { FSContext } from '$internal';
import type { PolymorphicProps, Shapes } from '$types';
import type { AriaRole, HTMLButtonAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';

export type SelectionMode = 'none' | 'single' | 'multiselect' | 'extended';
export type NavigationMode = 'items' | 'composite';

/** @propsmith ListViewProps */
export type ListViewProps<T extends 'ul' | 'ol' | 'div'> = {
	/** Overrides the list role and the roles derived for its items. Use `list` for nested navigation with independent selection. */
	role?: AriaRole;
	/** How many items can be selected, and how the selection is made.
	 * @default 'none'
	 */
	selectionMode?: SelectionMode;
	/** Whether the list itself takes a single tab stop, or every item takes its own.
	 * @default 'items'
	 */
	navigationMode?: NavigationMode;
	/** The values of the selected items.
	 * @bindable
	 */
	selectedItems?: string[];
	/** The items can have a circular, rounded or square shape.
	 * @default 'rounded'
	 */
	shape?: Shapes;
	/** Called whenever the selection changes. */
	onSelectionChange?: (e: Event, selectedItems: string[] | []) => void;
	/** When `selectionMode` is `'multiselect'`, clicking an item toggles its selection directly instead of requiring Ctrl/Cmd + click.
	 * @default false
	 */
	toggleOnClick?: boolean;
	/** The HTML element to render the list as.
	 * @type 'ul' | 'ol' | 'div'
	 * @default 'ul'
	 */
	as?: T | 'ul' | 'ol' | 'div';
	/** The DOM reference of the list element.
	 * @type HTMLUListElement | HTMLOListElement | HTMLDivElement
	 * @bindable
	 */
	ref?: ListViewDOM[T];
	/** Opts the list out of the tabspot focus management, to wire your own.
	 * @default false
	 */
	disableTabspot?: boolean;
} & PolymorphicProps<T>;

export type ListViewDOM = {
	ul: HTMLUListElement;
	ol: HTMLOListElement;
	div: HTMLDivElement;
};

/** @propsmith ListViewItemProps */
export type ListViewItemProps<T extends 'li' | 'a' | 'button' | 'div' = 'li'> = {
	/** The HTML element to render the item as.
	 * Links and buttons are wrapped in a list item when the list renders as `ul` or `ol`.
	 * Use `li` or `div` for nested lists and content with multiple controls. Buttons cannot contain checkmarks or composite rows.
	 * @type 'li' | 'a' | 'button' | 'div'
	 * @default 'li'
	 */
	as?: T | 'a' | 'button' | 'div';
	/** The item can have a circular, rounded or square shape. Inherited from the list by default. */
	shape?: Shapes;
	/** The value reported to the list when the item is selected. Falls back to a generated id. */
	value?: string;
	/** Renders the item in its pressed state. */
	active?: boolean;
	/** The ARIA role of the item. Derived from the list by default. */
	role?: 'treeitem' | 'menuitem' | 'option' | 'row';
	/** Disables the user interaction. */
	disabled?: boolean;
	/** The props to spread on the checkbox rendered when the list is multiselect.
	 * @type CheckboxProps
	 */
	checkmark?: Omit<CheckboxProps, 'element' | 'label' | 'disabled'>;
	/** Called when the item is clicked or activated with the keyboard. */
	onAction?: (e: MouseEvent, value: string) => void;
	/** Called when the item receives the focus. */
	onfocus?: (e: Event, value: string) => void;
	/** The DOM reference of the item element.
	 * @type HTMLLIElement | HTMLAnchorElement | HTMLButtonElement | HTMLDivElement
	 * @bindable
	 */
	ref?: ListViewItemDOM[T] | null;
} & PolymorphicProps<T, 'onfocus'>;

export type ListViewItemDOM = {
	li: HTMLLIElement;
	a: HTMLAnchorElement;
	button: HTMLButtonElement;
	div: HTMLDivElement;
};

/** @propsmith ListViewItemBranchProps */
export type ListViewItemBranchProps = {
	/** The accessible label rendered in the disclosure button. */
	label: string;
	/** Whether the nested content is visible. Branches only expand or collapse and are never selectable.
	 * @default false
	 * @bindable
	 */
	expanded?: boolean;
	/** Called when a user expands or collapses the branch. */
	onExpandedChange?: (e: Event, expanded: boolean) => void;
	/** Disables the disclosure button.
	 * @default false
	 */
	disabled?: boolean;
	/** The disclosure button shape. Inherited from the list by default. */
	shape?: Shapes;
	/** The DOM reference of the native disclosure button. Additional HTML attributes, including class and id, also target this button.
	 * @type HTMLButtonElement
	 * @bindable
	 */
	ref?: HTMLButtonElement | null;
	/** Nested ListView content, kept mounted while collapsed to preserve its selection. */
	children?: Snippet;
} & Omit<HTMLButtonAttributes, 'children' | 'role' | 'type' | 'value' | 'aria-expanded' | 'aria-controls'>;

export type ListViewContextConfig = {
	shape: Shapes;
	as: 'ul' | 'ol' | 'div';
	selectionMode: SelectionMode;
	role: AriaRole | undefined;
	disableTabspot: boolean;
};

export type ListViewContextState = {
	selectedItems: string[];
	anchorIndex: number | null;
};

export type ListViewContextMethods = {
	handleSelection: (e: MouseEvent, value: string, toggle?: boolean) => void;
	getChildrenRole: (tag: 'li' | 'a' | 'button' | 'div') => 'listitem' | 'option' | 'row' | undefined;
	registerItem: (id: string, getItem: () => { value: string; disabled: boolean; element: HTMLElement | null }) => void;
	unregisterItem: (id: string) => void;
};

export type ListViewContext = FSContext<ListViewContextConfig, ListViewContextState, null, ListViewContextMethods>;
