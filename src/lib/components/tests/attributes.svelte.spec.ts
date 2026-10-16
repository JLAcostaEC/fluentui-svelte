import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Avatar, Expander, Hyperlink, ProgressBar } from '$lib/index.js';
import BreadcrumbTestWrapper from '../breadcrumb/tests/BreadcrumbTestWrapper.svelte';
import ListViewTestWrapper from '../list-view/tests/ListViewTestWrapper.svelte';

describe('consumer attributes and internal state', () => {
	it('preserves Avatar semantics and combines consumer classes', async () => {
		await render(Avatar, {
			name: 'Ada Lovelace',
			role: 'button',
			'aria-label': 'Override',
			class: 'custom-avatar',
			'data-testid': 'avatar'
		});
		const avatar = page.getByRole('img', { name: 'Ada Lovelace' });
		await expect.element(avatar).toHaveClass('fs-avatar', 'custom-avatar');
		await expect.element(avatar).toHaveAttribute('data-testid', 'avatar');
	});

	it('keeps Breadcrumb arrow navigation and current-page state when nested attributes conflict', async () => {
		await render(BreadcrumbTestWrapper, {
			focusMode: 'arrow',
			listAttributes: { 'data-tabspot': '{}', class: 'custom-trail' },
			buttonProps: { 'aria-current': 'false', type: 'submit' }
		});
		await userEvent.tab();
		await expect.element(page.getByRole('link', { name: 'Home' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');
		const current = page.getByRole('button', { name: 'This page' });
		await expect.element(current).toHaveFocus();
		await expect.element(current).toHaveAttribute('aria-current', 'page');
		await expect.element(current).toHaveAttribute('type', 'button');
		await expect.element(page.getByRole('list')).toHaveClass('fs-breadcrumb-list', 'custom-trail');
	});

	it('keeps a disabled Hyperlink disabled even with a consumer click handler and tabindex', async () => {
		const onclick = vi.fn();
		await render(Hyperlink, { href: '#destination', disabled: true, onclick, tabindex: 0, 'aria-disabled': false });
		const link = page.getByRole('link');
		await link.click({ force: true });
		await expect.element(link).toHaveAttribute('aria-disabled', 'true');
		await expect.element(link).toHaveAttribute('tabindex', '-1');
		expect(onclick).not.toHaveBeenCalled();
	});

	it('calls the consumer summary handler while Expander still toggles internally', async () => {
		const onclick = vi.fn();
		await render(Expander, { header: 'Details', summaryAttributes: { onclick, class: 'custom-summary' } });
		await page.getByText('Details', { exact: true }).click();
		await expect.element(page.selector('details')).toHaveAttribute('open');
		await expect.element(page.selector('summary')).toHaveClass('fs-summary', 'custom-summary');
		expect(onclick).toHaveBeenCalledOnce();
	});

	it('keeps ListView selection and item identity consistent with its state', async () => {
		await render(ListViewTestWrapper, {
			listProps: { selectionMode: 'single', selectedItems: ['item-1'] },
			itemProps: { 'aria-selected': false, 'data-value': 'override' }
		});
		const option = page.getByRole('option', { name: 'item-1' });
		await expect.element(option).toHaveAttribute('aria-selected', 'true');
		await expect.element(option).toHaveAttribute('data-value', 'item-1');
	});

	it('exposes the actual ProgressBar range and value when consumer ARIA attributes conflict', async () => {
		await render(ProgressBar, {
			value: 25,
			role: 'alert',
			'aria-valuenow': 99,
			'aria-valuemin': 90,
			'aria-valuemax': 900
		});
		const progress = page.getByRole('progressbar');
		await expect.element(progress).toHaveAttribute('aria-valuenow', '25');
		await expect.element(progress).toHaveAttribute('aria-valuemin', '0');
		await expect.element(progress).toHaveAttribute('aria-valuemax', '100');
	});
});
