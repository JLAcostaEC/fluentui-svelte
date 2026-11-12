import { page, userEvent } from 'vitest/browser';
import '#lib/css/theme.css';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { SegmentedControlItem } from '#lib/index.js';
import Wrapper from './SegmentedControlTestWrapper.svelte';
import FormWrapper from './SegmentedControlFormTestWrapper.svelte';

describe('SegmentedControl', () => {
	it('exposes a named single selection and icon-only item', async () => {
		render(Wrapper, { selectedValue: 'week' });
		await expect.element(page.getByRole('radiogroup', { name: 'View' })).toBeInTheDocument();
		await expect.element(page.getByRole('radio', { name: 'Whole week' })).toBeChecked();
		await expect.element(page.getByRole('radio', { name: 'Day' })).not.toBeChecked();
		await expect.element(page.getByRole('radio', { name: 'Month' })).toBeInTheDocument();
	});

	it('updates the binding and reports each change only once', async () => {
		const onSelectionChange = vi.fn();
		render(Wrapper, { onSelectionChange });
		await page.getByRole('radio', { name: 'Whole week' }).click();
		await expect.element(page.getByRole('status', { name: 'Selection' })).toHaveTextContent('week');
		await page.getByRole('radio', { name: 'Whole week' }).click();
		expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith(expect.anything(), 'week');
	});

	it('reacts to selection changes from the parent without emitting an event', async () => {
		const onSelectionChange = vi.fn();
		const view = await render(Wrapper, { onSelectionChange });
		await view.rerender({ selectedValue: 'month' });
		await expect.element(page.getByRole('radio', { name: 'Month' })).toBeChecked();
		expect(onSelectionChange).not.toHaveBeenCalled();
	});

	it('moves focus without selecting and skips disabled items', async () => {
		render(Wrapper, { itemDisabled: true });
		await page.getByRole('radio', { name: 'Day' }).click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('radio', { name: 'Month' })).toHaveFocus();
		await expect.element(page.getByRole('radio', { name: 'Day' })).toBeChecked();
		await expect.element(page.getByRole('radio', { name: 'Month' })).not.toBeChecked();
		await userEvent.keyboard(' ');
		await expect.element(page.getByRole('radio', { name: 'Month' })).toBeChecked();
		await userEvent.keyboard('{Home}');
		await expect.element(page.getByRole('radio', { name: 'Day' })).toHaveFocus();
		await userEvent.keyboard('{End}');
		await expect.element(page.getByRole('radio', { name: 'Month' })).toHaveFocus();
	});
	it('selects on keyboard focus when requested', async () => {
		render(Wrapper, { selectOnFocus: true });
		await page.getByRole('radio', { name: 'Day' }).click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('radio', { name: 'Whole week' })).toBeChecked();
	});
	it('selects the focused radio with Enter when using a provider', async () => {
		const onSelectionChange = vi.fn();
		render(Wrapper, { onSelectionChange });
		await page.getByRole('radio', { name: 'Day' }).click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('radio', { name: 'Whole week' })).toHaveFocus();
		await expect.element(page.getByRole('radio', { name: 'Day' })).toBeChecked();
		await userEvent.keyboard('{Enter}');
		await expect.element(page.getByRole('radio', { name: 'Whole week' })).toBeChecked();
		expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith(expect.anything(), 'week');
		await userEvent.keyboard('{Enter}');
		expect(onSelectionChange).toHaveBeenCalledOnce();
	});

	it('registers keyboard navigation when mounted after the provider', async () => {
		render(Wrapper, { late: true });
		await page.getByRole('button', { name: 'Show' }).click();
		await page.getByRole('radio', { name: 'Day' }).click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('radio', { name: 'Whole week' })).toHaveFocus();
	});

	it('keeps the native tab stop at the checked radio when enhanced with tabspot', async () => {
		render(Wrapper, { selectedValue: 'month' });
		await page.getByRole('button', { name: 'Show' }).click();
		await userEvent.tab();
		await expect.element(page.getByRole('radio', { name: 'Month' })).toHaveFocus();
		await expect.element(page.getByRole('radio', { name: 'Month' })).toBeChecked();
	});

	it('disables every item and blocks programmatic clicks', async () => {
		const onSelectionChange = vi.fn();
		render(Wrapper, { disabled: true, onSelectionChange });
		for (const item of page.getByRole('radio').elements()) {
			expect(item).toBeDisabled();
			(item as HTMLInputElement).click();
		}
		expect(onSelectionChange).not.toHaveBeenCalled();
	});

	it('sizes segments equally by default and can fit their content', async () => {
		const view = await render(Wrapper);
		const widths = () =>
			page
				.getByRole('radio')
				.elements()
				.map((item) => item.getBoundingClientRect().width);
		// Grid tracks can differ by a subpixel after the browser distributes rounding.
		expect(Math.max(...widths()) - Math.min(...widths())).toBeLessThan(1);
		await view.rerender({ equalWidth: false });
		expect(new Set(widths()).size).toBeGreaterThan(1);
	});
	it('scales both the segment and text with size', async () => {
		const view = await render(Wrapper, { size: 'small' });
		const measure = () => {
			const item = page.getByRole('radio', { name: 'Day' }).element().parentElement!;
			return { height: item.getBoundingClientRect().height, font: parseFloat(getComputedStyle(item).fontSize) };
		};
		const small = measure();
		await view.rerender({ size: 'medium' });
		const medium = measure();
		await view.rerender({ size: 'large' });
		const large = measure();
		expect(small.height).toBeLessThan(medium.height);
		expect(medium.height).toBeLessThan(large.height);
		expect(small.font).toBeLessThan(medium.font);
		expect(medium.font).toBeLessThan(large.font);
	});
	it('can hide the selected indicator', async () => {
		const view = await render(Wrapper);
		const indicator = () =>
			getComputedStyle(page.getByRole('radio', { name: 'Day' }).element().parentElement!, '::before').content;
		expect(indicator()).not.toBe('none');
		await view.rerender({ hideIndicator: true });
		expect(indicator()).toBe('none');
	});
	it('uses the critical text color when marked invalid', async () => {
		const view = await render(Wrapper);
		const color = () => getComputedStyle(page.getByRole('radio', { name: 'Day' }).element().parentElement!).color;
		const normal = color();
		await view.rerender({ 'aria-invalid': 'true' });
		await expect.poll(color).not.toBe(normal);
		await expect
			.poll(
				() =>
					color() === getComputedStyle(page.getByRole('radio', { name: 'Whole week' }).element().parentElement!).color
			)
			.toBe(true);
	});

	it('opts out of tabspot', async () => {
		render(Wrapper, { disableTabspot: true });
		await expect.element(page.getByRole('radiogroup')).not.toHaveAttribute('data-tabspot');
	});

	it('rejects an item outside its control', async () => {
		await expect(render(SegmentedControlItem, { value: 'orphan' })).rejects.toThrow('No SegmentedControlContext found');
	});
});

