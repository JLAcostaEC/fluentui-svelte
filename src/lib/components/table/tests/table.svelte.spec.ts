import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { SvelteSet } from 'svelte/reactivity';
import { TableBody, TableCell, TableCellActions, TableHeader, TableHeaderCell, TableRow } from '$lib/index.js';
import TableTestWrapper from './TableTestWrapper.svelte';
import TableVirtualTestWrapper from './TableVirtualTestWrapper.svelte';

describe('Table', () => {
	it('renders a native table', async () => {
		render(TableTestWrapper);
		const el = page.getByRole('table');
		await expect.element(el).toBeInTheDocument();
		await expect.element(el).toHaveClass('fs-table');
	});

	it('carries the size as a class', async () => {
		render(TableTestWrapper, { size: 'extra-small' });
		await expect.element(page.getByRole('table')).toHaveClass('extra-small');
	});

	it('renders semantic elements by default', async () => {
		render(TableTestWrapper);
		await expect.element(page.selector('table > thead > tr > th').first()).toBeInTheDocument();
		await expect.element(page.selector('table > tbody > tr > td').first()).toBeInTheDocument();
	});

	it('renders divs, with explicit roles, when noNativeElements is set', async () => {
		render(TableTestWrapper, { noNativeElements: true });
		await expect.element(page.selector('div.fs-table')).toHaveAttribute('role', 'table');
		await expect.element(page.selector('div.fs-table-header')).toHaveAttribute('role', 'rowgroup');
		await expect.element(page.selector('div.fs-table-row').first()).toHaveAttribute('role', 'row');
		await expect.element(page.selector('div.fs-table-header-cell').first()).toHaveAttribute('role', 'columnheader');
		await expect.element(page.selector('div.fs-table-cell').first()).toHaveAttribute('role', 'cell');
	});

	it('drops the row separator when noRowBorders is set', async () => {
		render(TableTestWrapper, { noRowBorders: true });
		await expect.element(page.getByRole('table')).toHaveClass('no-row-borders');
	});
});

describe('enableTabspot', () => {
	it('leaves the table a plain table when it is off', async () => {
		render(TableTestWrapper);
		await expect.element(page.getByRole('table')).not.toHaveAttribute('data-tabspot');
	});

	it('switches the table over to the grid pattern', async () => {
		render(TableTestWrapper, { enableTabspot: true });
		const el = page.getByRole('grid');
		await expect.element(el).toBeInTheDocument();
		await expect.element(el).toHaveAttribute('data-tabspot');
	});

	it('renames the data cells to gridcell', async () => {
		render(TableTestWrapper, { enableTabspot: true });
		await expect.element(page.getByRole('gridcell').first()).toBeInTheDocument();
		// The header cells keep reporting as column headers.
		await expect.element(page.getByRole('columnheader').first()).toBeInTheDocument();
	});

	it('holds the content of a group cell out of the tab order, and Enter steps in', async () => {
		render(TableTestWrapper, { enableTabspot: true, variant: 'actions' });
		const edit = page.getByRole('button', { name: 'Edit Meeting notes' });
		await expect.element(edit).toHaveAttribute('tabindex', '-1');

		// Arriving from the neighbouring cell keeps the pointer off the buttons inside this one.
		const cell = page.selector('[data-fs-focus-mode="group"]').first();
		await page.getByRole('gridcell').nth(1).click();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(cell).toHaveFocus();

		await userEvent.keyboard('{Enter}');
		await expect.element(edit).toHaveFocus();
		await expect.element(edit).not.toHaveAttribute('tabindex', '-1');

		await userEvent.keyboard('{Escape}');
		await expect.element(cell).toHaveFocus();
		await expect.element(edit).toHaveAttribute('tabindex', '-1');
	});

	it('never lands on a cell that asked for no focus', async () => {
		render(TableTestWrapper, { enableTabspot: true, cellFocusMode: 'none' });
		const cells = page.getByRole('gridcell');
		await expect.element(cells.nth(1)).toHaveAttribute('data-fs-focus-mode', 'none');

		await cells.first().click();
		await expect.element(cells.first()).toHaveFocus();
		// The only cell to the right is the skipped one, so the cursor has nowhere left to go.
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(cells.first()).toHaveFocus();
	});

	it('gives the grid a single tab stop and walks the cells with the arrows', async () => {
		render(TableTestWrapper, { enableTabspot: true });
		const cells = page.getByRole('gridcell');
		await cells.first().click();
		await expect.element(cells.first()).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(cells.nth(1)).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(cells.nth(3)).toHaveFocus();
	});
});

