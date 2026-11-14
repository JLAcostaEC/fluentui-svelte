import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import ItemsViewTestWrapper from './ItemsViewTestWrapper.svelte';

const option = (name: string) => page.getByRole('option', { name });
const selected = () => page.getByTestId('selected');

describe('ItemsView', () => {
	it('is a list without selection and a listbox with it', async () => {
		const { rerender } = await render(ItemsViewTestWrapper);
		await expect.element(page.getByRole('list', { name: 'Items' })).toBeInTheDocument();
		await expect.element(page.getByRole('listitem').first()).not.toHaveAttribute('tabindex');

		await rerender({ viewProps: { selectionMode: 'extended' } });
		const listbox = page.getByRole('listbox', { name: 'Items' });
		await expect.element(listbox).toHaveAttribute('aria-multiselectable', 'true');
	});

	it('applies the layout class and its CSS variables', async () => {
		render(ItemsViewTestWrapper, { viewProps: { layout: 'flow', lineHeight: 120, spacing: '1rem' } });
		const view = page.getByRole('list');
		await expect.element(view).toHaveClass('fs-items-view-flow');
		await expect.element(view).toHaveStyle({ gap: '16px' });
		expect((view.element() as HTMLElement).style.getPropertyValue('--fs-items-view-line-height')).toBe('7.5rem');
	});

	it('replaces the selection in single mode', async () => {
		const onSelectionChange = vi.fn();
		render(ItemsViewTestWrapper, { viewProps: { selectionMode: 'single', onSelectionChange } });
		await option('one').click();
		await option('two').click();
		await expect.element(option('two')).toHaveAttribute('aria-selected', 'true');
		await expect.element(option('one')).toHaveAttribute('aria-selected', 'false');
		expect(onSelectionChange).toHaveBeenLastCalledWith(expect.any(MouseEvent), ['two']);
		expect(document.querySelector('input[type="checkbox"]')).toBeNull();
	});

	it('toggles on click and shows checkboxes kept out of the form in multiselect mode', async () => {
		render(ItemsViewTestWrapper, { viewProps: { selectionMode: 'multiselect', showCheckboxes: true } });
		await option('one').click();
		await option('three').click();
		await option('one').click();
		await expect.element(selected()).toHaveTextContent('three');
		const form = page.getByTestId('form').element() as HTMLFormElement;
		expect(form.querySelectorAll('input[type="checkbox"]')).toHaveLength(3);
		expect([...new FormData(form).keys()]).toHaveLength(0);
	});

	it('selects ranges with Shift and adds with Ctrl in extended mode', async () => {
		render(ItemsViewTestWrapper, {
			viewProps: { selectionMode: 'extended' },
			items: [{ value: 'one' }, { value: 'two', disabled: true }, { value: 'three' }, { value: 'four' }]
		});
		await option('one').click();
		await option('three').click({ modifiers: ['Shift'] });
		await expect.element(selected()).toHaveTextContent('one,three');
		await option('four').click({ modifiers: ['Control'] });
		await expect.element(selected()).toHaveTextContent('one,three,four');
		await option('four').click();
		await expect.element(selected()).not.toHaveTextContent('one');
	});

	it('keeps the selection made before the anchor and toggles the items a Shift range shares with it', async () => {
		render(ItemsViewTestWrapper, {
			viewProps: { selectionMode: 'extended' },
			items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((value) => ({ value }))
		});
		await option('a').click();
		await option('c').click({ modifiers: ['Shift'] });
		await option('h').click({ modifiers: ['Control'] });
		await option('e').click({ modifiers: ['Shift'] });
		await expect.element(selected()).toHaveTextContent('a,b,c,e,f,g,h');
		await option('b').click({ modifiers: ['Shift'] });
		await expect.element(selected()).toHaveTextContent('a,d,e,f,g,h');
	});

	it('ignores disabled items', async () => {
		render(ItemsViewTestWrapper, {
			viewProps: { selectionMode: 'single' },
			items: [{ value: 'one', disabled: true }]
		});
		await option('one').click({ force: true });
		await expect.element(option('one')).toHaveAttribute('aria-selected', 'false');
	});

	it('invokes with a double-click or Enter and selects with Space', async () => {
		const onItemInvoke = vi.fn();
		render(ItemsViewTestWrapper, { viewProps: { selectionMode: 'single', onItemInvoke } });
		await option('one').dblClick();
		expect(onItemInvoke).toHaveBeenLastCalledWith(expect.any(MouseEvent), 'one');

		(option('two').element() as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		expect(onItemInvoke).toHaveBeenLastCalledWith(expect.any(KeyboardEvent), 'two');
		await userEvent.keyboard(' ');
		await expect.element(option('two')).toHaveAttribute('aria-selected', 'true');
	});

	it('invokes on click when nothing is selectable', async () => {
		const onItemInvoke = vi.fn();
		render(ItemsViewTestWrapper, { viewProps: { onItemInvoke } });
		await page.getByRole('listitem').first().click();
		expect(onItemInvoke).toHaveBeenCalledWith(expect.any(MouseEvent), 'one');
	});

	it('keeps a single tab stop that the arrow keys move', async () => {
		render(ItemsViewTestWrapper, { viewProps: { selectionMode: 'single' } });
		await userEvent.tab();
		await expect.element(option('one')).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(option('two')).toHaveFocus();
		await userEvent.keyboard('{End}');
		await expect.element(option('three')).toHaveFocus();
	});

	it('preserves caller tab indices when Tabspot is disabled', async () => {
		render(ItemsViewTestWrapper, {
			viewProps: { selectionMode: 'single', disableTabspot: true },
			items: [
				{ value: 'one', tabindex: -1 },
				{ value: 'two', tabindex: 3 },
				{ value: 'three', disabled: true, tabindex: 0 }
			]
		});
		await expect.element(option('one')).toHaveAttribute('tabindex', '-1');
		await expect.element(option('two')).toHaveAttribute('tabindex', '3');
		await expect.element(option('three')).toHaveAttribute('tabindex', '-1');
	});

	it('gives the first remaining enabled item the tab stop when its owner is removed', async () => {
		const { rerender } = await render(ItemsViewTestWrapper, { viewProps: { selectionMode: 'single' } });
		await expect.element(option('one')).toHaveAttribute('tabindex', '0');
		await rerender({ items: [{ value: 'three' }, { value: 'two', disabled: true }, { value: 'four' }] });
		await expect.element(option('three')).toHaveAttribute('tabindex', '0');
		await expect.element(option('two')).toHaveAttribute('tabindex', '-1');
		await expect.element(option('four')).toHaveAttribute('tabindex', '-1');
		expect(document.querySelectorAll('[role="option"][tabindex="0"]')).toHaveLength(1);
	});

	it('moves between the rows of a grid with the arrow keys', async () => {
		render(ItemsViewTestWrapper, {
			viewProps: { selectionMode: 'single', layout: 'grid', minItemWidth: 150, style: 'width: 400px' },
			items: [{ value: 'one' }, { value: 'two' }, { value: 'three' }, { value: 'four' }]
		});
		await userEvent.tab();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(option('three')).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(option('four')).toHaveFocus();
	});
});
