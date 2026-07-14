import type { CheckboxProps } from '../checkbox/types.ts';
import type { FSContext } from '$internal';
import type { PolymorphicProps, Shapes } from '$types';

export type SelectionMode = 'none' | 'single' | 'multiselect' | 'extended';
export type NavigationMode = 'items' | 'composite';

export type ListViewProps<T extends 'ul' | 'ol' | 'div'> = {
	selectionMode?: SelectionMode;
	navigationMode?: NavigationMode;
	selectedItems?: string[];
	shape?: Shapes;
	onSelectionChange?: (e: Event, selectedItems: string[] | []) => void;
	as?: T;
	ref?: ListViewDOM[T];
	disableTabspot?: boolean;
} & PolymorphicProps<T>;

export type ListViewDOM = {
	ul: HTMLUListElement;
	ol: HTMLOListElement;
	div: HTMLDivElement;
};

export type ListViewItemProps<T extends 'li' | 'a' | 'div' = 'li'> = {
	as?: T | 'a' | 'div';
	shape?: Shapes;
	value?: string;
	active?: boolean;
	role?: 'treeitem' | 'menuitem' | 'option' | 'row';
	disabled?: boolean;
	checkmark?: Omit<CheckboxProps, 'element' | 'label' | 'disabled'>;
	onAction?: (e: MouseEvent, value: string) => void;
	onfocus?: (e: Event, value: string) => void;
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
