# Table

A table displays sets of two dimensional data. Every part is a primitive that can be composed freely, so the table itself stays unopinionated about where the data comes from.

The components are deliberately low level: sorting, selection and filtering are not built in. The table renders what you hand it and reports the state you give it, so any data layer — plain runes, a store, a server load function — drives it without fighting an internal engine.

To create a table, you will need the following components:

- `Table`: The root component. It creates the context every other part reads: the size, whether the parts render as native table elements, whether the columns are sortable, and whether the arrow keys move between cells.
- `TableHeader`: The header section of the table. Renders a `thead`.
- `TableHeaderCell`: A column header. Renders a `th`, and turns into a sort button when the column is sortable.
- `TableBody`: The body section of the table. Renders a `tbody`.
- `TableRow`: A row of the table. Renders a `tr`, and can be filled to mark it as selected.
- `TableCell`: A single cell. Renders a `td`.

Other components that can be used within the table include:

- `TableCellLayout`: Lays a cell out as media, main content and an optional description.
- `TableSelectionCell`: A cell holding the checkbox or radio button that reports whether the row is selected.
- `TableCellActions`: Actions pinned to the end of a cell, revealed while the row is hovered or holds the focus.

## Usage

```svelte
<script>
	import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from 'fluentui-svelte';

	const columns = ['File', 'Author', 'Last updated'];
	const items = [{ file: 'Meeting notes', author: 'Max Mustermann', lastUpdated: '7h ago' }];
</script>

<Table aria-label="Files">
	<TableHeader>
		<TableRow>
			{#each columns as column (column)}
				<TableHeaderCell>{column}</TableHeaderCell>
			{/each}
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each items as item (item.file)}
			<TableRow>
				<TableCell>{item.file}</TableCell>
				<TableCell>{item.author}</TableCell>
				<TableCell>{item.lastUpdated}</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
```

## More Examples

### Size

`size` sets the row height and the type scale of every part at once: `medium` (the default), `small` and `extra-small`.

```svelte
<Table size="extra-small">
	<TableHeader>
		<TableRow>
			<TableHeaderCell>File</TableHeaderCell>
		</TableRow>
	</TableHeader>
	<TableBody>
		<TableRow>
			<TableCell>Meeting notes</TableCell>
		</TableRow>
	</TableBody>
</Table>
```

### Sort

`sortable` on the table turns every header cell into a button; a single cell can opt in or out with its own `sortable`. The table never sorts the data: give each header the `sortDirection` it should announce through `aria-sort`, handle `onclick`, and hand back the rows in the order you want.

```svelte
<script>
	let sortColumn = $state('file');
	let sortDirection = $state('ascending');

	const sorted = $derived(
		[...items].sort((a, b) => (sortDirection === 'ascending' ? 1 : -1) * a[sortColumn].localeCompare(b[sortColumn]))
	);

	const toggleSort = (column) => {
		if (sortColumn === column) {
			sortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
		} else {
			sortColumn = column;
			sortDirection = 'ascending';
		}
	};
</script>

<Table sortable aria-label="Table with sort">
	<TableHeader>
		<TableRow>
			<TableHeaderCell
				sortDirection={sortColumn === 'file' ? sortDirection : undefined}
				onclick={() => toggleSort('file')}
			>
				File
			</TableHeaderCell>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each sorted as item (item.file)}
			<TableRow>
				<TableCell>{item.file}</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
```

### Multiple Selection

`TableSelectionCell` displays the selection, it does not own it. The click on the indicator also reaches the row underneath, so the row is the single place to wire `onclick`: hitting the checkbox and hitting the rest of the row run the same handler. Mark the row with `aria-selected` and set `appearance="brand"` to fill it, then feed `checked` back from your own state. A header selection cell accepts `checked="mixed"` for the partial state, and `type="radio"` swaps the checkbox for a radio button when only one row can be selected.

