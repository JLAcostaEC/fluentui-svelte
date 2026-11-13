import type { FSContext } from '#internal';
import type { Horientation } from '#types';
import type { HTMLAttributes } from 'svelte/elements';
import type { SelectionMode } from '../list-view/types.ts';

export type ItemsViewLayout = 'stack' | 'grid' | 'flow';

/** @propsmith ItemsViewProps */
export type ItemsViewProps = {
	/** How the items are arranged: a stack, a uniform grid or lines of items that keep their aspect ratio.
	 * @default 'stack'
	 */
	layout?: ItemsViewLayout;
	/** The direction of the `stack` layout.
	 * @default 'vertical'
	 */
	orientation?: Horientation;
	/** The space between items. A number is read as pixels.
	 * @default 4
	 */
	spacing?: number | string;
	/** The minimum width of a column in the `grid` layout. A number is read as pixels.
	 * @default 160
	 */
	minItemWidth?: number | string;
	/** The height of a line in the `flow` layout. A number is read as pixels.
	 * @default 160
	 */
	lineHeight?: number | string;
	/** How many items can be selected, and how the selection is made.
	 * @default 'none'
	 */
	selectionMode?: SelectionMode;
	/** Shows a checkbox on each item when items can be selected.
	 * @default false
	 */
	showCheckboxes?: boolean;
	/** The values of the selected items.
	 * @bindable
	 */
	selectedItems?: string[];
	/** Called whenever the selection changes. */
	onSelectionChange?: (e: Event, selectedItems: string[]) => void;
	/** Called when an item is invoked: with a double-click or Enter, or a click when nothing is selectable. */
	onItemInvoke?: (e: Event, value: string) => void;
	/** Opts the items view out of the tabspot focus management, to wire your own.
	 * @default false
	 */
	disableTabspot?: boolean;
	/** The DOM reference of the items view element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
} & HTMLAttributes<HTMLDivElement>;

/** @propsmith ItemsViewItemProps */
export type ItemsViewItemProps = {
	/** The value reported to the items view when the item is selected. Falls back to a generated id. */
	value?: string;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** The DOM reference of the item element.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
} & HTMLAttributes<HTMLDivElement>;

export type ItemsViewItemEntry = { value: string; disabled: boolean; element: HTMLElement | null };

export type ItemsViewContextConfig = {
	selectionMode: SelectionMode;
	showCheckboxes: boolean;
	/** Whether an item can be invoked. */
	invokable: boolean;
	/** Whether the items view keeps a single tab stop that the arrow keys move. */
	roving: boolean;
};

export type ItemsViewContextState = {
	selectedItems: string[];
};

export type ItemsViewContextMethods = {
	select: (e: MouseEvent | KeyboardEvent, value: string) => void;
	invoke: (e: Event, value: string) => void;
	registerItem: (id: string, getItem: () => ItemsViewItemEntry) => void;
	unregisterItem: (id: string) => void;
	/** True for the first item to ask: it holds the tab stop until Tabspot takes the stop over on mount. */
	claimTabStop: (id: string) => boolean;
};

export type ItemsViewContext = FSContext<ItemsViewContextConfig, ItemsViewContextState, null, ItemsViewContextMethods>;
