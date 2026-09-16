import type { FSContext } from '$internal';
import type { PolymorphicProps } from '$types';
import type { Component, Snippet } from 'svelte';
import type { CheckboxProps } from '../checkbox/types.ts';
import type { RadioButtonProps } from '../radio-button/types.ts';

export type TableSize = 'extra-small' | 'small' | 'medium';
export type CellFocusMode = 'cell' | 'group' | 'none';
export type TableRowAppearance = 'none' | 'brand' | 'neutral';
export type SortDirection = 'ascending' | 'descending';
export type SelectionType = 'checkbox' | 'radio';

export type TableDOM = {
	table: HTMLTableElement;
	thead: HTMLTableSectionElement;
	tbody: HTMLTableSectionElement;
	tr: HTMLTableRowElement;
	th: HTMLTableCellElement;
	td: HTMLTableCellElement;
	div: HTMLDivElement;
};

/** @propsmith TableProps */
export type TableProps<Tag extends 'table' | 'div' = 'table'> = {
	/** The HTML element to render the table as. Defaults to a `div` when `noNativeElements` is set.
	 * @type 'table' | 'div'
	 * @default 'table'
	 */
	as?: Tag;
	/** The DOM reference of the table element.
	 * @type HTMLTableElement | HTMLDivElement
	 * @bindable
	 */
	ref?: TableDOM[Tag] | HTMLDivElement;
	/** Affects the sizes of all table subcomponents.
	 * @default 'medium'
	 */
	size?: TableSize;
	/** Renders every table part as a `div` instead of a semantic table element. The layout switches
	 * from `display: table` to `display: flex`, which virtualization and sticky headers need.
	 * @default false
	 */
	noNativeElements?: boolean;
	/** Turns every header cell into a sort button. Individual cells can still opt in on their own.
	 * @default false
	 */
	sortable?: boolean;
	/** Drops the line that separates one row from the next.
	 * @default false
	 */
	noRowBorders?: boolean;
	/** Moves the focus between cells with the arrow keys, through a single tab stop. It also
	 * switches the table over to the `role="grid"` pattern, which that navigation requires.
	 * @default false
	 */
	enableTabspot?: boolean;
	/** Lets the arrow keys reach rows a windowed list has not rendered. Only read when
	 * `enableTabspot` is set, and the rows need an `aria-rowindex` for it to find them again.
	 * @type TableVirtualizer
	 */
	virtualizer?: TableVirtualizer;
	/** Gives every header cell a handle that drags its column wider or narrower. It also pins the
	 * table to a fixed layout, so a column keeps the width it was given.
	 * @default false
	 */
	resizableColumns?: boolean;
	/** The width of each column in pixels, by column position. Columns left out keep their own size.
	 * @bindable
	 */
	columnWidths?: number[];
	/** Per column limits, by column position.
	 * @type ColumnSizing[]
	 */
	columnSizing?: ColumnSizing[];
	/** Called whenever a column is dragged or nudged to a new width.
	 * @type (e: Event, data: { index: number; width: number }) => void
	 */
	onColumnResize?: (e: Event, data: { index: number; width: number }) => void;
} & PolymorphicProps<Tag>;

export type ColumnSizing = {
	/** Narrowest the column may be dragged, in pixels.
	 * @default 40
	 */
	minWidth?: number;
	/** Width the column starts at, in pixels. Without it the browser sizes the column. */
	defaultWidth?: number;
};

export type TableVirtualizer = {
	/** Total number of real rows, the whole data set rather than the rendered window. */
	size: number;
	/** Scroll so the row at `index` renders. May be async. */
	scrollToIndex?: (index: number) => void | Promise<void>;
};

/** @propsmith TableHeaderProps */
export type TableHeaderProps<Tag extends 'thead' | 'div' = 'thead'> = {
	/** The HTML element to render the header as. Inherited from the table by default.
	 * @type 'thead' | 'div'
	 * @default 'thead'
	 */
	as?: Tag;
	/** The DOM reference of the header element.
	 * @type HTMLTableSectionElement | HTMLDivElement
	 * @bindable
	 */
	ref?: TableDOM[Tag] | HTMLDivElement;
} & PolymorphicProps<Tag>;

/** @propsmith TableHeaderCellProps */
export type TableHeaderCellProps<Tag extends 'th' | 'div' = 'th'> = {
	/** The HTML element to render the header cell as. Inherited from the table by default.
	 * @type 'th' | 'div'
	 * @default 'th'
	 */
	as?: Tag;
	/** The DOM reference of the header cell element.
	 * @type HTMLTableCellElement | HTMLDivElement
	 * @bindable
	 */
	ref?: TableDOM[Tag] | HTMLDivElement;
	/** Whether the column is sortable. Inherited from the table by default. */
	sortable?: boolean;
	/** The direction the column is currently sorted in. Also sets `aria-sort`. */
	sortDirection?: SortDirection;
	/** The indicator rendered next to the label of a sortable column.
	 * @type Snippet | Component
	 */
	sortIcon?: Snippet<[{ class: string }]> | Component<{ class: string }>;
	/** Content placed after the label, outside the sort button.
	 * @type Snippet | Component
	 */
	aside?: Snippet<[{ class: string }]> | Component<{ class: string }>;
	/** How the arrow keys treat the cell. `'group'` holds the focusable content of the cell out of
	 * the tab order until `Enter` steps in, and `Escape` steps back out. `'none'` skips the cell
	 * altogether. Only read when the table sets `enableTabspot`. A resizable header cell defaults to
	 * `'group'`, so the arrows reach its handle instead of leaving the column behind.
	 * @default 'cell'
	 */
	focusMode?: CellFocusMode;
	/** Whether the column can be resized. Inherited from the table by default. */
	resizable?: boolean;
	/** The accessible name of the resize handle. Give it a translated, and ideally per column, string
	 * — the attributes of the cell reach the cell, never the handle inside it.
	 * @default 'Resize column'
	 */
	resizeLabel?: string;
} & PolymorphicProps<Tag>;