```svelte
<script>
	let selected = $state([items[0].file]);

	const allSelected = $derived(selected.length === items.length);
	const someSelected = $derived(selected.length > 0 && !allSelected);

	const toggleRow = (file) => {
		selected = selected.includes(file) ? selected.filter((f) => f !== file) : [...selected, file];
	};
</script>

<Table aria-label="Table with multiselect">
	<TableHeader>
		<TableRow>
			<TableSelectionCell
				checked={allSelected ? true : someSelected ? 'mixed' : false}
				checkboxIndicator={{ 'aria-label': 'Select all rows' }}
				onclick={() => (selected = allSelected ? [] : items.map((item) => item.file))}
			/>
			<TableHeaderCell>File</TableHeaderCell>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each items as item (item.file)}
			{@const isSelected = selected.includes(item.file)}
			<TableRow
				aria-selected={isSelected}
				appearance={isSelected ? 'brand' : 'none'}
				onclick={() => toggleRow(item.file)}
			>
				<TableSelectionCell checked={isSelected} checkboxIndicator={{ 'aria-label': 'Select row' }} />
				<TableCell>{item.file}</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
```

### Single Selection

Set `type="radio"` on the selection cell when only one row can be selected at a time. Give every indicator the same `name` so the browser groups them, and use `invisible` on the header cell to keep the column aligned without offering a "select all".

```svelte
<script>
	let picked = $state(items[0].file);
</script>

<Table aria-label="Table with single select">
	<TableHeader>
		<TableRow>
			<TableSelectionCell type="radio" invisible />
			<TableHeaderCell>File</TableHeaderCell>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each items as item (item.file)}
			{@const isPicked = picked === item.file}
			<TableRow aria-selected={isPicked} appearance={isPicked ? 'brand' : 'none'} onclick={() => (picked = item.file)}>
				<TableSelectionCell
					type="radio"
					checked={isPicked}
					radioIndicator={{ name: 'file', 'aria-label': 'Select row' }}
				/>
				<TableCell>{item.file}</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
```

### Subtle Selection

`subtle` keeps the indicator out of sight until the row is hovered, holds the focus, or is checked. It calms a dense table without losing the affordance. `invisible` is the sibling knob: it hides the indicator while it still takes up the same space, which keeps a row without a selection aligned with the rest.

```svelte
<TableRow aria-selected={isSelected} appearance={isSelected ? 'brand' : 'none'} onclick={...}>
	<TableSelectionCell subtle checked={isSelected} checkboxIndicator={{ 'aria-label': 'Select row' }} />
	<TableCell>{item.file}</TableCell>
</TableRow>
```

### Cell Layout

`TableCellLayout` gives a cell the standard Fluent arrangement: `media` for an icon, an avatar or any other visual element, the children as the main content, and `description` for a second line below it. `appearance="primary"` enlarges the media and bolds the main content, which suits the first column of a table. `truncate` clips the content with an ellipsis instead of letting it wrap.

```svelte
<TableCell>
	<TableCellLayout media={DocumentRegular} description="7h ago" appearance="primary" truncate>
		Meeting notes
	</TableCellLayout>
</TableCell>
```

### Cell Actions

`TableCellActions` pins content to the end of a cell and reveals it while the row is hovered or holds the focus. It is usually a row of buttons, and `visible` keeps them on screen at all times. Give every action an accessible name: the row it belongs to is not announced with it.

```svelte
<TableCell>
	<TableCellLayout media={item.icon}>{item.file}</TableCellLayout>
	<TableCellActions>
		<Button appearance="subtle" shape="circular" aria-label="Edit {item.file}">
			<EditRegular />
		</Button>
		<Button appearance="subtle" shape="circular" aria-label="More actions for {item.file}">
			<MoreHorizontalRegular />
		</Button>
	</TableCellActions>
</TableCell>
```

### Keyboard Navigation

`enableTabspot` gives the table a single tab stop and moves the focus between cells with the arrow keys, with `Home`, `End`, `PageUp` and `PageDown` jumping further. It also switches the table over to the `role="grid"` pattern that navigation requires: the root reports `grid` and every data cell reports `gridcell`. There is no separate DataGrid component here, this prop is the whole opt-in. It needs the `FluentUISvelte` provider around the table, which is what starts the focus engine.

