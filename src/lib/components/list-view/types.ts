import type { CheckboxProps } from '../checkbox/types.ts';
import type { FSContext } from '$internal';
import type { PolymorphicProps, Shapes } from '$types';

export type SelectionMode = 'none' | 'single' | 'multiselect' | 'extended';
export type NavigationMode = 'items' | 'composite';

/** @propsmith ListViewProps */
export type ListViewProps<T extends 'ul' | 'ol' | 'div'> = {
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
export type ListViewItemProps<T extends 'li' | 'a' | 'div' = 'li'> = {
	/** The HTML element to render the item as.
	 * @type 'li' | 'a' | 'div'
	 * @default 'li'
	 */
	as?: T | 'a' | 'div';
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
	 * @type HTMLLIElement | HTMLAnchorElement | HTMLDivElement
	 * @bindable
	 */
	ref?: ListViewItemDOM[T] | null;
} & PolymorphicProps<T>;

export type ListViewItemDOM = {
	li: HTMLLIElement;
	a: HTMLAnchorElement;
	div: HTMLDivElement;
};

export type ListViewContextConfig = {
	shape: Shapes;
};

export type ListViewContextState = {
	selectedItems: string[];
	anchorIndex: number | null;
};

export type ListViewContextMethods = {
	handleSelection: (e: MouseEvent, value: string) => void;
	getChildrenRole: (tag: 'li' | 'a' | 'div') => 'listitem' | 'option' | 'row' | undefined;
	registerItem: (id: string, value: string, disabled: boolean) => void;
	unregisterItem: (id: string) => void;
};

export type ListViewContext = FSContext<ListViewContextConfig, ListViewContextState, null, ListViewContextMethods>;
