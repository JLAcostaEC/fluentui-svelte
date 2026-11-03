import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { DatePicker } from '#lib/index.js';
import DatePickerTestWrapper from './DatePickerTestWrapper.svelte';

const picker = () => page.selector('.fs-date-picker');
const columns = () =>
	Array.from(document.querySelectorAll('.fs-date-picker .picker-content')).map((el) => el.textContent);
const flyout = () => page.selector('.date-picker-flyout');

describe('rendering', () => {
	it('renders a trigger that opens a dialog', async () => {
		render(DatePicker);
		await expect.element(picker()).toBeInTheDocument();
		await expect.element(picker()).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('shows the column names while there is no date', async () => {
		render(DatePicker);
		expect(columns()).toEqual(['Day', 'Month', 'Year']);
	});

	it('lays the columns out in the format it is given', async () => {
		render(DatePicker, { format: 'MM/dd/yyyy' });
		expect(columns()).toEqual(['Month', 'Day', 'Year']);
	});

	it('shows the committed date once it has one', async () => {
		render(DatePicker, { value: '2024-03-15' });
		expect(columns()).toEqual(['15', 'March', '2024']);
	});

	it('carries the value on the underlying date input', async () => {
		render(DatePicker, { value: '2024-03-15' });
		await expect.element(page.selector('input[type="date"]')).toHaveValue('2024-03-15');
	});

	it('keeps that input behind the button, out of the tab order and the accessibility tree, but not out of validation', async () => {
		render(DatePicker, { value: '2024-03-15' });

		const input = document.querySelector<HTMLInputElement>('input[type="date"]')!;
		expect(input.willValidate).toBe(true);
		expect(input.getAttribute('aria-hidden')).toBe('true');
		expect(getComputedStyle(input).opacity).toBe('0');

		document.querySelector<HTMLElement>('.fs-date-picker')?.focus();
		await userEvent.tab();

		expect(document.activeElement).not.toBe(input);
	});

	it.each([
		[{}, ['2000-01-01', '2010-12-31']],
		[{ min: '2005-06-01', max: '2006-06-01' }, ['2005-06-01', '2006-06-01']]
	])(
		'accepts on its native input only the dates of the years it offers, unless min and max say otherwise (%o)',
		async (limits, expected) => {
			render(DatePicker, { minYear: 2000, maxYear: 2010, ...limits });
			const input = document.querySelector<HTMLInputElement>('input[type="date"]')!;

			expect([input.min, input.max]).toEqual(expected);
		}
	);

	it('is a real button', async () => {
		render(DatePicker);
		await expect.element(page.getByRole('button', { name: /Day/ })).toBeInTheDocument();
		expect(document.querySelector('.fs-date-picker')?.tagName).toBe('BUTTON');
	});
});

describe('hidden columns', () => {
	it('drops the year column', async () => {
		render(DatePicker, { hideYears: true });
		expect(columns()).toEqual(['Day', 'Month']);
	});

	it('drops the month column', async () => {
		render(DatePicker, { hideMonths: true });
		expect(columns()).toEqual(['Day', 'Year']);
	});

	it('drops the day column', async () => {
		render(DatePicker, { hideDays: true });
		expect(columns()).toEqual(['Month', 'Year']);
	});
});

describe('the popup', () => {
	it('is collapsed to begin with', async () => {
		render(DatePicker);
		await expect.element(picker()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(flyout()).not.toBeInTheDocument();
	});

	it('opens when the trigger is clicked', async () => {
		render(DatePicker);

		await picker().click();

		await expect.element(picker()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(flyout()).toBeInTheDocument();
	});

	it('names each list of the popup after its column', async () => {
		render(DatePicker);
		await picker().click();
		for (const name of ['Day', 'Month', 'Year'])
			await expect.element(flyout().getByRole('listbox', { name })).toBeInTheDocument();
	});

	it('takes the names of the columns from columnLabels', async () => {
		render(DatePicker, { columnLabels: { day: 'Día', month: 'Mes', year: 'Año' } });
		expect(columns()).toEqual(['Día', 'Mes', 'Año']);
		await picker().click();
		await expect.element(flyout().getByRole('listbox', { name: 'Mes' })).toBeInTheDocument();
	});

	it('gives the options of every column ids of their own, and keeps the arrows to the pointer', async () => {
		render(DatePicker);
		await picker().click();
		await expect.element(flyout()).toBeInTheDocument();
		const ids = [...flyout().element().querySelectorAll('[role="option"]')].map((el) => el.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const listbox of flyout().getByRole('listbox').elements()) {
			const active = listbox.getAttribute('aria-activedescendant')!;
			expect(listbox.contains(document.getElementById(active))).toBe(true);
		}
		expect(
			flyout()
				.getByRole('button', { name: /previous|next/i })
				.elements()
		).toHaveLength(0);
	});

	it('opens on Enter', async () => {
		render(DatePicker);
		document.querySelector<HTMLElement>('.fs-date-picker')?.focus();

		await picker().click();

		await expect.element(flyout()).toBeInTheDocument();
	});

	it('announces the popup as a dialog it controls', async () => {
		render(DatePicker, { open: true });

		const trigger = document.querySelector('.fs-date-picker')!;
		const controls = trigger.getAttribute('aria-controls');

		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(controls).toBeTruthy();
		expect(document.getElementById(controls!)).toHaveAttribute('role', 'dialog');
		expect(document.getElementById(controls!)).toHaveAttribute('aria-label', 'Choose a date');
	});

	it('closes on Escape and hands the focus back', async () => {
		render(DatePicker, { open: true });

		await userEvent.keyboard('{Escape}');

		await expect.element(flyout()).not.toBeInTheDocument();
		expect(document.activeElement).toBe(document.querySelector('.fs-date-picker'));
	});

	it('offers a way to confirm and a way to cancel', async () => {
		render(DatePicker, { open: true });
		await expect.element(page.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
	});

	it('closes without committing when cancelled', async () => {
		render(DatePickerTestWrapper, { open: true });

		await page.getByRole('button', { name: 'Cancel' }).click();

		await expect.element(flyout()).not.toBeInTheDocument();
		await expect.element(page.getByTestId('value')).toHaveTextContent('empty');
	});

	it('commits a date when confirmed', async () => {
		render(DatePickerTestWrapper, { open: true });

		await page.getByRole('button', { name: 'Confirm' }).click();

		await expect.element(flyout()).not.toBeInTheDocument();
		await expect.element(page.getByTestId('value')).not.toHaveTextContent('empty');
	});
});
