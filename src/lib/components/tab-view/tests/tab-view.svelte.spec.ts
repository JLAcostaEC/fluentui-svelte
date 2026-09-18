import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { TabViewTab } from '$lib/index.js';
import TabViewTestWrapper from './TabViewTestWrapper.svelte';

describe('TabView', () => {
	it('renders a named tablist with one tab per child', async () => {
		render(TabViewTestWrapper);
		const list = page.getByRole('tablist', { name: 'Workspaces' });
		await expect.element(list).toBeInTheDocument();
		expect(page.getByRole('tab').elements()).toHaveLength(3);
	});

	it('marks only the active tab as selected', async () => {
		render(TabViewTestWrapper, { activeTab: 'mail' });
		await expect.element(page.getByRole('tab', { name: 'Mail' })).toHaveAttribute('aria-selected', 'true');
		await expect.element(page.getByRole('tab', { name: 'Document' })).toHaveAttribute('aria-selected', 'false');
	});

	it('selects a tab on click and reports the change', async () => {
		const onTabChange = vi.fn();
		render(TabViewTestWrapper, { onTabChange });
		await page.getByRole('tab', { name: 'Mail' }).click();
		await expect.element(page.getByRole('tab', { name: 'Mail' })).toHaveAttribute('aria-selected', 'true');
		expect(onTabChange).toHaveBeenCalledWith(expect.anything(), 'mail');
	});

	it('stays quiet when the tab that is already selected is clicked again', async () => {
		const onTabChange = vi.fn();
		render(TabViewTestWrapper, { onTabChange });
		await page.getByRole('tab', { name: 'Document' }).click();
		expect(onTabChange).not.toHaveBeenCalled();
	});

	it('carries the width mode as a class on every tab', async () => {
		render(TabViewTestWrapper, { tabWidthMode: 'compact' });
		await expect.element(page.getByRole('tab').first()).toHaveClass('compact');
	});

	it('renders the icon of a tab', async () => {
		render(TabViewTestWrapper, { withIcon: true });
		await expect.element(page.selector('.fs-tab-view-tab-icon svg').first()).toBeInTheDocument();
	});

	it('fails loudly when a tab is rendered outside a TabView', async () => {
		await expect(render(TabViewTab)).rejects.toThrow('No TabViewContext found');
	});
});

describe('TabView closing', () => {
	it('shows no close button until the strip asks for one', async () => {
		render(TabViewTestWrapper);
		expect(page.getByRole('button', { name: 'Close tab' }).elements()).toHaveLength(0);
	});

	it('gives every tab a close button when the strip is closable', async () => {
		render(TabViewTestWrapper, { closable: true });
		expect(page.getByRole('button', { name: 'Close tab' }).elements()).toHaveLength(3);
	});

	it('lets a single tab opt out of the close button', async () => {
		render(TabViewTestWrapper, {
			closable: true,
			activeTab: 'a',
			tabs: [
				{ value: 'a', label: 'A' },
				{ value: 'b', label: 'B', props: { closable: false } }
			]
		});
		expect(page.getByRole('button', { name: 'Close tab' }).elements()).toHaveLength(1);
	});

	it('reports the close without selecting the tab underneath', async () => {
		const onTabClose = vi.fn();
		render(TabViewTestWrapper, { closable: true, onTabClose });
		await page.getByRole('button', { name: 'Close tab' }).nth(1).click();
		expect(onTabClose).toHaveBeenCalledWith(expect.anything(), 'mail');
		await expect.element(page.getByRole('tab', { name: 'Document' })).toHaveAttribute('aria-selected', 'true');
	});

	it('hands the close to the handler of the tab as well', async () => {
		const onClose = vi.fn();
		render(TabViewTestWrapper, {
			closable: true,
			activeTab: 'a',
			tabs: [{ value: 'a', label: 'A', props: { onClose } }]
		});
		await page.getByRole('button', { name: 'Close tab' }).click();
		expect(onClose).toHaveBeenCalledWith(expect.anything(), 'a');
	});
});

