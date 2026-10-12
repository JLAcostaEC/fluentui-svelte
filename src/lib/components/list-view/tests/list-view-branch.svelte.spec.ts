import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import ListViewItemBranch from '../list-view-item-branch.svelte';
import ListViewBranchTestWrapper from './ListViewBranchTestWrapper.svelte';

const projects = () => page.getByRole('button', { name: 'Projects', exact: true });
const settings = () => page.getByRole('button', { name: 'Settings', exact: true });

describe('ListViewItemBranch', () => {
	it('renders a named native disclosure with a stable controlled region', async () => {
		const screen = await render(ListViewBranchTestWrapper);
		await expect.element(projects()).toHaveAttribute('type', 'button');
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'false');
		const regionId = projects().element().getAttribute('aria-controls')!;
		expect(document.getElementById(regionId)).toHaveAttribute('hidden');
		await expect.element(page.getByRole('status', { name: 'Trigger tag' })).toHaveTextContent('BUTTON');
		await screen.rerender({ expanded: true });
		await expect.element(projects()).toHaveAttribute('aria-controls', regionId);
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toBeVisible();
	});

	it('keeps list items and nested lists semantic', async () => {
		await render(ListViewBranchTestWrapper, { expanded: true });
		expect(projects().element().closest('li')?.parentElement?.tagName).toBe('UL');
		expect(page.getByRole('list', { name: 'Projects links' }).element().closest('li')).toBe(
			projects().element().closest('li')
		);
		await expect.element(projects()).not.toHaveAttribute('aria-selected');
		await expect.element(projects()).not.toHaveAttribute('aria-checked');
	});

	it('renders listitem wrappers when the parent list is a div', async () => {
		await render(ListViewBranchTestWrapper, { listProps: { as: 'div' } });
		expect(projects().element().parentElement?.tagName).toBe('DIV');
		expect(projects().element().parentElement).toHaveAttribute('role', 'listitem');
	});

	it('keeps ordered list wrappers semantic', async () => {
		await render(ListViewBranchTestWrapper, { listProps: { as: 'ol' } });
		expect(projects().element().closest('li')?.parentElement?.tagName).toBe('OL');
	});

	it('toggles once with each click, Enter, and Space activation', async () => {
		const onExpandedChange = vi.fn();
		await render(ListViewBranchTestWrapper, { branchProps: { onExpandedChange } });
		await projects().click();
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'true');
		await userEvent.keyboard('{Enter}');
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'false');
		await userEvent.keyboard(' ');
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'true');
		expect(onExpandedChange.mock.calls.map(([, expanded]) => expanded)).toEqual([true, false, true]);
	});

	it('opens with Right, enters with the next Right, and closes on its focused trigger with Left', async () => {
		await render(ListViewBranchTestWrapper);
		await page.getByRole('button', { name: 'Before list' }).click();
		await userEvent.keyboard('{Tab}{ArrowDown}');
		await expect.element(projects()).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(projects()).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
		await expect.element(projects()).toHaveFocus();
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'false');
	});

	it('collapses an open nested trigger before allowing Left to exit its parent level', async () => {
		await render(ListViewBranchTestWrapper, { expanded: true, nestedExpanded: true });
		await settings().click();
		await settings().click();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(settings()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(settings()).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(projects()).toHaveFocus();
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'true');
	});

	it('Escape collapses only the nearest branch and restores its trigger focus', async () => {
		await render(ListViewBranchTestWrapper, { expanded: true, nestedExpanded: true });
		await page.getByRole('link', { name: 'Users' }).click();
		await userEvent.keyboard('{Escape}');
		await expect.element(settings()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(settings()).toHaveFocus();
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'true');
	});

	it('restores trigger focus when controlled expanded changes collapse a focused descendant', async () => {
		const screen = await render(ListViewBranchTestWrapper, { expanded: true });
		await page.getByRole('link', { name: 'Inbox' }).click();
		await screen.rerender({ expanded: false });
		await expect.element(projects()).toHaveFocus();
		await expect.element(page.selector('a[href="#inbox"]')).not.toBeVisible();
	});

	it('preserves selection while collapsed and never selects a branch', async () => {
		const onSelectionChange = vi.fn();
		await render(ListViewBranchTestWrapper, {
			expanded: true,
			listProps: { role: 'list', selectionMode: 'single' },
			onSelectionChange
		});
		await page.getByRole('button', { name: 'Before leaf' }).click();
		await page.getByRole('link', { name: 'Inbox' }).click();
		await projects().click();
		await projects().click();
		await expect.element(page.getByRole('status', { name: 'Selection', exact: true })).toHaveTextContent('before');
		await expect.element(page.getByRole('status', { name: 'Child selection', exact: true })).toHaveTextContent('inbox');
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toHaveAttribute('aria-current', 'true');
		expect(onSelectionChange).toHaveBeenCalledOnce();
	});

	it('excludes branches from extended range and anchor selection', async () => {
		const onSelectionChange = vi.fn();
		await render(ListViewBranchTestWrapper, {
			listProps: { role: 'list', selectionMode: 'extended' },
			onSelectionChange
		});
		await page.getByRole('button', { name: 'Before leaf' }).click();
		await projects().click();
		await userEvent.keyboard('{Shift>}');
		await page.getByRole('button', { name: 'After leaf' }).click();
		await userEvent.keyboard('{/Shift}');
		expect(onSelectionChange).toHaveBeenLastCalledWith(expect.any(MouseEvent), ['before', 'after']);
		expect(onSelectionChange).toHaveBeenCalledTimes(2);
	});

	it('keeps hidden children out of composite tab, arrow, Home and End navigation', async () => {
		await render(ListViewBranchTestWrapper, {
			includeBeforeLeaf: false,
			branchProps: { disabled: true },
			listProps: { navigationMode: 'composite' }
		});
		await page.getByRole('button', { name: 'Before list' }).click();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('button', { name: 'After leaf' })).toHaveFocus();
		await userEvent.keyboard('{Home}{ArrowUp}{End}');
		await expect.element(page.getByRole('button', { name: 'After leaf' })).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('button', { name: 'After list' })).toHaveFocus();
	});

	it('supports branches mounted after the provider starts', async () => {
		await render(ListViewBranchTestWrapper, { lateBranch: true, listProps: { navigationMode: 'composite' } });
		await page.getByRole('button', { name: 'Before list' }).click();
		await userEvent.keyboard('{Tab}{ArrowDown}{ArrowRight}{ArrowRight}');
		await expect.element(page.getByRole('link', { name: 'Inbox' })).toHaveFocus();
	});

	it('disables expansion and forwards native button attributes and inherited shape', async () => {
		const onExpandedChange = vi.fn();
		await render(ListViewBranchTestWrapper, {
			listProps: { shape: 'circular' },
			branchProps: { disabled: true, id: 'projects-trigger', class: 'custom', title: 'Project links', onExpandedChange }
		});
		await expect.element(projects()).toBeDisabled();
		await expect.element(projects()).toHaveClass('circular', 'custom');
		await expect.element(projects()).toHaveAttribute('id', 'projects-trigger');
		await expect.element(projects()).toHaveAttribute('title', 'Project links');
		await projects().click({ force: true });
		expect(onExpandedChange).not.toHaveBeenCalled();
	});

	it('honors consumer cancellation for disclosure arrows and Escape', async () => {
		const onExpandedChange = vi.fn();
		await render(ListViewBranchTestWrapper, {
			branchProps: {
				onExpandedChange,
				onkeydown: (event) => {
					if (event.key === 'ArrowRight' || event.key === 'Escape') event.preventDefault();
				}
			}
		});
		await page.getByRole('button', { name: 'Before list' }).click();
		await userEvent.keyboard('{Tab}{ArrowDown}{ArrowRight}');
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'false');
		await projects().click();
		onExpandedChange.mockClear();
		await userEvent.keyboard('{Escape}');
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(projects()).toHaveFocus();
		expect(onExpandedChange).not.toHaveBeenCalled();
	});

	it('opts out of arrow management while retaining native disclosure activation', async () => {
		await render(ListViewBranchTestWrapper, { listProps: { disableTabspot: true } });
		await page.getByRole('button', { name: 'Before list' }).click();
		await userEvent.keyboard('{Tab}{Tab}{ArrowRight}');
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'false');
		await userEvent.keyboard('{Enter}{ArrowLeft}');
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'true');
		await userEvent.keyboard('{Escape}');
		await expect.element(projects()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(projects()).toHaveFocus();
		expect(document.querySelector('[data-tabspot]')).toBeNull();
	});

	it('rejects selectable widget roles and usage outside a list', async () => {
		await expect(
			render(ListViewBranchTestWrapper, { includeBeforeLeaf: false, listProps: { selectionMode: 'single' } })
		).rejects.toThrow('ListViewItemBranch requires a native list. Set role="list" on selectable navigation lists.');
		await expect(
			render(ListViewBranchTestWrapper, {
				includeBeforeLeaf: false,
				listProps: { selectionMode: 'single', navigationMode: 'composite' }
			})
		).rejects.toThrow('ListViewItemBranch requires a native list. Set role="list" on selectable navigation lists.');
		for (const role of ['menu', 'tree'] as const) {
			await expect(
				render(ListViewBranchTestWrapper, { includeBeforeLeaf: false, listProps: { role } })
			).rejects.toThrow('ListViewItemBranch requires a native list. Set role="list" on selectable navigation lists.');
		}
		await expect(render(ListViewItemBranch, { label: 'Orphan' })).rejects.toThrow(
			'ListViewItemBranch must be used within a ListView'
		);
	});
});