describe('native form integration', () => {
	const form = () => page.getByRole('form', { name: 'View form' }).element() as HTMLFormElement;

	it.each([false, true])('submits the selected value with external form %s', async (external) => {
		render(FormWrapper, { external });
		expect(new FormData(form()).get('view')).toBe('day');
		await page.getByRole('radio', { name: 'Whole week' }).click();
		expect(new FormData(form()).getAll('view')).toEqual(['week']);
	});

	it('validates required selection and focuses a native radio', async () => {
		render(FormWrapper, { selectedValue: '', required: true });
		expect(form().checkValidity()).toBe(false);
		await page.getByRole('button', { name: 'Submit' }).click();
		await expect.element(page.getByRole('radio', { name: 'Day' })).toHaveFocus();
		await expect.element(page.getByRole('radio', { name: 'Day' })).not.toBeChecked();
		await expect
			.poll(() =>
				getComputedStyle(page.getByRole('radiogroup').element())
					.getPropertyValue('--fs-segmented-control-text-color')
					.trim()
			)
			.not.toBe('');
		await page.getByRole('radio', { name: 'Whole week' }).click();
		expect(form().checkValidity()).toBe(true);
	});

	it.each(['day', ''])('resets selection and binding to initial value %s', async (selectedValue) => {
		const onSelectionChange = vi.fn();
		render(FormWrapper, { selectedValue, onSelectionChange });
		await page.getByRole('radio', { name: 'Whole week' }).click();
		onSelectionChange.mockClear();
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(page.getByRole('status', { name: 'Selection' })).toHaveTextContent(selectedValue);
		expect(new FormData(form()).get('view')).toBe(selectedValue || null);
		expect(onSelectionChange).not.toHaveBeenCalled();
	});

	it('omits disabled radios from submission and validation', async () => {
		render(FormWrapper, { selectedValue: 'week', disabled: true, required: true });
		expect(new FormData(form()).has('view')).toBe(false);
		expect(form().checkValidity()).toBe(true);
	});

	it('preserves selection when a reset is cancelled', async () => {
		render(FormWrapper);
		await page.getByRole('radio', { name: 'Whole week' }).click();
		form().addEventListener('reset', (event) => event.preventDefault(), { once: true });
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(page.getByRole('status', { name: 'Selection' })).toHaveTextContent('week');
		expect(new FormData(form()).get('view')).toBe('week');
	});

	it('moves focus without changing selection without a provider', async () => {
		render(FormWrapper, { selectedValue: 'week' });
		await page.getByRole('button', { name: 'Before' }).click();
		await userEvent.tab();
		await expect.element(page.getByRole('radio', { name: 'Whole week' })).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(page.getByRole('radio', { name: 'Day' })).toHaveFocus();
		await expect.element(page.getByRole('radio', { name: 'Whole week' })).toBeChecked();
		await userEvent.keyboard(' ');
		await expect.element(page.getByRole('status', { name: 'Selection' })).toHaveTextContent('day');
	});
	it('selects with Enter without submitting the form or requiring a provider', async () => {
		const onSubmit = vi.fn();
		render(FormWrapper, { selectedValue: 'day' });
		form().addEventListener('submit', onSubmit);
		await page.getByRole('radio', { name: 'Day' }).click();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByRole('radio', { name: 'Whole week' })).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect.element(page.getByRole('radio', { name: 'Whole week' })).toBeChecked();
		expect(new FormData(form()).get('view')).toBe('week');
		expect(onSubmit).not.toHaveBeenCalled();
	});
	it('uses a custom browser validation message and clears it after selection', async () => {
		render(FormWrapper, { selectedValue: '', required: true, validationMessage: 'Choose a view' });
		const radio = page.getByRole('radio', { name: 'Day' }).element() as HTMLInputElement;
		expect(form().checkValidity()).toBe(false);
		expect(radio.validationMessage).toBe('Choose a view');
		await page.getByRole('radio', { name: 'Whole week' }).click();
		await expect.poll(() => form().checkValidity()).toBe(true);
		expect(radio.validationMessage).toBe('');
	});

	it('forwards native input/change events', async () => {
		const oninput = vi.fn();
		const onchange = vi.fn();
		render(FormWrapper, { itemProps: { oninput, onchange } });
		await page.getByRole('radio', { name: 'Whole week' }).click();
		expect(oninput).toHaveBeenCalledOnce();
		expect(onchange).toHaveBeenCalledOnce();
	});

	it('uses Label to name the group while preserving individual option names', async () => {
		const view = await render(FormWrapper);
		await expect.element(page.getByRole('radiogroup', { name: 'View' })).toBeInTheDocument();
		await expect.element(page.getByRole('radio', { name: 'Whole week' })).toBeInTheDocument();
		await view.rerender({ label: 'Period' });
		await expect.element(page.getByRole('radiogroup', { name: 'Period' })).toBeInTheDocument();
	});

	it('allows an explicit accessible name to override Label', async () => {
		render(FormWrapper, { 'aria-label': 'Display period' });
		await expect.element(page.getByRole('radiogroup', { name: 'Display period' })).toBeInTheDocument();
	});
});
