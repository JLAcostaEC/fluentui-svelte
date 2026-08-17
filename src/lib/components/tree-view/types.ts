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

// Handle virtualized tree view with Sets for performance reasons.
type VirtualProps = {
	virtualizer?: TreeViewVirtualizer;
	openItems?: SvelteSet<string>;
	checkedItems?: SvelteSet<string>;
};

type NonVirtualProps = {
	virtualizer?: never;
	openItems?: string[];
	checkedItems?: string[];
};

export type TreeViewProps = {
	ref?: HTMLUListElement;
	size?: Sizes;
	navigationMode?: TreeViewNavigation;
	onOpenChange?: TreeViewEvent<string[]>;
	selectionMode?: TreeViewSelectionMode;
	onCheckedChange?: TreeViewEvent<string[]>;
	children?: Snippet;
} & (VirtualProps | NonVirtualProps) &
	HTMLAttributes<HTMLUListElement>;

export type TreeViewItemProps = {
	ref?: HTMLLIElement;
	value?: string | number;
	text?: string;
	open?: boolean;
	checked?: boolean;
	indeterminate?: boolean;
	disabled?: boolean;
	id?: string;
	index?: number;
	type?: TreeViewItemType;
	onOpenChange?: TreeViewEvent<{ id: string; open: boolean }>;
	onCheckedChange?: TreeViewEvent<{ id: string; checked: boolean }>;
} & HTMLAttributes<HTMLLIElement>;

export type TreeViewItemLayoutProps = {
	ref?: HTMLDivElement;
	expandIcon?: Snippet | Component;
	iconBefore?: Snippet | Component;
	iconAfter?: Snippet | Component;
	aside?: Snippet | Component;
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
