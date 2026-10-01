import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { ListViewItem } from '$lib/index.js';
import ListViewTestWrapper from './ListViewTestWrapper.svelte';

describe('ListView', () => {
	it('renders as a ul by default', async () => {
		render(ListViewTestWrapper);
		const el = page.selector('ul.fs-list-view');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders as ol when as="ol"', async () => {
		render(ListViewTestWrapper, { listProps: { as: 'ol' } });
		const el = page.selector('ol.fs-list-view');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders as div when as="div"', async () => {
		render(ListViewTestWrapper, { listProps: { as: 'div' } });
		const el = page.selector('div.fs-list-view');
		await expect.element(el).toBeInTheDocument();
	});

	it('throws for invalid tag', async () => {
		// @ts-expect-error incorrect tag type
		await expect(render(ListViewTestWrapper, { listProps: { as: 'span' } })).rejects.toThrow('Invalid tag: span');
	});

	it('applies role="list" when as="div" and selectionMode="none"', async () => {
		render(ListViewTestWrapper, { listProps: { as: 'div' } });
		const el = page.selector('div.fs-list-view');
		await expect.element(el).toHaveAttribute('role', 'list');
	});

	it('applies role="listbox" when selectionMode="single"', async () => {
		render(ListViewTestWrapper, { listProps: { selectionMode: 'single' } });
		const el = page.selector('.fs-list-view');
		await expect.element(el).toHaveAttribute('role', 'listbox');
	});

	it('applies role="listbox" with aria-multiselectable for multiselect', async () => {
		render(ListViewTestWrapper, { listProps: { selectionMode: 'multiselect' } });
		const el = page.selector('.fs-list-view');
		await expect.element(el).toHaveAttribute('role', 'listbox');
		await expect.element(el).toHaveAttribute('aria-multiselectable', 'true');
	});

	it('applies role="grid" for composite navigation with selection', async () => {
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'single', navigationMode: 'composite' }
		});
		const el = page.selector('.fs-list-view');
		await expect.element(el).toHaveAttribute('role', 'grid');
	});

	it('does not set role for ul/ol without selection', async () => {
		render(ListViewTestWrapper);
		const el = page.selector('ul.fs-list-view');
		await expect.element(el).not.toHaveAttribute('role');
	});

	it('forwards extra attributes', async () => {
		render(ListViewTestWrapper, { listProps: { 'data-testid': 'my-list' } });
		const el = page.getByTestId('my-list');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('ListViewItem', () => {
	it('renders as li by default inside a ListView', async () => {
		render(ListViewTestWrapper);
		const el = page.selector('li.fs-list-view-item');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders with data-value attribute', async () => {
		render(ListViewTestWrapper, { items: [{ value: 'my-val' }] });
		const el = page.selector('[data-value="my-val"]');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders multiple items', async () => {
		render(ListViewTestWrapper, {
			items: [{ value: 'a' }, { value: 'b' }, { value: 'c' }]
		});
		await expect.element(page.selector('[data-value="a"]')).toBeInTheDocument();
		await expect.element(page.selector('[data-value="b"]')).toBeInTheDocument();
		await expect.element(page.selector('[data-value="c"]')).toBeInTheDocument();
	});

	it('applies disabled class and aria-disabled', async () => {
		render(ListViewTestWrapper, {
			items: [{ value: 'dis', disabled: true }],
			listProps: { selectionMode: 'single' }
		});
		const el = page.selector('[data-value="dis"]');
		await expect.element(el).toHaveClass('disabled');
		await expect.element(el).toHaveAttribute('aria-disabled', 'true');
	});

	it('applies role="option" when selectionMode="single"', async () => {
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'single' },
			items: [{ value: 'opt' }]
		});
		const el = page.getByRole('option');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies role="row" when selectionMode with composite navigation', async () => {
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'single', navigationMode: 'composite' },
			items: [{ value: 'row' }]
		});
		const el = page.getByRole('row');
		await expect.element(el).toBeInTheDocument();
	});

	it('does not apply interactive class when disabled', async () => {
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'single' },
			items: [{ value: 'dis', disabled: true }]
		});
		const el = page.selector('.fs-list-view-item');
		await expect.element(el).not.toHaveClass('interactive');
	});

	it('applies active class when item is selected', async () => {
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'single', selectedItems: ['sel'] },
			items: [{ value: 'sel' }]
		});
		const el = page.selector('.fs-list-view-item.active');
		await expect.element(el).toBeInTheDocument();
	});

	it('selects item on click in single selection mode', async () => {
		const onSelectionChange = vi.fn();
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'single', onSelectionChange },
			items: [{ value: 'click-me' }]
		});
		await page.selector('[data-value="click-me"]').click();
		expect(onSelectionChange).toHaveBeenCalledOnce();
	});

	it('selects multiple items on {click + ctrl} in multiselect mode', async () => {
		let SelectedItems: string[] = [];
		const onSelectionChange = vi.fn((e: Event, selectedItems: string[]) => {
			SelectedItems = selectedItems;
		});
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'multiselect', onSelectionChange },
			items: [{ value: 'item1' }, { value: 'item2' }, { value: 'item3' }]
		});
		await page.selector('[data-value="item1"]').click();
		await userEvent.keyboard('{Control>}'); // hold ctrl
		await page.selector('[data-value="item2"]').click();
		await userEvent.keyboard('{/Control}'); // release ctrl
		expect(onSelectionChange).toHaveBeenCalledTimes(2);
		expect(SelectedItems).toEqual(['item1', 'item2']);
	});

	it('selects range of items on {click + shift} in extended selection mode', async () => {
		let SelectedItems: string[] = [];
		const onSelectionChange = vi.fn((e: Event, selectedItems: string[]) => {
			SelectedItems = selectedItems;
		});
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'extended', onSelectionChange },
			items: [{ value: 'item1' }, { value: 'item2' }, { value: 'item3' }, { value: 'item4' }]
		});
		await page.selector('[data-value="item1"]').click();
		await userEvent.keyboard('{Shift>}'); // hold shift
		await page.selector('[data-value="item3"]').click();
		await userEvent.keyboard('{/Shift}'); // release shift
		expect(onSelectionChange).toHaveBeenCalledTimes(2);
		expect(SelectedItems).toEqual(['item1', 'item2', 'item3']);
	});

	it('does not select disabled item on click', async () => {
		const onSelectionChange = vi.fn();
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'single', onSelectionChange },
			items: [{ value: 'no-click', disabled: true }]
		});
		await page.selector('[data-value="no-click"]').click({ force: true });
		expect(onSelectionChange).not.toHaveBeenCalled();
	});

	it('inherits shape from ListView', async () => {
		render(ListViewTestWrapper, {
			listProps: { shape: 'circular' },
			items: [{ value: 'shaped' }]
		});
		const el = page.selector('.fs-list-view-item.circular');
		await expect.element(el).toBeInTheDocument();
	});

	it('throws when used outside ListView', async () => {
		await expect(render(ListViewItem, { value: 'orphan' })).rejects.toThrow(
			'ListViewItem must be used within a ListView'
		);
	});
});