describe('TabView new tab button', () => {
	it('is hidden until the strip asks for it', async () => {
		render(TabViewTestWrapper);
		expect(page.getByRole('button', { name: 'Add new tab' }).elements()).toHaveLength(0);
	});

	it('sits outside the tablist, so it never reads as a tab', async () => {
		render(TabViewTestWrapper, { showNewTabButton: true });
		await expect.element(page.getByRole('button', { name: 'Add new tab' })).toBeInTheDocument();
		expect(page.getByRole('tab').elements()).toHaveLength(3);
	});

	it('reports the request for a new tab', async () => {
		const onNewTab = vi.fn();
		render(TabViewTestWrapper, { showNewTabButton: true, onNewTab });
		await page.getByRole('button', { name: 'Add new tab' }).click();
		expect(onNewTab).toHaveBeenCalledOnce();
	});
});

describe('TabView keyboard', () => {
	it('walks the tabs with the arrows, and Home and End jump to the ends', async () => {
		render(TabViewTestWrapper);
		await expect.element(page.getByRole('tablist')).toHaveAttribute('data-tabspot');

		const tabs = page.getByRole('tab');
		await tabs.first().click();
		await expect.element(tabs.first()).toHaveFocus();

		await userEvent.keyboard('{ArrowRight}');
		await expect.element(tabs.nth(1)).toHaveFocus();

		await userEvent.keyboard('{End}');
		await expect.element(tabs.nth(2)).toHaveFocus();

		await userEvent.keyboard('{Home}');
		await expect.element(tabs.first()).toHaveFocus();
	});

	it('moves the focus without moving the selection', async () => {
		render(TabViewTestWrapper);
		const tabs = page.getByRole('tab');
		await tabs.first().click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(tabs.nth(1)).toHaveFocus();
		await expect.element(tabs.first()).toHaveAttribute('aria-selected', 'true');
	});

	it('selects the focused tab with Enter and with Space', async () => {
		render(TabViewTestWrapper);
		const tabs = page.getByRole('tab');
		await tabs.first().click();

		await userEvent.keyboard('{ArrowRight}');
		await userEvent.keyboard('{Enter}');
		await expect.element(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

		await userEvent.keyboard('{ArrowRight}');
		await userEvent.keyboard(' ');
		await expect.element(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
	});

	it('closes the focused tab with Delete', async () => {
		const onTabClose = vi.fn();
		render(TabViewTestWrapper, { closable: true, onTabClose });
		await page.getByRole('tab').first().click();
		await userEvent.keyboard('{Delete}');
		expect(onTabClose).toHaveBeenCalledWith(expect.anything(), 'document');
	});

	it('leaves Delete alone on a tab that does not close', async () => {
		const onTabClose = vi.fn();
		render(TabViewTestWrapper, { onTabClose });
		await page.getByRole('tab').first().click();
		await userEvent.keyboard('{Delete}');
		expect(onTabClose).not.toHaveBeenCalled();
	});
});

describe('a disabled tab', () => {
	it('reports itself as disabled and answers no click', async () => {
		const onTabChange = vi.fn();
		render(TabViewTestWrapper, {
			onTabChange,
			activeTab: 'a',
			tabs: [
				{ value: 'a', label: 'A' },
				{ value: 'b', label: 'B', props: { disabled: true } }
			]
		});

		const tab = page.getByRole('tab', { name: 'B' });
		await expect.element(tab).toHaveAttribute('aria-disabled', 'true');
		// A pointer never reaches a disabled tab, so the click is dispatched straight at it.
		(tab.element() as HTMLElement).click();
		expect(onTabChange).not.toHaveBeenCalled();
	});

	it('is passed over by the arrows rather than landed on', async () => {
		render(TabViewTestWrapper, {
			activeTab: 'a',
			tabs: [
				{ value: 'a', label: 'A' },
				{ value: 'b', label: 'B', props: { disabled: true } },
				{ value: 'c', label: 'C' }
			]
		});

		const tabs = page.getByRole('tab');
		await tabs.first().click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(tabs.nth(2)).toHaveFocus();
	});
});
