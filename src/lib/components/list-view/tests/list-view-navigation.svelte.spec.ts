import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import ListViewNavigationTestWrapper from './ListViewNavigationTestWrapper.svelte';
import ListViewCompositeTestWrapper from './ListViewCompositeTestWrapper.svelte';
import ListViewTestWrapper from './ListViewTestWrapper.svelte';

describe('ListView nested navigation', () => {
	it('renders native links and buttons in a valid list hierarchy', async () => {
		await render(ListViewNavigationTestWrapper);
		await expect.element(page.getByRole('list', { name: 'Navigation', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('list', { name: 'Projects', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('list', { name: 'Settings', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Projects', exact: true })).toHaveAttribute('type', 'button');
		expect(
			Array.from(document.querySelectorAll('.fs-list-view')).every((list) =>
				Array.from(list.children).every((item) => item.tagName === 'LI')
			)
		).toBe(true);
		expect(
			Array.from(document.querySelectorAll('.fs-list-view .fs-list-view')).every(
				(list) => list.parentElement?.tagName === 'LI'
			)
		).toBe(true);
	});

	it('keeps selection independent at every list level', async () => {
		const onParentSelection = vi.fn();
		const onChildSelection = vi.fn();
		const onGrandchildSelection = vi.fn();
		await render(ListViewNavigationTestWrapper, {
			selectionMode: 'single',
			onParentSelection,
			onChildSelection,
			onGrandchildSelection
		});
		await page.getByText('Projects', { exact: true }).click();
		await page.getByRole('link', { name: 'Inbox' }).click();
		await page.getByRole('link', { name: 'Users' }).click();
		await expect.element(page.getByRole('status', { name: 'Parent selection' })).toHaveTextContent('projects');
		await expect.element(page.getByRole('status', { name: 'Child selection', exact: true })).toHaveTextContent('inbox');
		await expect.element(page.getByRole('status', { name: 'Grandchild selection' })).toHaveTextContent('users');
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toHaveAttribute('aria-current', 'true');
		expect(onParentSelection).toHaveBeenCalledOnce();
		expect(onChildSelection).toHaveBeenCalledOnce();
		expect(onGrandchildSelection).toHaveBeenCalledOnce();
	});

	it('does not run parent selection, action, or focus callbacks from nested items', async () => {
		const onParentAction = vi.fn();
		const onParentFocus = vi.fn();
		const onParentSelection = vi.fn();
		await render(ListViewNavigationTestWrapper, {
			selectionMode: 'single',
			onParentAction,
			onParentFocus,
			onParentSelection
		});
		await page.getByRole('link', { name: 'Inbox' }).click();
		expect(onParentAction).not.toHaveBeenCalled();
		expect(onParentFocus).not.toHaveBeenCalled();
		expect(onParentSelection).not.toHaveBeenCalled();
	});

	it('uses arrows to enter and leave sublists while skipping disabled links', async () => {
		await render(ListViewNavigationTestWrapper);
		await page.getByRole('button', { name: 'Before lists' }).click();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('button', { name: 'Projects', exact: true })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(page.getByRole('button', { name: 'Settings', exact: true })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}{ArrowDown}');
		await expect.element(page.getByRole('link', { name: 'Permissions' })).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(page.getByRole('button', { name: 'Settings', exact: true })).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(page.getByRole('button', { name: 'Projects', exact: true })).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(page.getByRole('button', { name: 'Reports' })).toHaveFocus();
		await expect.element(page.getByRole('status', { name: 'Parent selection' })).toHaveTextContent(/^$/);
	});

	it('retains native tab order in items mode', async () => {
		await render(ListViewNavigationTestWrapper);
		await page.getByRole('button', { name: 'Before lists' }).click();
		await userEvent.keyboard('{Tab}{Tab}');
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('button', { name: 'Settings', exact: true })).toHaveFocus();
	});

	it('uses a single tab stop across all levels in composite mode', async () => {
		await render(ListViewNavigationTestWrapper, { navigationMode: 'composite' });
		await page.getByRole('button', { name: 'Before lists' }).click();
		await userEvent.keyboard('{Tab}{ArrowRight}{ArrowDown}{ArrowRight}');
		await expect.element(page.getByRole('link', { name: 'Users' })).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('button', { name: 'After lists' })).toHaveFocus();
		await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
		await expect.element(page.getByRole('link', { name: 'Users' })).toHaveFocus();
	});

	it('registers lists mounted after the provider starts', async () => {
		await render(ListViewNavigationTestWrapper, { lateMount: true, navigationMode: 'composite' });
		await page.getByRole('button', { name: 'Before lists' }).click();
		await userEvent.keyboard('{Tab}{ArrowRight}');
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toHaveFocus();
	});

	it('discovers directly nested lists mounted after their parent item', async () => {
		await render(ListViewNavigationTestWrapper, { lateSublist: true, navigationMode: 'composite' });
		await expect.element(page.getByRole('list', { name: 'Projects', exact: true })).not.toBeInTheDocument();
		await page.getByRole('button', { name: 'Projects', exact: true }).click();
		await expect.element(page.getByRole('list', { name: 'Projects', exact: true })).toBeInTheDocument();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(page.getByRole('button', { name: 'Projects', exact: true })).toHaveFocus();
	});

	it('keeps directly nested lists out of native action elements', async () => {
		await expect(render(ListViewNavigationTestWrapper, { branchAs: 'button' })).rejects.toThrow(
			'Nested ListView must be inside a li or div ListViewItem, outside links and buttons.'
		);
		await expect(render(ListViewNavigationTestWrapper, { branchAs: 'a' })).rejects.toThrow(
			'Nested ListView must be inside a li or div ListViewItem, outside links and buttons.'
		);
	});

	it('does not enter hidden sublists', async () => {
		await render(ListViewNavigationTestWrapper, { hideNested: true, navigationMode: 'composite' });
		await page.getByRole('button', { name: 'Before lists' }).click();
		await userEvent.keyboard('{Tab}{ArrowRight}');
		await expect.element(page.getByRole('button', { name: 'Projects', exact: true })).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(page.getByRole('button', { name: 'Reports' })).toHaveFocus();
	});

	it('activates native buttons with Enter and Space once each', async () => {
		const onParentAction = vi.fn();
		await render(ListViewNavigationTestWrapper, { onParentAction });
		await page.getByRole('button', { name: 'Before lists' }).click();
		await userEvent.keyboard('{Tab}{Enter} ');
		expect(onParentAction).toHaveBeenCalledTimes(2);
	});

	it('leaves nested focus management disabled when disableTabspot is set', async () => {
		await render(ListViewNavigationTestWrapper, { disableTabspot: true, navigationMode: 'composite' });
		await page.getByRole('button', { name: 'Before lists' }).click();
		await userEvent.keyboard('{Tab}{ArrowRight}');
		await expect.element(page.getByRole('button', { name: 'Projects', exact: true })).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toHaveFocus();
		expect(document.querySelector('[data-tabspot]')).toBeNull();
	});
});

describe('ListView composite rows', () => {
	it('renders div grid rows with owned grid cells when the container is a div', async () => {
		await render(ListViewCompositeTestWrapper, { listAs: 'div' });
		expect(page.getByRole('grid', { name: 'Cards' }).element().tagName).toBe('DIV');
		expect(Array.from(document.querySelectorAll('[role="row"]')).every((row) => row.tagName === 'DIV')).toBe(true);
		await expect.element(page.getByRole('gridcell').first()).toBeInTheDocument();
		expect(page.getByRole('gridcell').first().element().parentElement).toHaveAttribute('role', 'row');
	});

	it('exposes grid cells and the row selection', async () => {
		await render(ListViewCompositeTestWrapper);
		await expect.element(page.getByRole('grid', { name: 'Cards' })).toBeInTheDocument();
		await expect.element(page.getByRole('gridcell').first()).toBeInTheDocument();
		await page.getByRole('checkbox', { name: 'Select first' }).click();
		await expect.element(page.getByRole('row').first()).toHaveAttribute('aria-selected', 'true');
	});

	it('enters controls, skips unavailable controls and rows, and returns to rows', async () => {
		await render(ListViewCompositeTestWrapper);
		await page.getByRole('button', { name: 'Before grid' }).click();
		await userEvent.keyboard('{Tab}{ArrowRight}');
		await expect.element(page.getByRole('checkbox', { name: 'Select first' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('button', { name: 'Edit first' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('button', { name: 'Delete first' })).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
		await expect.element(page.getByRole('row').first()).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(page.getByRole('row').last()).toHaveFocus();
	});

	it('does not trigger the primary action or selection from secondary controls', async () => {
		const onAction = vi.fn();
		const onSecondaryAction = vi.fn();
		const onSelectionChange = vi.fn();
		await render(ListViewCompositeTestWrapper, { onAction, onSecondaryAction, onSelectionChange });
		await page.getByRole('button', { name: 'Edit first' }).click();
		expect(onSecondaryAction).toHaveBeenCalledOnce();
		expect(onAction).not.toHaveBeenCalled();
		expect(onSelectionChange).not.toHaveBeenCalled();
	});

	it('opts composite cells out when disableTabspot is set', async () => {
		await render(ListViewCompositeTestWrapper, { disableTabspot: true });
		await page.getByRole('button', { name: 'Before grid' }).click();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('checkbox', { name: 'Select first' })).toHaveFocus();
		expect(document.querySelector('[data-tabspot]')).toBeNull();
	});
});

describe('ListView selectable items', () => {
	it('leaves read-only text out of the tab order', async () => {
		await render(ListViewTestWrapper);
		await expect.element(page.getByRole('listitem')).not.toHaveAttribute('tabindex');
	});

	it('rejects button items that would contain a checkbox', async () => {
		await expect(render(ListViewTestWrapper, { itemProps: { as: 'button', checkmark: {} } })).rejects.toThrow(
			'ListViewItem buttons cannot contain checkmarks or composite row controls. Use li or div.'
		);
	});

	it('activates non-native selectable items with Enter and Space', async () => {
		const onAction = vi.fn();
		const onSelectionChange = vi.fn();
		await render(ListViewTestWrapper, {
			listProps: { selectionMode: 'multiselect', toggleOnClick: true, onSelectionChange },
			itemProps: { onAction },
			items: [{ value: 'first' }]
		});
		await page.getByRole('option', { name: 'first' }).click();
		onAction.mockClear();
		onSelectionChange.mockClear();
		await userEvent.keyboard('{Enter}');
		await expect.element(page.getByRole('option', { name: 'first' })).toHaveAttribute('aria-selected', 'false');
		await userEvent.keyboard(' ');
		await expect.element(page.getByRole('option', { name: 'first' })).toHaveAttribute('aria-selected', 'true');
		expect(onAction).toHaveBeenCalledTimes(2);
		expect(onSelectionChange).toHaveBeenCalledTimes(2);
	});

	it('uses the current disabled state when selecting an extended range', async () => {
		const onSelectionChange = vi.fn();
		const screen = await render(ListViewTestWrapper, {
			listProps: { selectionMode: 'extended', onSelectionChange },
			items: [{ value: 'first' }, { value: 'middle' }, { value: 'last' }]
		});
		await page.getByRole('option', { name: 'first' }).click();
		await screen.rerender({ items: [{ value: 'first' }, { value: 'middle', disabled: true }, { value: 'last' }] });
		await userEvent.keyboard('{Shift>}');
		await page.getByRole('option', { name: 'last' }).click();
		await userEvent.keyboard('{/Shift}');
		await expect.element(page.getByRole('option', { name: 'middle' })).toHaveAttribute('aria-selected', 'false');
		await expect.element(page.getByRole('option', { name: 'last' })).toHaveAttribute('aria-selected', 'true');
		expect(onSelectionChange).toHaveBeenLastCalledWith(expect.any(MouseEvent), ['first', 'last']);
	});
});
