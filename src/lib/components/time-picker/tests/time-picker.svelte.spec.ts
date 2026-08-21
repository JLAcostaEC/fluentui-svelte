import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { TimePicker } from '$lib/index.js';
import TimePickerTestWrapper from './TimePickerTestWrapper.svelte';

const picker = () => page.selector('.fs-time-picker');
const columns = () =>
	Array.from(document.querySelectorAll('.fs-time-picker .picker-content')).map((el) => el.textContent);
const flyout = () => page.selector('.time-picker-flyout');

describe('rendering', () => {
	it('renders a trigger that opens a dialog', async () => {
		render(TimePicker);
		await expect.element(picker()).toBeInTheDocument();
		await expect.element(picker()).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('shows the column names while there is no time', async () => {
		render(TimePicker);
		expect(columns()).toEqual(['Hour', 'Minute', 'Second']);
	});

	it('shows the committed time once it has one', async () => {
		render(TimePicker, { value: '13:45:30' });
		expect(columns()).toEqual(['13', '45', '30']);
	});

	it('carries the value on the underlying time input', async () => {
		render(TimePicker, { value: '13:45:30' });
		await expect.element(page.selector('input[type="time"]')).toHaveValue('13:45:30');
	});

	it('keeps that input out of the tab order and out of the accessibility tree', async () => {
		render(TimePicker, { value: '13:45:30' });

		const input = document.querySelector<HTMLInputElement>('input[type="time"]')!;
		expect(input.hidden).toBe(true);

		document.querySelector<HTMLElement>('.fs-time-picker')?.focus();
		await userEvent.tab();

		expect(document.activeElement).not.toBe(input);
	});

	it('is a real button', async () => {
		render(TimePicker);
		expect(document.querySelector('.fs-time-picker')?.tagName).toBe('BUTTON');
	});

	it('takes a name for the form through inputProps', async () => {
		render(TimePicker, { value: '13:45:30', inputProps: { name: 'meeting-time' } });
		await expect.element(page.selector('input[type="time"]')).toHaveAttribute('name', 'meeting-time');
	});
});

describe('the twelve hour clock', () => {
	it('adds an AM/PM column', async () => {
		render(TimePicker, { format: 12 });
		expect(columns()).toEqual(['Hour', 'Minute', 'Second', 'AM/PM']);
	});

	it('reads an afternoon hour off the twelve hour wheel', async () => {
		render(TimePicker, { format: 12, value: '13:45:30' });
		expect(columns()).toEqual(['01', '45', '30', 'PM']);
	});

	it('reads a morning hour as AM', async () => {
		render(TimePicker, { format: 12, value: '09:05:00' });
		expect(columns()).toEqual(['09', '05', '00', 'AM']);
	});

	it('shows midnight as twelve', async () => {
		render(TimePicker, { format: 12, value: '00:30:00' });
		expect(columns()).toEqual(['12', '30', '00', 'AM']);
	});
});

describe('hidden columns', () => {
	it('drops the seconds column', async () => {
		render(TimePicker, { hideSeconds: true });
		expect(columns()).toEqual(['Hour', 'Minute']);
	});

	it('drops the hours column', async () => {
		render(TimePicker, { hideHours: true });
		expect(columns()).toEqual(['Minute', 'Second']);
	});
});

describe('the popup', () => {
	it('is collapsed to begin with', async () => {
		render(TimePicker);
		await expect.element(picker()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(flyout()).not.toBeInTheDocument();
	});

	it('opens when the trigger is clicked', async () => {
		render(TimePicker);

		await picker().click();

		await expect.element(picker()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(flyout()).toBeInTheDocument();
	});

	it('announces the popup as a dialog it controls', async () => {
		render(TimePicker, { open: true });

		const trigger = document.querySelector('.fs-time-picker')!;
		const controls = trigger.getAttribute('aria-controls');

		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(controls).toBeTruthy();
		expect(document.getElementById(controls!)).toHaveAttribute('role', 'dialog');
	});

	it('closes on Escape and hands the focus back', async () => {
		render(TimePicker, { open: true });

		await userEvent.keyboard('{Escape}');

		await expect.element(flyout()).not.toBeInTheDocument();
		expect(document.activeElement).toBe(document.querySelector('.fs-time-picker'));
	});

	it('closes without committing when cancelled', async () => {
		render(TimePickerTestWrapper, { open: true });

		await page.getByRole('button', { name: 'Cancel' }).click();

		await expect.element(flyout()).not.toBeInTheDocument();
		await expect.element(page.getByTestId('value')).toHaveTextContent('empty');
	});

	it('commits a time when confirmed', async () => {
		render(TimePickerTestWrapper, { open: true });

		await page.getByRole('button', { name: 'Confirm' }).click();

		await expect.element(flyout()).not.toBeInTheDocument();
		await expect.element(page.getByTestId('value')).not.toHaveTextContent('empty');
	});
});
