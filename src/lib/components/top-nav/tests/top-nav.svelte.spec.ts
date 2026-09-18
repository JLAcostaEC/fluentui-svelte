import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { TopNavItem } from '$lib/index.js';
import TopNavTestWrapper from './TopNavTestWrapper.svelte';

describe('TopNav', () => {
	it('renders a named tablist with one item per child', async () => {
		render(TopNavTestWrapper);
		await expect.element(page.getByRole('tablist', { name: 'Flights' })).toBeInTheDocument();
		expect(page.getByRole('tab').elements()).toHaveLength(3);
	});

	it('marks only the selected item as selected', async () => {
		render(TopNavTestWrapper, { selectedValue: 'tab2' });
		await expect.element(page.getByRole('tab', { name: 'Second Tab' })).toHaveAttribute('aria-selected', 'true');
		await expect.element(page.getByRole('tab', { name: 'First Tab' })).toHaveAttribute('aria-selected', 'false');
	});

	it('selects an item on click and reports the change', async () => {
		const onTabSelect = vi.fn();
		render(TopNavTestWrapper, { onTabSelect });
		await page.getByRole('tab', { name: 'Second Tab' }).click();
		await expect.element(page.getByRole('tab', { name: 'Second Tab' })).toHaveAttribute('aria-selected', 'true');
		expect(onTabSelect).toHaveBeenCalledWith(expect.anything(), 'tab2');
	});

	it('stays quiet when the item that is already selected is clicked again', async () => {
		const onTabSelect = vi.fn();
		render(TopNavTestWrapper, { onTabSelect });
		await page.getByRole('tab', { name: 'First Tab' }).click();
		expect(onTabSelect).not.toHaveBeenCalled();
	});

	it('carries the appearance and the size as classes', async () => {
		render(TopNavTestWrapper, { appearance: 'filled-circular', size: 'large' });
		const list = page.getByRole('tablist');
		await expect.element(list).toHaveClass('filled-circular');
		await expect.element(list).toHaveClass('large');
		await expect.element(page.getByRole('tab').first()).toHaveClass('filled-circular');
	});

	it('renders the icon of an item', async () => {
		render(TopNavTestWrapper, { withIcon: true });
		await expect.element(page.selector('.fs-top-nav-item-icon svg').first()).toBeInTheDocument();
	});

	it('fails loudly when an item is rendered outside a TopNav', async () => {
		await expect(render(TopNavItem)).rejects.toThrow('No TopNavContext found');
	});
});

describe('a polymorphic TopNavItem', () => {
	it('renders a button by default', async () => {
		render(TopNavTestWrapper);
		await expect.element(page.selector('button.fs-top-nav-item').first()).toBeInTheDocument();
	});

	it('renders an anchor, with the attributes of one, when asked', async () => {
		render(TopNavTestWrapper, {
			items: [
				{ value: 'tab1', label: 'First Tab' },
				{ value: 'tab2', label: 'Second Tab', props: { as: 'a', href: '/second' } }
			]
		});

		const anchor = page.selector('a.fs-top-nav-item');
		await expect.element(anchor).toHaveAttribute('href', '/second');
		await expect.element(anchor).toHaveAttribute('role', 'tab');
		// The type attribute belongs to a button and would read as a media hint on an anchor.
		await expect.element(anchor).not.toHaveAttribute('type');
	});

	it('throws for a tag that is neither', async () => {
		await expect(
			render(TopNavTestWrapper, {
				// @ts-expect-error incorrect tag type
				items: [{ value: 'tab1', label: 'First Tab', props: { as: 'span' } }]
			})
		).rejects.toThrow('Invalid tag: span');
	});

	it('reports its selection from an anchor as well', async () => {
		const onTabSelect = vi.fn();
		render(TopNavTestWrapper, {
			onTabSelect,
			items: [
				{ value: 'tab1', label: 'First Tab' },
				{ value: 'tab2', label: 'Second Tab', props: { as: 'a', href: '#second' } }
			]
		});

		await page.getByRole('tab', { name: 'Second Tab' }).click();
		expect(onTabSelect).toHaveBeenCalledWith(expect.anything(), 'tab2');
		await expect.element(page.getByRole('tab', { name: 'Second Tab' })).toHaveAttribute('aria-selected', 'true');
	});

	it('says an anchor is disabled to ARIA, since it has no attribute of its own', async () => {
		const onTabSelect = vi.fn();
		render(TopNavTestWrapper, {
			onTabSelect,
			items: [
				{ value: 'tab1', label: 'First Tab' },
				{ value: 'tab2', label: 'Second Tab', props: { as: 'a', href: '#blocked', disabled: true } }
			]
		});

		const anchor = page.getByRole('tab', { name: 'Second Tab' });
		await expect.element(anchor).toHaveAttribute('aria-disabled', 'true');

		// A pointer never reaches a disabled item, so the click is dispatched straight at it: it is
		// answered and cancelled, so neither the selection nor the navigation happens.
		(anchor.element() as HTMLElement).click();
		expect(onTabSelect).not.toHaveBeenCalled();
		expect(window.location.hash).not.toBe('#blocked');
	});
});