/** @propsmith TableBodyProps */
export type TableBodyProps<Tag extends 'tbody' | 'div' = 'tbody'> = {
	/** The HTML element to render the body as. Inherited from the table by default.
	 * @type 'tbody' | 'div'
	 * @default 'tbody'
	 */
	as?: Tag;
	/** The DOM reference of the body element.
	 * @type HTMLTableSectionElement | HTMLDivElement
	 * @bindable
	 */
	ref?: TableDOM[Tag] | HTMLDivElement;
} & PolymorphicProps<Tag>;

/** @propsmith TableRowProps */
export type TableRowProps<Tag extends 'tr' | 'div' = 'tr'> = {
	/** The HTML element to render the row as. Inherited from the table by default.
	 * @type 'tr' | 'div'
	 * @default 'tr'
	 */
	as?: Tag;
	/** The DOM reference of the row element.
	 * @type HTMLTableRowElement | HTMLDivElement
	 * @bindable
	 */
	ref?: TableDOM[Tag] | HTMLDivElement;
	/** How the row is filled. Intended to mark a selected row.
	 * @default 'none'
	 */
	appearance?: TableRowAppearance;
} & PolymorphicProps<Tag>;

/** @propsmith TableCellProps */
export type TableCellProps<Tag extends 'td' | 'div' = 'td'> = {
	/** The HTML element to render the cell as. Inherited from the table by default.
	 * @type 'td' | 'div'
	 * @default 'td'
	 */
	as?: Tag;
	/** The DOM reference of the cell element.
	 * @type HTMLTableCellElement | HTMLDivElement
	 * @bindable
	 */
	ref?: TableDOM[Tag] | HTMLDivElement;
	/** How the arrow keys treat the cell. `'group'` holds the focusable content of the cell out of
	 * the tab order until `Enter` steps in, and `Escape` steps back out. `'none'` skips the cell
	 * altogether. Only read when the table sets `enableTabspot`.
	 * @default 'cell'
	 */
	focusMode?: CellFocusMode;
} & PolymorphicProps<Tag>;

/** @propsmith TableSelectionCellProps */
export type TableSelectionCellProps<Tag extends 'td' | 'div' = 'td'> = {
	/** The HTML element to render the cell as. Inherited from the table by default.
	 * @type 'td' | 'div'
	 * @default 'td'
	 */
	as?: Tag;
	/** The DOM reference of the cell element.
	 * @type HTMLTableCellElement | HTMLDivElement
	 * @bindable
	 */
	ref?: TableDOM[Tag] | HTMLDivElement;
	/** A table can have two kinds of selection modes.
	 * @default 'checkbox'
	 */
	type?: SelectionType;
	/** Whether the row is selected. `'mixed'` renders the indeterminate state.
	 * @type boolean | 'mixed'
	 * @default false
	 */
	checked?: boolean | 'mixed';
	/** Only shows the indicator when it is checked, or the row is hovered or focused.
	 * @default false
	 */
	subtle?: boolean;
	/** Hides the indicator while it keeps taking up the same space.
	 * @default false
	 */
	invisible?: boolean;
	/** The props to spread on the checkbox rendered when `type` is `'checkbox'`.
	 * @type CheckboxProps
	 */
	checkboxIndicator?: Omit<CheckboxProps<'div'>, 'wrapperAs' | 'checked' | 'indeterminate' | 'children'>;
	/** The props to spread on the radio button rendered when `type` is `'radio'`.
	 * @type RadioButtonProps
	 */
	radioIndicator?: Omit<RadioButtonProps, 'checked' | 'group'>;
} & PolymorphicProps<Tag>;

/** @propsmith TableCellLayoutProps */
export type TableCellLayoutProps = {
	/** The DOM reference of the layout element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** An icon, an avatar or any other visual element placed before the main content.
	 * @type Snippet | Component
	 */
	media?: Snippet<[{ class: string }]> | Component<{ class: string }>;
	/** A second line of text that describes or complements the main content. */
	description?: string;
	/** Emphasizes the cell by enlarging the media and bolding the main content. */
	appearance?: 'primary';
	/** Clips the content with an ellipsis instead of letting it wrap. */
	truncate?: boolean;
} & PolymorphicProps<'div'>;

/** @propsmith TableCellActionsProps */
export type TableCellActionsProps = {
	/** The DOM reference of the actions element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** Keeps the actions on screen instead of waiting for the row to be hovered or focused. */
	visible?: boolean;
} & PolymorphicProps<'div'>;

export type TableContextConfig = {
	size: TableSize;
	noNativeElements: boolean;
	sortable: boolean;
	enableTabspot: boolean;
	resizableColumns: boolean;
};

export type TableContextState = {
	columnWidths: number[];
};

export type TableContextMethods = {
	/** The width a column should render at, or `undefined` to let the browser decide. */
	getColumnWidth: (index: number) => number | undefined;
	/** Records a new width for a column, clamped to the minimum it was given. */
	resizeColumn: (e: Event, index: number, width: number) => void;
};

export type TableContext = FSContext<TableContextConfig, TableContextState, null, TableContextMethods>;