describe('ListViewItem checkmark', () => {
	const checkbox = (value: string) => page.selector(`[data-value="${value}"] input[type="checkbox"]`);

	const renderCards = (listProps: Record<string, unknown> = {}, itemProps: Record<string, unknown> = {}) => {
		const onAction = vi.fn();
		const state = { selected: [] as string[] };
		const onSelectionChange = vi.fn((_: Event, items: string[]) => {
			state.selected = items;
		});
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'multiselect', navigationMode: 'composite', onSelectionChange, ...listProps },
			itemProps: { checkmark: {}, onAction, ...itemProps },
			items: [{ value: 'a' }, { value: 'b' }]
		});
		return { onAction, onSelectionChange, state };
	};

	it('does not trigger onAction when the checkbox is clicked', async () => {
		const { onAction } = renderCards();
		await checkbox('a').click();
		expect(onAction).not.toHaveBeenCalled();
	});

	it('still triggers onAction when the row itself is clicked', async () => {
		const { onAction, onSelectionChange } = renderCards();
		await page.selector('[data-value="a"]').click();
		expect(onAction).toHaveBeenCalledOnce();
		expect(onSelectionChange).not.toHaveBeenCalled();
	});

	it('toggles the selection of the row from its checkbox', async () => {
		const { state } = renderCards();
		await checkbox('a').click();
		await expect.element(checkbox('a')).toBeChecked();
		expect(state.selected).toEqual(['a']);

		await checkbox('b').click();
		await expect.element(checkbox('b')).toBeChecked();
		expect(state.selected).toEqual(['a', 'b']);

		await checkbox('a').click();
		await expect.element(checkbox('a')).not.toBeChecked();
		expect(state.selected).toEqual(['b']);
	});

	it('reflects the items that start selected', async () => {
		renderCards({ selectedItems: ['b'] });
		await expect.element(checkbox('a')).not.toBeChecked();
		await expect.element(checkbox('b')).toBeChecked();
	});

	it('keeps a single selection when the list is selectionMode="single"', async () => {
		const { state } = renderCards({ selectionMode: 'single' });
		await checkbox('a').click();
		await checkbox('b').click();
		expect(state.selected).toEqual(['b']);
		await expect.element(checkbox('a')).not.toBeChecked();
		await expect.element(checkbox('b')).toBeChecked();
	});

	it('does not change the selection when selectionMode="none"', async () => {
		const { onAction, onSelectionChange } = renderCards({ selectionMode: 'none' }, { role: 'row' });
		await checkbox('a').click();
		expect(onSelectionChange).not.toHaveBeenCalled();
		expect(onAction).not.toHaveBeenCalled();
	});

	it('toggles without triggering onAction on selectable (non-row) items', async () => {
		const { onAction, state } = renderCards({ navigationMode: 'items' });
		await checkbox('a').click();
		await checkbox('b').click();
		expect(onAction).not.toHaveBeenCalled();
		expect(state.selected).toEqual(['a', 'b']);
		await checkbox('a').click();
		expect(state.selected).toEqual(['b']);
	});

	it('positions the checkbox with checkmark.wrapperAttributes.style', async () => {
		const style = 'position: absolute; top: 10px; left: 10px; z-index: 10;';
		const { onAction, state } = renderCards({}, { checkmark: { wrapperAttributes: { style } } });
		const wrapper = page.selector('[data-value="a"] .fs-checkbox');
		await expect.element(wrapper).toHaveStyle({ position: 'absolute', top: '10px', left: '10px' });

		await checkbox('a').click();
		expect(onAction).not.toHaveBeenCalled();
		expect(state.selected).toEqual(['a']);
	});

	it('disables the checkbox when the item is disabled', async () => {
		render(ListViewTestWrapper, {
			listProps: { selectionMode: 'multiselect' },
			itemProps: { checkmark: {} },
			items: [{ value: 'off', disabled: true }]
		});
		await expect.element(checkbox('off')).toBeDisabled();
	});
});
