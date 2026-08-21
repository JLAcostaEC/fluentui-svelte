import type { HTMLAttributes } from 'svelte/elements';
import type { FSContext } from '$internal';
import type { Component, Snippet } from 'svelte';
import type { SvelteMap, SvelteSet } from 'svelte/reactivity';
import type { Sizes } from '$types';

export type TreeViewNavigation = 'tree' | 'treegrid';
export type TreeViewSelectionMode = 'single' | 'multiple';
export type TreeViewItemType = 'item' | 'branch';
export type TreeViewNode = {
	id: string;
	type: TreeViewItemType;
	parentId?: string;
	disabled?: boolean;
	checked?: boolean;
	indeterminate?: boolean;
	open?: boolean;
};
export type TreeViewEvent<T extends Record<string, unknown> | Iterable<unknown>> = (e: Event, data: T) => void;

/**
 * Bridge to a windowing/virtual-list library. When provided to `TreeView`, only the
 * rendered slice of items lives in the DOM; the tree exposes the real index per item
 * (`data-index`) and registers this adapter so keyboard navigation can scroll the
 * target into view before activating it.
 */
export type TreeViewVirtualizer = {
	/** Total number of real items (the whole data set, not just the rendered window). */
	size: number;
	/** Scroll so the item at `index` renders. May be async. */
	scrollToIndex?: (index: number) => void | Promise<void>;
	scrollToTop?: () => void | Promise<void>;
	scrollToBottom?: () => void | Promise<void>;
};

/** The state shape of a virtualized tree: Sets, for the lookups a windowed list does on every render. */
export type TreeViewVirtualProps = {
	virtualizer?: TreeViewVirtualizer;
	openItems?: SvelteSet<string>;
	checkedItems?: SvelteSet<string>;
};

/** The state shape of a tree that renders every item. */
export type TreeViewStaticProps = {
	virtualizer?: never;
	openItems?: string[];
	checkedItems?: string[];
};

/** @propsmith TreeViewProps */
export type TreeViewProps = {
	/** The DOM reference of the tree element.
	 * @bindable
	 */
	ref?: HTMLUListElement;
	/** The size of every item in the tree.
	 * @default 'medium'
	 */
	size?: Sizes;
	/** Whether the tree takes a single tab stop, or every row is reachable on its own.
	 * @default 'tree'
	 */
	navigationMode?: TreeViewNavigation;
	/** Called whenever a branch opens or closes.
	 * @type (e: Event, openItems: string[]) => void
	 */
	onOpenChange?: TreeViewEvent<string[]>;
	/** How many items can be checked at a time.
	 * @default 'multiple'
	 */
	selectionMode?: TreeViewSelectionMode;
	/** Called whenever an item is checked or unchecked.
	 * @type (e: Event, checkedItems: string[]) => void
	 */
	onCheckedChange?: TreeViewEvent<string[]>;
	/** Bridge to a windowing library. Only the rendered slice of items lives in the DOM.
	 * @type TreeViewVirtualizer
	 */
	virtualizer?: TreeViewVirtualizer;
	/** The ids of the open branches. A `SvelteSet` is required when a `virtualizer` is set.
	 * @type string[] | SvelteSet<string>
	 * @bindable
	 */
	openItems?: string[] | SvelteSet<string>;
	/** The ids of the checked items. A `SvelteSet` is required when a `virtualizer` is set.
	 * @type string[] | SvelteSet<string>
	 * @bindable
	 */
	checkedItems?: string[] | SvelteSet<string>;
	/** The items of the tree. */
	children?: Snippet;
} & (TreeViewVirtualProps | TreeViewStaticProps) &
	HTMLAttributes<HTMLUListElement>;

/** @propsmith TreeViewItemProps */
export type TreeViewItemProps = {
	/** The id of the item, used by the tree to track its state. Falls back to a generated id. */
	id?: string;
	/** Whether the item holds children, and can therefore be opened.
	 * @default 'item'
	 */
	type?: TreeViewItemType;
	/** The DOM reference of the item element. */
	ref?: HTMLLIElement;
	/** The value reported by the tree events. Falls back to the id of the item.
	 * @default id
	 */
	value?: string | number;
	/** The label of the item, used by the type-ahead navigation. */
	text?: string;
	/** Whether the branch is open. */
	open?: boolean;
	/** Whether the item is checked. */
	checked?: boolean;
	/** Renders the checkbox in its mixed state, when only some children are checked. */
	indeterminate?: boolean;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** The real index of the item in the data set. Required when the tree is virtualized. */
	index?: number;
	/** Called when this branch opens or closes.
	 * @type (e: Event, data: { id: string; open: boolean }) => void
	 */
	onOpenChange?: TreeViewEvent<{ id: string; open: boolean }>;
	/** Called when this item is checked or unchecked.
	 * @type (e: Event, data: { id: string; checked: boolean }) => void
	 */
	onCheckedChange?: TreeViewEvent<{ id: string; checked: boolean }>;
} & HTMLAttributes<HTMLLIElement>;

/** @propsmith TreeViewItemLayoutProps */
export type TreeViewItemLayoutProps = {
	/** The DOM reference of the layout element. */
	ref?: HTMLDivElement;
	/** Custom icon for the control that opens a branch.
	 * @type Snippet | Component
	 */
	expandIcon?: Snippet | Component;
	/** Content rendered before the label.
	 * @type Snippet | Component
	 */
	iconBefore?: Snippet | Component;
	/** Content rendered after the label.
	 * @type Snippet | Component
	 */
	iconAfter?: Snippet | Component;
	/** Content pinned to the end of the row.
	 * @type Snippet | Component
	 */
	aside?: Snippet | Component;
	/** Content pinned to the end of the row, revealed on hover and on focus.
	 * @type Snippet | Component
	 */
	actions?: Snippet | Component;
} & HTMLAttributes<HTMLDivElement>;

export type TreeViewContext = FSContext<
	{
		navigationMode: TreeViewNavigation;
		size: Sizes;
		virtualized: boolean;
		virtualCount?: number;
	},
	{
		readonly selectionMode?: TreeViewSelectionMode;
		readonly openItems: NonNullable<TreeViewProps['openItems']>;
		readonly checkedItems: NonNullable<TreeViewProps['checkedItems']>;
		readonly TREE_NODES: SvelteMap<string, TreeViewNode>;
		forceVirtualRender: boolean;
	},
	{
		onOpenChange: TreeViewEvent<string[]>;
		onCheckedChange: TreeViewEvent<string[]>;
	},
	{
		handleCheck: (e: Event | null, id: string, checked: boolean) => Promise<void>;
		openItem: (e: Event | null, id: string) => void;
		closeItem: (e: Event | null, id: string) => void;
		registerItem: (node: TreeViewNode) => void;
		unregisterItem: (id: string) => void;
	}
>;

export type TreeViewItemContext = {
	readonly disabled?: boolean;
	readonly value: string | number;
	readonly depth: number;
	readonly id: string;
	readonly type: TreeViewItemType;
	readonly parentId?: string;
	open?: boolean;
	checked?: boolean;
	indeterminate?: boolean;
};