A cell decides how the cursor treats it with `focusMode`:

- `'cell'` (the default) makes the cell a stop of its own.
- `'group'` is for a cell with focusable content. The content is held out of the tab order, `Enter` steps into it, and `Escape` steps back out to the cell. Without it every button in every row would be its own tab stop, which is what a single tab stop exists to avoid.
- `'none'` skips the cell: the cursor passes over it rather than landing on it.

```svelte
<Table enableTabspot aria-label="Table with keyboard navigation">
	<TableHeader>
		<TableRow>
			<TableHeaderCell>File</TableHeaderCell>
			<TableHeaderCell>Actions</TableHeaderCell>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each items as item (item.file)}
			<TableRow>
				<TableCell>{item.file}</TableCell>

				<!-- Enter steps into the cell to reach the buttons, Escape steps back out. -->
				<TableCell focusMode="group">
					<TableCellActions visible>
						<Button appearance="subtle" shape="circular" aria-label="Edit {item.file}">
							<EditRegular />
						</Button>
					</TableCellActions>
				</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
```

### Resizable Columns

`resizableColumns` gives every header cell a handle that drags its column wider or narrower, and pins the table to a fixed layout so the width sticks. A single column opts in or out with its own `resizable`.

- `columnSizing` sets a floor per column, by column position. Without one a column stops at 40px.
- `columnWidths` is the width of each column in pixels, by position. Bind it to read the widths back or to restore them later; leave it alone and the table keeps them itself.
- `onColumnResize` reports every change as `{ index, width }`.

The handle is a [WAI window splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/): it takes the focus and answers the left and right arrows, so the columns are reachable without a pointer. Under `enableTabspot` a resizable header cell defaults to `focusMode="group"`, so `Enter` steps in to reach the handle and `Escape` steps back out.

```svelte
<script>
	// Bind only if you want to read the widths back, or restore them later.
	let columnWidths = $state([200, 180, 160]);
</script>

<Table
	resizableColumns
	bind:columnWidths
	columnSizing={[{ minWidth: 120 }, { minWidth: 100 }, { minWidth: 100 }]}
	onColumnResize={(e, { index, width }) => console.log(index, width)}
	aria-label="Table with resizable columns"
>
	<TableHeader>
		<TableRow>
			<TableHeaderCell>File</TableHeaderCell>
			<TableHeaderCell>Author</TableHeaderCell>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each items as item (item.file)}
			<TableRow>
				<TableCell>{item.file}</TableCell>
				<TableCell>{item.author}</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
```

A fixed table sizes to the sum of its columns, so wrap it in a container with `overflow-x: auto` when the columns can grow past the space you have. Pair the cells with `<TableCellLayout truncate>` so a narrowed column clips its text instead of pushing it out.

### No Row Borders

`noRowBorders` drops the line that separates one row from the next, for a table that sits inside a card or another surface that already frames it.

```svelte
<Table noRowBorders aria-label="Table without row borders">
	<TableHeader>
		<TableRow>
			<TableHeaderCell>File</TableHeaderCell>
		</TableRow>
	</TableHeader>
	<TableBody>
		<TableRow>
			<TableCell>Meeting notes</TableCell>
		</TableRow>
	</TableBody>
</Table>
```

### Non Native Elements

`noNativeElements` renders every part as a `div` and lays the rows out with flexbox instead of `display: table`. The ARIA roles that a native table provides implicitly are written out, so the semantics stay the same. Use it when the strict table layout gets in the way — virtualized rows and sticky headers are the usual reasons. A single part can still be overridden through its own `as` prop.

```svelte
<Table noNativeElements aria-label="Table rendered with divs">
	<TableHeader>
		<TableRow>
			<TableHeaderCell>File</TableHeaderCell>
		</TableRow>
	</TableHeader>
	<TableBody>
		<TableRow>
			<TableCell>Meeting notes</TableCell>
		</TableRow>
	</TableBody>
</Table>
```

