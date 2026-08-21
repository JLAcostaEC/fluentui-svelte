import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { DatePicker } from '$lib/index.js';
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
		await expect.element(page.selector('input.date-picker-input')).toHaveValue('2024-03-15');
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

	it('opens on Enter', async () => {
		render(DatePicker);
		document.querySelector<HTMLElement>('.fs-date-picker')?.focus();

		await picker().click();

		await expect.element(flyout()).toBeInTheDocument();
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
