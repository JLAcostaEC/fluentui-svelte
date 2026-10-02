import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { TreeViewItem, TreeViewItemContent } from '$lib/index.js';
import TreeViewTestWrapper from './TreeViewTestWrapper.svelte';
import TreeViewLayoutTestWrapper from './TreeViewLayoutTestWrapper.svelte';

describe('TreeView', () => {
	it('renders a ul with role="tree"', async () => {
		render(TreeViewTestWrapper);
		const el = page.selector('ul.fs-tree-view[role="tree"]');
		await expect.element(el).toBeInTheDocument();
	});

	it('is multiselectable by default', async () => {
		render(TreeViewTestWrapper);
		const el = page.selector('ul[role="tree"]');
		await expect.element(el).toHaveAttribute('aria-multiselectable', 'true');
	});

	it('is not multiselectable in single selection mode', async () => {
		render(TreeViewTestWrapper, { selectionMode: 'single' });
		const el = page.selector('ul[role="tree"]');
		await expect.element(el).toHaveAttribute('aria-multiselectable', 'false');
	});

	it('renders a nested group', async () => {
		render(TreeViewTestWrapper);
		const el = page.selector('ul.fs-tree-view[role="group"]');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('TreeViewItem', () => {
	it('renders items with role="treeitem"', async () => {
		render(TreeViewTestWrapper);
		const el = page.getByRole('treeitem', { name: 'Fruits' });
		await expect.element(el).toBeInTheDocument();
	});

	it('assigns aria-level 1 to root items', async () => {
		render(TreeViewTestWrapper);
		const el = page.getByRole('treeitem', { name: 'Vegetables' });
		await expect.element(el).toHaveAttribute('aria-level', '1');
	});

	it('assigns aria-level 2 to nested items', async () => {
		render(TreeViewTestWrapper, { branchOpen: true });
		const el = page.getByRole('treeitem', { name: 'Apple' });
		await expect.element(el).toHaveAttribute('aria-level', '2');
	});

	it('does not mark a closed branch as expanded', async () => {
		render(TreeViewTestWrapper);
		const el = page.getByRole('treeitem', { name: 'Fruits' });
		await expect.element(el).not.toHaveAttribute('aria-expanded', 'true');
	});

	it('reflects an open branch in aria-expanded', async () => {
		render(TreeViewTestWrapper, { branchOpen: true });
		const el = page.getByRole('treeitem', { name: 'Fruits' });
		await expect.element(el).toHaveAttribute('aria-expanded', 'true');
	});

	it('marks a disabled item with aria-disabled', async () => {
		render(TreeViewTestWrapper, { branchOpen: true });
		const el = page.getByRole('treeitem', { name: 'Banana' });
		await expect.element(el).toHaveAttribute('aria-disabled', 'true');
	});

	it('reflects the checked prop in aria-checked', async () => {
		render(TreeViewTestWrapper, { branchOpen: true, appleChecked: true });
		const el = page.getByRole('treeitem', { name: 'Apple' });
		await expect.element(el).toHaveAttribute('aria-checked', 'true');
	});

	it('reflects the indeterminate prop as aria-checked="mixed"', async () => {
		render(TreeViewTestWrapper, { branchOpen: true, appleIndeterminate: true });
		const el = page.getByRole('treeitem', { name: 'Apple' });
		await expect.element(el).toHaveAttribute('aria-checked', 'mixed');
	});

	it('throws when used outside a TreeView', async () => {
		await expect(render(TreeViewItem)).rejects.toThrow('TreeViewItem must be used within a TreeView');
	});
});

describe('TreeViewItemContent', () => {
	it('renders the label text', async () => {
		render(TreeViewTestWrapper);
		const el = page.getByText('Vegetables');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies the medium size class by default', async () => {
		render(TreeViewTestWrapper);
		const el = page.selector('.fs-tree-view-item-content.size-medium');
		await expect.element(el.first()).toBeInTheDocument();
	});

	it('applies the small size class', async () => {
		render(TreeViewTestWrapper, { size: 'small' });
		const el = page.selector('.fs-tree-view-item-content.size-small');
		await expect.element(el.first()).toBeInTheDocument();
	});

	it('throws when used outside a TreeView', async () => {
		await expect(render(TreeViewItemContent)).rejects.toThrow('TreeViewItemLayout must be used within a TreeView');
	});
});

describe('interaction', () => {
	it('checks a leaf item on click', async () => {
		render(TreeViewTestWrapper);
		const item = page.getByRole('treeitem', { name: 'Vegetables' });
		await expect.element(item).not.toHaveAttribute('aria-checked', 'true');
		await page.getByText('Vegetables').click();
		await expect.element(item).toHaveAttribute('aria-checked', 'true');
	});

	it('does not check a disabled item on click', async () => {
		render(TreeViewTestWrapper, { branchOpen: true });
		const item = page.getByRole('treeitem', { name: 'Banana' });
		await page.getByText('Banana').click({ force: true });
		await expect.element(item).not.toHaveAttribute('aria-checked', 'true');
	});
});

describe('checkbox', () => {
	const checkbox = (id: string) => page.selector(`li[data-value="${id}"] > .fs-tree-view-item-content .fs-checkbox`);

	it('checks the item with a single click', async () => {
		render(TreeViewTestWrapper);
		const item = page.getByRole('treeitem', { name: 'Vegetables' });
		await checkbox('vegetables').click();
		await expect.element(item).toHaveAttribute('aria-checked', 'true');
	});

	it('unchecks the item with a second click', async () => {
		render(TreeViewTestWrapper);
		const item = page.getByRole('treeitem', { name: 'Vegetables' });
		await checkbox('vegetables').click();
		await checkbox('vegetables').click();
		await expect.element(item).not.toHaveAttribute('aria-checked', 'true');
	});

	it('checks the enabled children of a branch and leaves it mixed while one is disabled', async () => {
		render(TreeViewTestWrapper, { branchOpen: true });
		await checkbox('fruits').click();
		await expect.element(page.getByRole('treeitem', { name: 'Apple' })).toHaveAttribute('aria-checked', 'true');
		await expect.element(page.getByRole('treeitem', { name: 'Banana' })).not.toHaveAttribute('aria-checked', 'true');
		await expect.element(page.getByRole('treeitem', { name: 'Fruits' })).toHaveAttribute('aria-checked', 'mixed');
	});

	it('marks the branch as mixed when only some children are checked', async () => {
		render(TreeViewTestWrapper, { branchOpen: true });
		await checkbox('apple').click();
		await expect.element(page.getByRole('treeitem', { name: 'Fruits' })).toHaveAttribute('aria-checked', 'mixed');
	});

	it('does not toggle the branch open when its checkbox is clicked', async () => {
		render(TreeViewTestWrapper);
		await checkbox('fruits').click();
		await expect.element(page.getByRole('treeitem', { name: 'Fruits' })).not.toHaveAttribute('aria-expanded', 'true');
	});

	it('does not check a disabled item from its checkbox', async () => {
		render(TreeViewTestWrapper, { branchOpen: true });
		await checkbox('banana').click({ force: true });
		await expect.element(page.getByRole('treeitem', { name: 'Banana' })).not.toHaveAttribute('aria-checked', 'true');
	});

	it('keeps a single checked item in single selection mode', async () => {
		render(TreeViewTestWrapper, { selectionMode: 'single', branchOpen: true });
		await checkbox('apple').click();
		await checkbox('vegetables').click();
		await expect.element(page.getByRole('treeitem', { name: 'Vegetables' })).toHaveAttribute('aria-checked', 'true');
		await expect.element(page.getByRole('treeitem', { name: 'Apple' })).not.toHaveAttribute('aria-checked', 'true');
	});
});

describe('events', () => {
	it('calls onCheckedChange with the checked ids', async () => {
		const onCheckedChange = vi.fn();
		render(TreeViewTestWrapper, { onCheckedChange });
		await page.selector('li[data-value="vegetables"] .fs-checkbox').click();
		expect(onCheckedChange).toHaveBeenCalledOnce();
		expect(onCheckedChange.mock.calls[0][1]).toEqual(['vegetables']);
	});

	it('calls onCheckedChange when an item is checked from its row', async () => {
		const onCheckedChange = vi.fn();
		render(TreeViewTestWrapper, { onCheckedChange });
		await page.getByText('Vegetables').click();
		expect(onCheckedChange).toHaveBeenCalledOnce();
		expect(onCheckedChange.mock.calls[0][1]).toEqual(['vegetables']);
	});

	it('calls onOpenChange with the open ids', async () => {
		const onOpenChange = vi.fn();
		render(TreeViewTestWrapper, { onOpenChange });
		await page.getByText('Fruits').click();
		expect(onOpenChange.mock.calls.at(-1)?.[1]).toEqual(['fruits']);
		await page.getByText('Fruits').click();
		expect(onOpenChange.mock.calls.at(-1)?.[1]).toEqual([]);
		expect(onOpenChange).toHaveBeenCalledTimes(2);
	});

	it('calls the onOpenChange of the branch', async () => {
		const onFruitsOpenChange = vi.fn();
		render(TreeViewTestWrapper, { onFruitsOpenChange });
		await page.getByText('Fruits').click();
		expect(onFruitsOpenChange).toHaveBeenCalledOnce();
		expect(onFruitsOpenChange.mock.calls[0][1]).toEqual({ id: 'fruits', open: true });
	});

	it('calls the onCheckedChange of an item when it is checked', async () => {
		const onAppleCheckedChange = vi.fn();
		render(TreeViewTestWrapper, { onAppleCheckedChange, branchOpen: true });
		await page.getByText('Apple').click();
		expect(onAppleCheckedChange).toHaveBeenCalledOnce();
		expect(onAppleCheckedChange.mock.calls[0][1]).toEqual({ id: 'apple', checked: true });
	});

	it('calls the onCheckedChange of the children a branch cascades to', async () => {
		const onAppleCheckedChange = vi.fn();
		render(TreeViewTestWrapper, { onAppleCheckedChange, branchOpen: true });
		await page.selector('li[data-value="fruits"] > .fs-tree-view-item-content .fs-checkbox').click();
		expect(onAppleCheckedChange).toHaveBeenCalledOnce();
		expect(onAppleCheckedChange.mock.calls[0][1]).toEqual({ id: 'apple', checked: true });
	});
});

describe('layout', () => {
	const row = (id: string) => page.selector(`li[data-value="${id}"] > .fs-tree-view-item-content`);
	const rect = (id: string, selector: string) =>
		page.selector(`li[data-value="${id}"] > .fs-tree-view-item-content ${selector}`).element().getBoundingClientRect();

	it('aligns the checkbox and the icon of a branch with the ones of a leaf at the same level', async () => {
		render(TreeViewLayoutTestWrapper);
		await expect.element(row('vegetables')).toBeInTheDocument();
		expect(rect('fruits', '.fs-checkbox').left).toBe(rect('vegetables', '.fs-checkbox').left);
		expect(rect('fruits', '.fs-tree-view-item-icon-before').left).toBe(
			rect('vegetables', '.fs-tree-view-item-icon-before').left
		);
	});

	it('gives the rows of a branch and of a leaf the same height', async () => {
		render(TreeViewLayoutTestWrapper);
		await expect.element(row('vegetables')).toBeInTheDocument();
		expect(row('fruits').element().getBoundingClientRect().height).toBe(
			row('vegetables').element().getBoundingClientRect().height
		);
	});

	it('reveals the actions on hover only', async () => {
		render(TreeViewLayoutTestWrapper);
		const actions = page.selector(
			'li[data-value="vegetables"] > .fs-tree-view-item-content .fs-tree-view-item-actions'
		);
		await expect.element(actions).toHaveStyle({ opacity: '0' });
		await row('vegetables').hover();
		await expect.element(actions).toHaveStyle({ opacity: '1' });
	});

	it('only turns the chevron of the branches that are open', async () => {
		render(TreeViewLayoutTestWrapper);
		await expect.element(row('citrus')).toBeInTheDocument();
		const chevron = (id: string) =>
			page.selector(`li[data-value="${id}"] > .fs-tree-view-item-content .branch-indicator`).element();
		expect(getComputedStyle(chevron('fruits')).rotate).toBe('90deg');
		expect(getComputedStyle(chevron('citrus')).rotate).toBe('none');
	});
});
