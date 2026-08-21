import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { TreeViewItem, TreeViewItemContent } from '$lib/index.js';
import TreeViewTestWrapper from './TreeViewTestWrapper.svelte';

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
