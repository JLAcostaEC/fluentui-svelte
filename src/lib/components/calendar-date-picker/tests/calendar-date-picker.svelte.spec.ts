import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CalendarDatePickerTestWrapper from './CalendarDatePickerTestWrapper.svelte';

const trigger = () => page.selector('.fs-calendar-date-picker > button');
const calendar = () => page.selector('.fs-calendar-view');
const value = () => page.getByTestId('value');

describe('rendering', () => {
	it('renders a trigger asking for a date', async () => {
		render(CalendarDatePickerTestWrapper);
		await expect.element(trigger()).toHaveTextContent('Pick a date');
	});

	it('shows the selected date on the trigger', async () => {
		render(CalendarDatePickerTestWrapper, { value: new Date(2024, 2, 15) });
		await expect.element(trigger()).toHaveTextContent('3/15/2024');
	});

	it('formats the date the way it is told to', async () => {
		render(CalendarDatePickerTestWrapper, {
			value: new Date(2024, 2, 15),
			format: { year: 'numeric', month: 'long', day: 'numeric' }
		});
		await expect.element(trigger()).toHaveTextContent('March 15, 2024');
	});

	it('formats the date in the locale it is given', async () => {
		render(CalendarDatePickerTestWrapper, {
			value: new Date(2024, 2, 15),
			locale: 'es-ES',
			format: { year: 'numeric', month: 'long', day: 'numeric' }
		});
		await expect.element(trigger()).toHaveTextContent('15 de marzo de 2024');
	});
});

describe('the calendar popup', () => {
	it('stays closed until the trigger is used', async () => {
		render(CalendarDatePickerTestWrapper);
		await expect.element(calendar()).not.toBeInTheDocument();
	});

	it('opens when the trigger is clicked', async () => {
		render(CalendarDatePickerTestWrapper);

		await trigger().click();

		await expect.element(calendar()).toBeInTheDocument();
	});

	it('closes again on a second click', async () => {
		render(CalendarDatePickerTestWrapper);

		await trigger().click();
		await expect.element(calendar()).toBeInTheDocument();

		await trigger().click();

		await expect.element(calendar()).not.toBeInTheDocument();
	});

	it('closes when the pointer goes elsewhere', async () => {
		render(CalendarDatePickerTestWrapper);

		await trigger().click();
		await expect.element(calendar()).toBeInTheDocument();

		document.body.click();

		await vi.waitFor(() => expect(document.querySelector('.fs-calendar-view')).toBeNull());
	});
});

describe('choosing a date', () => {
	it('reports the day that is picked through the binding', async () => {
		render(CalendarDatePickerTestWrapper, { value: new Date(2024, 2, 15) });
		await expect.element(value()).toHaveTextContent('2024-03-15');

		await trigger().click();
		await page.getByRole('button', { name: 'Wednesday, March 20, 2024' }).click();

		await vi.waitFor(() => expect(value().element().textContent).toContain('2024-03-20'));
	});
});