### Virtualization

The table renders whatever you put inside it, so any virtualization library works. A semantic `table` is laid out by the browser in a single pass and fights a windowed list, so pair it with `noNativeElements`. Only a window of rows exists in the DOM, so report the real size of the data set with `aria-rowcount` on the table and `aria-rowindex` on each row — the header row is index 1, so the data starts at 2.

```svelte
<script>
	import SvelteVirtualList from '@humanspeak/svelte-virtual-list';

	const rows = Array.from({ length: 2000 }, (_, i) => ({ id: i, file: `Document ${i + 1}` }));
</script>

<Table noNativeElements aria-label="Virtualized table" aria-rowcount={rows.length + 1}>
	<TableHeader>
		<TableRow aria-rowindex={1}>
			<TableHeaderCell>File</TableHeaderCell>
		</TableRow>
	</TableHeader>
	<TableBody style="height: 320px;">
		<SvelteVirtualList items={rows} defaultEstimatedItemHeight={44}>
			{#snippet renderItem(row, index)}
				<TableRow aria-rowindex={index + 2}>
					<TableCell>{row.file}</TableCell>
				</TableRow>
			{/snippet}
		</SvelteVirtualList>
	</TableBody>
</Table>
```

`enableTabspot` does not follow the rows out of the rendered window on its own: the arrow keys stop at the edge of the slice the list has rendered. Wiring the two together needs a virtualization adapter, the way `TreeView` does with its `virtualizer` prop.

## Accessibility

- Always include a `TableHeader` row.
- When the table is preceded by a heading, point `aria-labelledby` at the id of that heading. When it has no visible label, give it an `aria-label`.
- Set a `min-width` so the table still reads at high zoom levels and on small screens.
- Do not override the `role` of the table parts. Keyboard navigation is the one case where the roles change, and `enableTabspot` handles it for you: it applies the [`role="grid"` pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) the navigation requires.

## Component Props (Table)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TableProps -->

| Name                      | Type                                                         | Default    | Description                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `as`                      | `'table'` &#124; `'div'`                                     | `'table'`  | The HTML element to render the table as. Defaults to a `div` when `noNativeElements` is set.                                                                                         |
| `ref` _bindable_          | `HTMLTableElement` &#124; `HTMLDivElement`                   |            | The DOM reference of the table element.                                                                                                                                              |
| `size`                    | `'extra-small'` &#124; `'small'` &#124; `'medium'`           | `'medium'` | Affects the sizes of all table subcomponents.                                                                                                                                        |
| `noNativeElements`        | `boolean`                                                    | `false`    | Renders every table part as a `div` instead of a semantic table element. The layout switches from `display: table` to `display: flex`, which virtualization and sticky headers need. |
| `sortable`                | `boolean`                                                    | `false`    | Turns every header cell into a sort button. Individual cells can still opt in on their own.                                                                                          |
| `noRowBorders`            | `boolean`                                                    | `false`    | Drops the line that separates one row from the next.                                                                                                                                 |
| `enableTabspot`           | `boolean`                                                    | `false`    | Moves the focus between cells with the arrow keys, through a single tab stop. It also switches the table over to the `role="grid"` pattern, which that navigation requires.          |
| `virtualizer`             | `TableVirtualizer`                                           |            | Lets the arrow keys reach rows a windowed list has not rendered. Only read when `enableTabspot` is set, and the rows need an `aria-rowindex` for it to find them again.              |
| `resizableColumns`        | `boolean`                                                    | `false`    | Gives every header cell a handle that drags its column wider or narrower. It also pins the table to a fixed layout, so a column keeps the width it was given.                        |
| `columnWidths` _bindable_ | `number[]`                                                   |            | The width of each column in pixels, by column position. Columns left out keep their own size.                                                                                        |
| `columnSizing`            | `ColumnSizing[]`                                             |            | Per column limits, by column position.                                                                                                                                               |
| `onColumnResize`          | `(e: Event, data: { index: number; width: number }) => void` |            | Called whenever a column is dragged or nudged to a new width.                                                                                                                        |
| HTML Attributes           |                                                              |            |                                                                                                                                                                                      |

