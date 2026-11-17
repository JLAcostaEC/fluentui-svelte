import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { LiteFilterItem } from '#lib/index.js';
import Wrapper from './LiteFilterTestWrapper.svelte';
import LabelWrapper from './LiteFilterLabelWrapper.svelte';
import '#lib/css/theme.css';

const formData = () => [...new FormData(page.getByTestId('form').element() as HTMLFormElement).getAll('filter')];
const viewport = () => document.querySelector<HTMLElement>('.fs-lite-filter-viewport')!;

describe('LiteFilter', () => {
	it('selects one item at a time, like a radio group', async () => {
		render(Wrapper, { selectedValue: 'all' });
		await expect.element(page.getByRole('radiogroup', { name: 'Filters' })).toBeInTheDocument();
		await expect.element(page.getByRole('radio', { name: 'All' })).toBeChecked();
		await page.getByRole('radio', { name: 'Apps' }).click();
		await expect.element(page.getByTestId('value')).toHaveTextContent('apps');
		await expect.element(page.getByRole('radio', { name: 'All' })).not.toBeChecked();
		expect(formData()).toEqual(['apps']);
	});

	it('keeps the selected item selected on a second click', async () => {
		render(Wrapper, { selectedValue: 'all' });
		await page.getByRole('radio', { name: 'All' }).click();
		await expect.element(page.getByRole('radio', { name: 'All' })).toBeChecked();
		await expect.element(page.getByTestId('changes')).toHaveTextContent('');
	});

	it('selects several items, and none, when multiple', async () => {
		render(Wrapper, { multiple: true, selectedValue: [] });
		await expect.element(page.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
		await page.getByRole('checkbox', { name: 'Apps' }).click();
		await page.getByRole('checkbox', { name: 'People' }).click();
		expect(formData()).toEqual(['apps', 'people']);
		await page.getByRole('checkbox', { name: 'Apps' }).click();
		await expect.element(page.getByTestId('value')).toHaveTextContent('people');
		await expect.element(page.getByTestId('changes')).toHaveTextContent('apps|apps,people|people');
	});

	it('disables single items and the whole filter', async () => {
		render(Wrapper, { disabled: true });
		await expect.element(page.getByRole('radio', { name: 'All' })).toBeDisabled();
		render(Wrapper);
		await expect.element(page.getByRole('radio', { name: 'Web' }).last()).toBeDisabled();
	});

	it('shows the arrows only toward the hidden items', async () => {
		render(Wrapper, { width: '16rem' });
		const back = page.getByRole('button', { name: 'Scroll back' });
		const forward = page.getByRole('button', { name: 'Scroll forward' });
		await expect.element(forward).toBeInTheDocument();
		expect(back.query()).toBeNull();

		viewport().scrollLeft = viewport().scrollWidth;
		await expect.element(back).toBeInTheDocument();
		await vi.waitFor(() => expect(forward.query()).toBeNull());

		await back.click();
		await vi.waitFor(() => expect(forward.query()).not.toBeNull());
	});

	it('hides both arrows when every item fits', async () => {
		render(Wrapper, { width: '80rem' });
		await expect.element(page.getByRole('radio', { name: 'All' })).toBeInTheDocument();
		expect(page.getByRole('button', { name: /Scroll/ }).query()).toBeNull();
	});

	it('takes its name from a Label around it and submits with the form', async () => {
		render(LabelWrapper);
		await expect.element(page.getByRole('radiogroup', { name: 'Type' })).toBeInTheDocument();
		await expect.element(page.getByRole('group', { name: 'Sources' })).toBeInTheDocument();
		await page.getByText('Sources').click();
		await expect.element(page.getByRole('checkbox', { name: 'This PC' })).not.toBeChecked();
		await page.getByRole('radio', { name: 'Documents' }).click();
		await page.getByRole('checkbox', { name: 'This PC' }).click();
		await page.getByRole('button', { name: 'Search' }).click();
		await expect
			.element(page.getByTestId('submitted'))
			.toHaveTextContent('{"type":"documents","source":["this-pc","onedrive"]}');
	});

	it('keeps one tab stop with single selection and moves with the arrow keys', async () => {
		render(Wrapper, { selectedValue: 'apps' });
		await expect.element(page.getByRole('radio', { name: 'Apps' })).toHaveAttribute('tabindex', '0');
		await expect.element(page.getByRole('radio', { name: 'All' })).toHaveAttribute('tabindex', '-1');
		(page.getByRole('radio', { name: 'Apps' }).element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('radio', { name: 'Documents' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('radio', { name: 'People' })).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect.element(page.getByTestId('value')).toHaveTextContent('people');
		await userEvent.keyboard('{End}');
		await expect.element(page.getByRole('radio', { name: 'Videos' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('radio', { name: 'All' })).toHaveFocus();
	});

	it('goes back to the initial selection on a form reset', async () => {
		render(Wrapper, { selectedValue: 'all' });
		await page.getByRole('radio', { name: 'Apps' }).click();
		(page.getByTestId('form').element() as HTMLFormElement).reset();
		await expect.element(page.getByTestId('value')).toHaveTextContent('all');
		await expect.element(page.getByRole('radio', { name: 'All' })).toBeChecked();
		await expect.element(page.getByRole('radio', { name: 'Apps' })).not.toBeChecked();
	});

	it('keeps the selection when multiple changes', async () => {
		const { rerender } = await render(Wrapper, { selectedValue: 'apps' });
		await rerender({ multiple: true });
		await expect.element(page.getByTestId('value')).toHaveTextContent('apps');
		await expect.element(page.getByRole('checkbox', { name: 'Apps' })).toBeChecked();
		await page.getByRole('checkbox', { name: 'People' }).click();
		await rerender({ multiple: false });
		await expect.element(page.getByTestId('value')).toHaveTextContent('apps');
		await expect.element(page.getByRole('radio', { name: 'People' })).not.toBeChecked();
	});

	it('throws when an item is used outside a LiteFilter', async () => {
		await expect(async () => render(LiteFilterItem, { value: 'x' })).rejects.toThrow(
			'LiteFilter context is not available'
		);
	});
});