describe('TopNav indicator', () => {
	it('places a single bar, and keeps the same one as the selection moves', async () => {
		render(TopNavTestWrapper);
		const bar = page.selector('.fs-top-nav-indicator');
		await expect.element(bar).toBeInTheDocument();

		const first = bar.element();
		const before = first.getBoundingClientRect().left;

		await page.getByRole('tab', { name: 'Third Tab' }).click();
		// The same node is still there: it travels rather than being replaced.
		expect(page.selector('.fs-top-nav-indicator').element()).toBe(first);
		await expect.poll(() => first.getBoundingClientRect().left).not.toBe(before);
	});

	it('spans the content of the selected item, padding aside', async () => {
		render(TopNavTestWrapper, { selectedValue: 'tab2' });
		const item = page.getByRole('tab', { name: 'Second Tab' }).element();
		const style = getComputedStyle(item);
		const content = item.getBoundingClientRect().width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

		await expect
			.poll(() => Math.round(page.selector('.fs-top-nav-indicator').element().getBoundingClientRect().width))
			.toBe(Math.round(content));
	});

	it('steps aside for the pill of a circular appearance', async () => {
		render(TopNavTestWrapper, { appearance: 'subtle-circular' });
		expect(page.selector('.fs-top-nav-indicator').elements()).toHaveLength(0);
	});
});

describe('TopNav keyboard', () => {
	it('walks the items with the arrows, and Home and End jump to the ends', async () => {
		render(TopNavTestWrapper);
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
		render(TopNavTestWrapper);
		const tabs = page.getByRole('tab');
		await tabs.first().click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(tabs.nth(1)).toHaveFocus();
		await expect.element(tabs.first()).toHaveAttribute('aria-selected', 'true');
	});

	it('takes the selection along when selectTabOnFocus is set', async () => {
		render(TopNavTestWrapper, { selectTabOnFocus: true });
		const tabs = page.getByRole('tab');
		await tabs.first().click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
	});

	it('walks a vertical strip with the up and down arrows', async () => {
		render(TopNavTestWrapper, { vertical: true });
		await expect.element(page.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');

		const tabs = page.getByRole('tab');
		await tabs.first().click();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(tabs.nth(1)).toHaveFocus();
	});
});

describe('a disabled TopNav', () => {
	it('disables every item when the strip is disabled', async () => {
		render(TopNavTestWrapper, { disabled: true });
		const tabs = page.getByRole('tab');
		await expect.element(tabs.first()).toBeDisabled();
		await expect.element(tabs.nth(2)).toBeDisabled();
	});

	it('disables a single item on its own', async () => {
		render(TopNavTestWrapper, {
			items: [
				{ value: 'tab1', label: 'First Tab' },
				{ value: 'tab2', label: 'Second Tab', props: { disabled: true } }
			]
		});
		await expect.element(page.getByRole('tab', { name: 'First Tab' })).not.toBeDisabled();
		await expect.element(page.getByRole('tab', { name: 'Second Tab' })).toBeDisabled();
	});

	it('is passed over by the arrows rather than landed on', async () => {
		render(TopNavTestWrapper, {
			items: [
				{ value: 'tab1', label: 'First Tab' },
				{ value: 'tab2', label: 'Second Tab', props: { disabled: true } },
				{ value: 'tab3', label: 'Third Tab' }
			]
		});

		const tabs = page.getByRole('tab');
		await tabs.first().click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(tabs.nth(2)).toHaveFocus();
	});
});

describe('reserveSelectedTabSpace', () => {
	it('holds the width of the selected label from the start', async () => {
		render(TopNavTestWrapper);
		const reserve = page.selector('.fs-top-nav-item-reserve');
		expect(reserve.elements()).toHaveLength(3);
		await expect.element(reserve.first()).toHaveAttribute('aria-hidden', 'true');

		// The item is already as wide as its selected state, so selecting it moves nothing.
		const secondTab = page.getByRole('tab', { name: 'Second Tab' });
		const second = secondTab.element();
		const before = second.getBoundingClientRect().width;
		await secondTab.click();
		await expect.poll(() => second.getBoundingClientRect().width).toBe(before);
	});

	it('leaves the labels to size themselves when it is off', async () => {
		render(TopNavTestWrapper, { reserveSelectedTabSpace: false });
		expect(page.selector('.fs-top-nav-item-reserve').elements()).toHaveLength(0);
	});
});