<!-- /props:TableProps -->

## Component Props (TableHeader)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TableHeaderProps -->

| Name             | Type                                              | Default   | Description                                                                    |
| ---------------- | ------------------------------------------------- | --------- | ------------------------------------------------------------------------------ |
| `as`             | `'thead'` &#124; `'div'`                          | `'thead'` | The HTML element to render the header as. Inherited from the table by default. |
| `ref` _bindable_ | `HTMLTableSectionElement` &#124; `HTMLDivElement` |           | The DOM reference of the header element.                                       |
| HTML Attributes  |                                                   |           |                                                                                |

<!-- /props:TableHeaderProps -->

## Component Props (TableHeaderCell)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TableHeaderCellProps -->

| Name             | Type                                           | Default  | Description                                                                                                                                                                                                                                                                                                                                                           |
| ---------------- | ---------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`             | `'th'` &#124; `'div'`                          | `'th'`   | The HTML element to render the header cell as. Inherited from the table by default.                                                                                                                                                                                                                                                                                   |
| `ref` _bindable_ | `HTMLTableCellElement` &#124; `HTMLDivElement` |          | The DOM reference of the header cell element.                                                                                                                                                                                                                                                                                                                         |
| `sortable`       | `boolean`                                      |          | Whether the column is sortable. Inherited from the table by default.                                                                                                                                                                                                                                                                                                  |
| `sortDirection`  | `'ascending'` &#124; `'descending'`            |          | The direction the column is currently sorted in. Also sets `aria-sort`.                                                                                                                                                                                                                                                                                               |
| `sortIcon`       | `Snippet` &#124; `Component`                   |          | The indicator rendered next to the label of a sortable column.                                                                                                                                                                                                                                                                                                        |
| `aside`          | `Snippet` &#124; `Component`                   |          | Content placed after the label, outside the sort button.                                                                                                                                                                                                                                                                                                              |
| `focusMode`      | `'cell'` &#124; `'group'` &#124; `'none'`      | `'cell'` | How the arrow keys treat the cell. `'group'` holds the focusable content of the cell out of the tab order until `Enter` steps in, and `Escape` steps back out. `'none'` skips the cell altogether. Only read when the table sets `enableTabspot`. A resizable header cell defaults to `'group'`, so the arrows reach its handle instead of leaving the column behind. |
| `resizable`      | `boolean`                                      |          | Whether the column can be resized. Inherited from the table by default.                                                                                                                                                                                                                                                                                               |
| HTML Attributes  |                                                |          |                                                                                                                                                                                                                                                                                                                                                                       |

<!-- /props:TableHeaderCellProps -->

## Component Props (TableBody)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TableBodyProps -->

| Name             | Type                                              | Default   | Description                                                                  |
| ---------------- | ------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| `as`             | `'tbody'` &#124; `'div'`                          | `'tbody'` | The HTML element to render the body as. Inherited from the table by default. |
| `ref` _bindable_ | `HTMLTableSectionElement` &#124; `HTMLDivElement` |           | The DOM reference of the body element.                                       |
| HTML Attributes  |                                                   |           |                                                                              |

<!-- /props:TableBodyProps -->

## Component Props (TableRow)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TableRowProps -->

| Name             | Type                                          | Default  | Description                                                                 |
| ---------------- | --------------------------------------------- | -------- | --------------------------------------------------------------------------- |
| `as`             | `'tr'` &#124; `'div'`                         | `'tr'`   | The HTML element to render the row as. Inherited from the table by default. |
| `ref` _bindable_ | `HTMLTableRowElement` &#124; `HTMLDivElement` |          | The DOM reference of the row element.                                       |
| `appearance`     | `'none'` &#124; `'brand'` &#124; `'neutral'`  | `'none'` | How the row is filled. Intended to mark a selected row.                     |
| HTML Attributes  |                                               |          |                                                                             |

<!-- /props:TableRowProps -->

## Component Props (TableCell)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TableCellProps -->

| Name             | Type                                           | Default  | Description                                                                                                                                                                                                                                       |
| ---------------- | ---------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`             | `'td'` &#124; `'div'`                          | `'td'`   | The HTML element to render the cell as. Inherited from the table by default.                                                                                                                                                                      |
| `ref` _bindable_ | `HTMLTableCellElement` &#124; `HTMLDivElement` |          | The DOM reference of the cell element.                                                                                                                                                                                                            |
| `focusMode`      | `'cell'` &#124; `'group'` &#124; `'none'`      | `'cell'` | How the arrow keys treat the cell. `'group'` holds the focusable content of the cell out of the tab order until `Enter` steps in, and `Escape` steps back out. `'none'` skips the cell altogether. Only read when the table sets `enableTabspot`. |
| HTML Attributes  |                                                |          |                                                                                                                                                                                                                                                   |