describe('TableHeaderCell', () => {
	it('scopes the native header cell to its column', async () => {
		render(TableTestWrapper);
		await expect.element(page.getByRole('columnheader').first()).toHaveAttribute('scope', 'col');
	});

	it('renders no button while the table is not sortable', async () => {
		render(TableTestWrapper);
		await expect.element(page.getByRole('button')).not.toBeInTheDocument();
	});

	it('turns every header cell into a button when the table is sortable', async () => {
		render(TableTestWrapper, { sortable: true });
		await expect.element(page.getByRole('button', { name: 'File' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Author' })).toBeInTheDocument();
	});

	it('reports the sort direction through aria-sort', async () => {
		render(TableTestWrapper, { sortable: true, sortDirection: 'descending' });
		await expect.element(page.getByRole('columnheader').first()).toHaveAttribute('aria-sort', 'descending');
	});

	it('bubbles the click of the sort button up to the cell', async () => {
		const onclick = vi.fn();
		render(TableTestWrapper, { sortable: true, onclick });
		await page.getByRole('button', { name: 'File' }).click();
		expect(onclick).toHaveBeenCalled();
	});

	it('throws when used outside a Table', async () => {
		await expect(render(TableHeaderCell)).rejects.toThrow('No TableContext found for fs-table-.');
	});
});

describe('TableRow', () => {
	it('carries the appearance as a class', async () => {
		render(TableTestWrapper, { appearance: 'brand' });
		await expect.element(page.selector('tbody .fs-table-row').first()).toHaveClass('brand');
	});

	it('throws when used outside a Table', async () => {
		await expect(render(TableRow)).rejects.toThrow('No TableContext found for fs-table-.');
	});
});

describe('TableSelectionCell', () => {
	it('renders a checkbox by default', async () => {
		render(TableTestWrapper, { variant: 'selection' });
		await expect.element(page.getByRole('checkbox', { name: 'Select row' }).first()).toBeInTheDocument();
	});

	it('renders a radio button when the type asks for one', async () => {
		render(TableTestWrapper, { variant: 'selection', selectionType: 'radio' });
		await expect.element(page.getByRole('radio', { name: 'Select row' }).first()).toBeInTheDocument();
	});

	it('checks the indicator when the row is selected', async () => {
		render(TableTestWrapper, { variant: 'selection', checked: true });
		await expect.element(page.getByRole('checkbox', { name: 'Select row' }).first()).toBeChecked();
	});

	it('renders the indeterminate state for a mixed selection', async () => {
		render(TableTestWrapper, { variant: 'selection', checked: 'mixed' });
		const el = page.getByRole('checkbox', { name: 'Select all rows' });
		await expect.element(el).toBeInTheDocument();
		expect((el.element() as HTMLInputElement).indeterminate).toBe(true);
	});

	it('lets a click on the indicator reach the row, which is where the selection is wired', async () => {
		const onRowClick = vi.fn();
		render(TableTestWrapper, { variant: 'selection', onRowClick });
		await page.getByRole('checkbox', { name: 'Select row' }).first().click();
		expect(onRowClick).toHaveBeenCalled();
	});

	it('selects with Space once the arrows have parked the focus on a cell', async () => {
		const onRowClick = vi.fn();
		render(TableTestWrapper, { enableTabspot: true, variant: 'selection', onRowClick });
		// A data cell, so the click lands on the cell itself rather than on the indicator inside.
		const cell = page.getByRole('gridcell').nth(2);
		await cell.click();
		await expect.element(cell).toHaveFocus();
		await userEvent.keyboard(' ');
		expect(onRowClick).toHaveBeenCalled();
	});

	it('leaves Space alone on a row nobody wired', async () => {
		render(TableTestWrapper, { enableTabspot: true, variant: 'selection' });
		const cell = page.getByRole('gridcell').nth(2);
		await cell.click();
		await userEvent.keyboard(' ');
		// The key was never claimed, so the focus simply stays where the arrows left it.
		await expect.element(cell).toHaveFocus();
	});

	it('does the same for a radio indicator', async () => {
		const onRowClick = vi.fn();
		render(TableTestWrapper, { variant: 'selection', selectionType: 'radio', onRowClick });
		await page.getByRole('radio', { name: 'Select row' }).first().click();
		expect(onRowClick).toHaveBeenCalled();
	});

	it('marks the cell as subtle and invisible', async () => {
		render(TableTestWrapper, { variant: 'selection', subtle: true, invisible: true });
		const el = page.selector('.fs-table-selection-cell').first();
		await expect.element(el).toHaveClass('subtle');
		await expect.element(el).toHaveClass('invisible');
	});
});

describe('TableCellLayout', () => {
	it('renders the description below the main content', async () => {
		render(TableTestWrapper, { variant: 'layout', description: '7h ago' });
		await expect.element(page.getByText('7h ago').first()).toBeInTheDocument();
	});
});

describe('TableCellActions', () => {
	it('renders the actions inside the cell', async () => {
		render(TableTestWrapper, { variant: 'actions' });
		await expect.element(page.getByRole('button', { name: 'Edit Meeting notes' })).toBeInTheDocument();
	});

	it('stays hidden until the row is engaged', async () => {
		render(TableTestWrapper, { variant: 'actions' });
		await expect.element(page.selector('.fs-table-cell-actions').first()).not.toHaveClass('visible');
	});

	it('keeps the actions on screen when visible is set', async () => {
		render(TableTestWrapper, { variant: 'actions', actionsVisible: true });
		await expect.element(page.selector('.fs-table-cell-actions').first()).toHaveClass('visible');
	});

	it('throws when used outside a Table', async () => {
		await expect(render(TableCellActions)).rejects.toThrow('No TableContext found for fs-table-.');
	});
});

describe('resizableColumns', () => {
	it('renders no handle while the table is not resizable', async () => {
		render(TableTestWrapper);
		await expect.element(page.selector('.resize-handle')).not.toBeInTheDocument();
	});

	it('gives every header cell a handle and a fixed layout', async () => {
		render(TableTestWrapper, { resizableColumns: true });
		await expect.element(page.getByRole('table')).toHaveClass('resizable');
		await expect.element(page.getByRole('separator', { name: 'Resize column' }).first()).toBeInTheDocument();
	});

	it('applies the given widths to the header and to the body below it', async () => {
		render(TableTestWrapper, { resizableColumns: true, columnWidths: [220, 140] });
		await expect.element(page.getByRole('columnheader').first()).toHaveStyle({ width: '220px' });
		const header = page.getByRole('columnheader').first().element() as HTMLElement;
		const cell = document.querySelector('tbody td') as HTMLElement;
		expect(Math.round(cell.getBoundingClientRect().width)).toBe(Math.round(header.getBoundingClientRect().width));
	});

	it('nudges the column with the arrow keys', async () => {
		const onColumnResize = vi.fn();
		render(TableTestWrapper, { resizableColumns: true, columnWidths: [220, 140], onColumnResize });
		const handle = page.getByRole('separator', { name: 'Resize column' }).first();
		(handle.element() as HTMLElement).focus();
		await expect.element(handle).toHaveFocus();

		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('columnheader').first()).toHaveStyle({ width: '236px' });

		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(page.getByRole('columnheader').first()).toHaveStyle({ width: '220px' });
		expect(onColumnResize).toHaveBeenCalledWith(expect.anything(), { index: 0, width: 220 });
	});

	it('reaches the handle through the grid, and resizes without moving the cursor off the cell', async () => {
		render(TableTestWrapper, { resizableColumns: true, enableTabspot: true, columnWidths: [220, 140] });
		const header = page.getByRole('columnheader').first();
		const handle = page.getByRole('separator', { name: 'Resize column' }).first();

		// A resizable header defaults to focusMode="group", so the handle waits behind Enter.
		await expect.element(handle).toHaveAttribute('tabindex', '-1');
		await header.click();
		await expect.element(header).toHaveFocus();

		await userEvent.keyboard('{Enter}');
		await expect.element(handle).toHaveFocus();

		await userEvent.keyboard('{ArrowRight}');
		await expect.element(header).toHaveStyle({ width: '236px' });

		await userEvent.keyboard('{Escape}');
		await expect.element(header).toHaveFocus();
		await expect.element(handle).toHaveAttribute('tabindex', '-1');
	});

	it('never drags a column below the minimum it was given', async () => {
		render(TableTestWrapper, {
			resizableColumns: true,
			columnWidths: [130, 140],
			columnSizing: [{ minWidth: 120 }, { minWidth: 100 }]
		});
		const handle = page.getByRole('separator', { name: 'Resize column' }).first();
		(handle.element() as HTMLElement).focus();
		// Two nudges would reach 98px, the floor stops it at 120.
		await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
		await expect.element(page.getByRole('columnheader').first()).toHaveStyle({ width: '120px' });
	});
});

describe('virtualization', () => {
	it('renders a window of the rows, not all of them', async () => {
		render(TableVirtualTestWrapper, { count: 500 });
		await expect.element(page.getByRole('cell', { name: 'Document 1', exact: true })).toBeInTheDocument();
		const rendered = document.querySelectorAll('.fs-table-body .fs-table-row').length;
		expect(rendered).toBeGreaterThan(0);
		expect(rendered).toBeLessThan(500);
	});

	it('stacks the rendered rows instead of piling them up', async () => {
		render(TableVirtualTestWrapper, { count: 500 });
		await expect.element(page.getByRole('cell', { name: 'Document 2', exact: true })).toBeInTheDocument();
		const [first, second] = [...document.querySelectorAll('.fs-table-body .fs-table-row')];
		const a = first.getBoundingClientRect();
		const b = second.getBoundingClientRect();
		expect(a.height).toBeGreaterThan(0);
		expect(b.top).toBeGreaterThanOrEqual(a.bottom);
	});

	it('selects a virtualized row from its indicator', async () => {
		const selected = new SvelteSet<number>();
		render(TableVirtualTestWrapper, { count: 500, selected });
		await page.getByRole('checkbox', { name: 'Select Document 1', exact: true }).click();
		expect([...selected]).toEqual([0]);
	});

	it('carries the real size of the data set for assistive tech', async () => {
		render(TableVirtualTestWrapper, { count: 500 });
		await expect.element(page.getByRole('table')).toHaveAttribute('aria-rowcount', '501');
	});
});

describe('context', () => {
	it.each([
		['TableHeader', TableHeader],
		['TableBody', TableBody],
		['TableCell', TableCell]
	])('%s throws when used outside a Table', async (_name, Component) => {
		await expect(render(Component)).rejects.toThrow('No TableContext found for fs-table-.');
	});
});