<!-- /props:TableCellProps -->

## Component Props (TableSelectionCell)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TableSelectionCellProps -->

| Name                | Type                                           | Default      | Description                                                                    |
| ------------------- | ---------------------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| `as`                | `'td'` &#124; `'div'`                          | `'td'`       | The HTML element to render the cell as. Inherited from the table by default.   |
| `ref` _bindable_    | `HTMLTableCellElement` &#124; `HTMLDivElement` |              | The DOM reference of the cell element.                                         |
| `type`              | `'checkbox'` &#124; `'radio'`                  | `'checkbox'` | A table can have two kinds of selection modes.                                 |
| `checked`           | `boolean` &#124; `'mixed'`                     | `false`      | Whether the row is selected. `'mixed'` renders the indeterminate state.        |
| `subtle`            | `boolean`                                      | `false`      | Only shows the indicator when it is checked, or the row is hovered or focused. |
| `invisible`         | `boolean`                                      | `false`      | Hides the indicator while it keeps taking up the same space.                   |
| `checkboxIndicator` | `CheckboxProps`                                |              | The props to spread on the checkbox rendered when `type` is `'checkbox'`.      |
| `radioIndicator`    | `RadioButtonProps`                             |              | The props to spread on the radio button rendered when `type` is `'radio'`.     |
| HTML Attributes     |                                                |              |                                                                                |

<!-- /props:TableSelectionCellProps -->

## Component Props (TableCellLayout)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TableCellLayoutProps -->

| Name             | Type                         | Default | Description                                                                    |
| ---------------- | ---------------------------- | ------- | ------------------------------------------------------------------------------ |
| `ref` _bindable_ | `HTMLDivElement`             |         | The DOM reference of the layout element.                                       |
| `media`          | `Snippet` &#124; `Component` |         | An icon, an avatar or any other visual element placed before the main content. |
| `description`    | `string`                     |         | A second line of text that describes or complements the main content.          |
| `appearance`     | `'primary'`                  |         | Emphasizes the cell by enlarging the media and bolding the main content.       |
| `truncate`       | `boolean`                    |         | Clips the content with an ellipsis instead of letting it wrap.                 |
| HTML Attributes  |                              |         |                                                                                |

<!-- /props:TableCellLayoutProps -->

## Component Props (TableCellActions)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TableCellActionsProps -->

| Name             | Type             | Default | Description                                                                          |
| ---------------- | ---------------- | ------- | ------------------------------------------------------------------------------------ |
| `ref` _bindable_ | `HTMLDivElement` |         | The DOM reference of the actions element.                                            |
| `visible`        | `boolean`        |         | Keeps the actions on screen instead of waiting for the row to be hovered or focused. |
| HTML Attributes  |                  |         |                                                                                      |

<!-- /props:TableCellActionsProps -->
