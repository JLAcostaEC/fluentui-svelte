import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FormControlsTestWrapper, { type Control } from './FormControlsTestWrapper.svelte';

/** The wrapper sets `--fs-system-critical` to this color. */
const CRITICAL = 'rgb(255, 0, 0)';

const form = () => document.querySelector('form')!;
const submitted = () => new FormData(form()).getAll('field');
const native = () => document.querySelector<HTMLInputElement>('[name="field"]')!;
const after = (selector: string) => getComputedStyle(document.querySelector(selector)!, '::after').backgroundColor;

/** The controls whose native field stands behind the control people use, with that control and the box the field covers. */
const PROXIES: [Control, string, string][] = [
	['DatePicker', '.fs-date-picker', '.fs-date-picker'],
	['TimePicker', '.fs-time-picker', '.fs-time-picker'],
	['CalendarDatePicker', '.fs-calendar-date-picker-button', '.fs-calendar-date-picker'],
	['Dropdown', '.fs-dropdown-button', '.fs-dropdown'],
	['TagPicker', '.control input', '.fs-tagpicker']
];
const visibleOf = (control: Control) => document.querySelector<HTMLElement>(PROXIES.find(([c]) => c === control)![1])!;

describe('native form submission', () => {
	it.each<[Control, Record<string, unknown>, string[]]>([
		['DatePicker', { value: '2024-03-15' }, ['2024-03-15']],
		['TimePicker', { value: '13:45:30' }, ['13:45:30']],
		['CalendarDatePicker', { value: new Date(2024, 2, 5) }, ['2024-03-05']],
		['Dropdown', { value: 'banana' }, ['banana']],
		['DropdownMultiple', { value: ['apple', 'cherry'] }, ['apple', 'cherry']],
		['TagPicker', { selectedOptions: ['apple', 'cherry'], value: 'typed text' }, ['apple', 'cherry']],
		['Slider', { value: 40 }, ['40']],
		['Rating', { value: 3 }, ['3']],
		['AutoSuggestBox', { value: 'free text' }, ['free text']]
	])('%s submits its value under its name, and satisfies required', async (control, props, expected) => {
		const onsubmit = vi.fn();
		render(FormControlsTestWrapper, { control, fieldProps: { ...props, required: true }, onsubmit });

		expect(submitted()).toEqual(expected);
		await page.getByRole('button', { name: 'Submit' }).click();
		expect(onsubmit).toHaveBeenCalledOnce();
	});

	it.each<Control>([
		'DatePicker',
		'TimePicker',
		'CalendarDatePicker',
		'Dropdown',
		'DropdownMultiple',
		'TagPicker',
		'Rating'
	])('%s blocks the submission while required and empty', async (control) => {
		const onsubmit = vi.fn();
		render(FormControlsTestWrapper, { control, fieldProps: { required: true }, onsubmit });

		await page.getByRole('button', { name: 'Submit' }).click();
		expect(form().checkValidity()).toBe(false);
		expect(onsubmit).not.toHaveBeenCalled();
	});

	it('keeps a required TagPicker invalid with typed text and no selection', async () => {
		render(FormControlsTestWrapper, { control: 'TagPicker', fieldProps: { required: true, value: 'apple' } });

		expect(submitted()).toEqual([]);
		expect(native().validity.valueMissing).toBe(true);
	});

	it('accepts an empty TagPicker that is not required', async () => {
		render(FormControlsTestWrapper, { control: 'TagPicker', fieldProps: { value: 'apple' } });

		expect(submitted()).toEqual([]);
		expect(form().checkValidity()).toBe(true);
	});

	it('submits the free text of an AutoSuggestBox on Enter, with no suggestion chosen', async () => {
		const onsubmit = vi.fn();
		render(FormControlsTestWrapper, { control: 'AutoSuggestBox', fieldProps: { pattern: '[a-z ]+' }, onsubmit });

		await userEvent.click(page.getByRole('combobox'));
		await userEvent.keyboard('zzz{Enter}');
		expect(onsubmit).toHaveBeenCalledOnce();
		expect(onsubmit.mock.calls[0][0].get('field')).toBe('zzz');

		await userEvent.keyboard('1{Enter}');
		expect(onsubmit).toHaveBeenCalledOnce();
	});

	it.each<[Control, string]>([
		['DatePicker', '.fs-date-picker:disabled'],
		['TimePicker', '.fs-time-picker:disabled'],
		['CalendarDatePicker', '.fs-button:disabled'],
		['Dropdown', '.fs-dropdown-button:disabled'],
		['TagPicker', '.control input:disabled'],
		['Slider', '.fs-slider.disabled']
	])('%s leaves a disabled value out of the form and disables the visible control', async (control, visible) => {
		render(FormControlsTestWrapper, { control, fieldProps: { disabled: true } });

		expect(native().disabled).toBe(true);
		expect(new FormData(form()).has('field')).toBe(false);
		expect(document.querySelector(visible)).not.toBeNull();
	});
});

describe('native fields of custom controls', () => {
	it.each(PROXIES)(
		'%s keeps its native field behind the visible control, out of the tab order and the accessibility tree',
		async (control, _visible, box) => {
			render(FormControlsTestWrapper, { control });
			const field = native().getBoundingClientRect();
			const covered = document.querySelector(box)!.getBoundingClientRect();

			expect(native().willValidate).toBe(true);
			expect(native().tabIndex).toBe(-1);
			expect(native().getAttribute('aria-hidden')).toBe('true');
			expect(getComputedStyle(native()).opacity).toBe('0');
			expect([field.width, field.height]).toEqual([covered.width, covered.height]);
		}
	);

	it('keeps the range input of a Slider in its thumb, as the slider people and forms use', async () => {
		render(FormControlsTestWrapper, { control: 'Slider' });

		expect(native().closest('.slider-thumb')).not.toBeNull();
		expect(native().tabIndex).toBe(0);
		expect(native().getAttribute('aria-hidden')).toBeNull();
		expect(getComputedStyle(native()).opacity).toBe('0');
	});

	it.each(PROXIES)('%s names and describes its visible control after the ARIA of its native field', async (control) => {
		render(FormControlsTestWrapper, { control, fieldProps: { 'aria-label': 'Fruit', 'aria-describedby': 'hint' } });

		expect(visibleOf(control).getAttribute('aria-label')).toBe('Fruit');
		expect(visibleOf(control).getAttribute('aria-describedby')).toBe('hint');
	});

	it.each<Control>(['Dropdown', 'TagPicker'])(
		'%s tells assistive technologies on its combobox that the field is required, and invalid once a submission found it so',
		async (control) => {
			render(FormControlsTestWrapper, { control, fieldProps: { required: true } });
			const combobox = visibleOf(control);

			expect(combobox.getAttribute('aria-required')).toBe('true');
			expect(combobox.getAttribute('aria-invalid')).toBeNull();

			form().requestSubmit();
			await expect.poll(() => combobox.getAttribute('aria-invalid')).toBe('true');

			form().reset();
			await expect.poll(() => combobox.getAttribute('aria-invalid')).toBeNull();
		}
	);

	it.each(PROXIES)(
		'%s lets the browser report its invalid field, then hands the next key to the visible control',
		async (control) => {
			render(FormControlsTestWrapper, { control, fieldProps: { required: true } });
			let hiddenWhenFocused: string | null | undefined;
			native().addEventListener('focus', () => (hiddenWhenFocused = native().getAttribute('aria-hidden')));

			await page.getByRole('button', { name: 'Submit' }).click();
			expect(document.activeElement).toBe(native());
			expect(hiddenWhenFocused).toBeNull();

			await userEvent.keyboard('x');
			expect(document.activeElement).toBe(visibleOf(control));
			await expect.poll(() => native().getAttribute('aria-hidden')).toBe('true');
		}
	);

	it.each<[Control, string]>([
		['Dropdown', '.fs-dropdown-flyout'],
		['DatePicker', '.date-picker-flyout']
	])('%s opens from the key that opens it, pressed on its reported field', async (control, popup) => {
		render(FormControlsTestWrapper, { control, fieldProps: { required: true } });

		await page.getByRole('button', { name: 'Submit' }).click();
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(page.selector(popup)).toBeVisible();
	});

	it('hides again a field that checkValidity found invalid, since nothing reports it', async () => {
		render(FormControlsTestWrapper, { control: 'Dropdown', fieldProps: { required: true } });

		expect(form().checkValidity()).toBe(false);
		await expect.poll(() => native().getAttribute('aria-hidden')).toBe('true');
	});

	it.each(PROXIES)(
		'%s calls onfocus and onblur when its visible control takes and loses the focus',
		async (control) => {
			const onfocus = vi.fn();
			const onblur = vi.fn();
			render(FormControlsTestWrapper, { control, fieldProps: { onfocus, onblur } });

			visibleOf(control).focus();
			expect(onfocus).toHaveBeenCalledOnce();
			visibleOf(control).blur();
			expect(onblur).toHaveBeenCalledOnce();
		}
	);

	it('leaves the value of a Dropdown with no name out of the form', async () => {
		render(FormControlsTestWrapper, { control: 'Dropdown', fieldProps: { name: undefined, value: 'banana' } });

		expect([...new FormData(form()).keys()]).toEqual([]);
	});
});

describe('disabled fieldset', () => {
	it.each([
		[false, '0'],
		[true, '40']
	])(
		'moves a Slider with the pointer only outside a disabled fieldset (inside one: %s)',
		async (fieldset, expected) => {
			render(FormControlsTestWrapper, { control: 'Slider', fieldProps: { value: 40 }, fieldset });
			const rail = document.querySelector('.slider-rail')!.getBoundingClientRect();

			document.querySelector('.fs-slider')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			window.dispatchEvent(new MouseEvent('mousemove', { clientX: rail.left - 10, clientY: rail.top }));
			window.dispatchEvent(new MouseEvent('mouseup'));

			await expect.poll(() => native().value).toBe(expected);
		}
	);

	it('keeps a TagPicker in a disabled fieldset closed, and draws it disabled', async () => {
		render(FormControlsTestWrapper, { control: 'TagPicker', fieldset: true });
		const control = document.querySelector<HTMLElement>('.fs-tagpicker .control')!;

		control.click();

		expect(document.querySelector<HTMLElement>('.fs-tagpicker-flyout')!.hidden).toBe(true);
		expect(getComputedStyle(control).cursor).toBe('not-allowed');
	});
});

describe('invalid state', () => {
	it.each<[Control, string]>([
		['DatePicker', '.fs-date-picker'],
		['TimePicker', '.fs-time-picker'],
		['CalendarDatePicker', '.fs-button'],
		['Dropdown', '.fs-dropdown'],
		['TagPicker', '.fs-tagpicker .control'],
		['TextBox', '.fs-textbox']
	])('%s marks its visible control once a submission finds it invalid, until a reset', async (control, visible) => {
		render(FormControlsTestWrapper, { control, fieldProps: { required: true } });

		expect(after(visible)).not.toBe(CRITICAL);
		form().requestSubmit();
		await expect.poll(() => after(visible)).toBe(CRITICAL);

		form().reset();
		await expect.poll(() => after(visible)).not.toBe(CRITICAL);
	});

	it.each<[Control, string]>([
		['DatePicker', '.fs-date-picker'],
		['TimePicker', '.fs-time-picker'],
		['CalendarDatePicker', '.fs-button'],
		['Dropdown', '.fs-dropdown'],
		['TagPicker', '.fs-tagpicker .control'],
		['TextBox', '.fs-textbox']
	])('%s marks its visible control when aria-invalid is set', async (control, visible) => {
		render(FormControlsTestWrapper, { control, fieldProps: { 'aria-invalid': true } });

		await expect.poll(() => after(visible)).toBe(CRITICAL);
	});

	it.each<[Control, string]>([
		['TextBox', '.fs-textbox'],
		['TagPicker', '.fs-tagpicker .control']
	])('%s only colors the bar of a text control', async (control, visible) => {
		render(FormControlsTestWrapper, { control, fieldProps: { required: true } });
		const element = document.querySelector(visible)!;
		const border = getComputedStyle(element, '::before').background;
		const text = getComputedStyle(element).color;

		form().requestSubmit();
		await expect.poll(() => after(visible)).toBe(CRITICAL);
		expect(getComputedStyle(element, '::before').background).toBe(border);
		expect(getComputedStyle(element).color).toBe(text);
	});

	it('marks the Rating icons once a submission finds it invalid', async () => {
		render(FormControlsTestWrapper, { control: 'Rating', fieldProps: { required: true } });

		form().requestSubmit();
		await expect.poll(() => getComputedStyle(document.querySelector('.rating-icon')!).color).toBe(CRITICAL);
	});

	it('marks the Slider track when aria-invalid is set', async () => {
		render(FormControlsTestWrapper, { control: 'Slider', fieldProps: { value: 40, 'aria-invalid': true } });

		await expect.poll(() => getComputedStyle(document.querySelector('.slider-track')!).backgroundColor).toBe(CRITICAL);
	});
});

describe('form reset', () => {
	it.each<[Control, Record<string, unknown>, string[], string]>([
		['DatePicker', { value: '2024-03-15' }, [''], 'DayMonthYear'],
		['TimePicker', { value: '13:45:30' }, [''], 'HourMinuteSecond'],
		['CalendarDatePicker', { value: new Date(2024, 2, 5) }, [''], 'Pick a date'],
		['Dropdown', { value: 'banana' }, [''], 'Select an option'],
		['DropdownMultiple', { value: ['apple', 'cherry'] }, [], 'Select an option'],
		['TagPicker', { selectedOptions: ['apple', 'cherry'] }, [], ''],
		['Rating', { value: 3 }, [], ''],
		['Slider', { value: 40, defaultValue: 10 }, ['10'], '']
	])('%s returns to its default, on screen too', async (control, props, expected, text) => {
		render(FormControlsTestWrapper, { control, fieldProps: props });
		const visible = document.querySelector<HTMLElement>('form > :first-child')!;

		await page.getByRole('button', { name: 'Reset' }).click();

		await expect.poll(submitted).toEqual(expected);
		if (text) await expect.poll(() => visible.innerText.replace(/\s/g, '')).toBe(text.replace(/\s/g, ''));
		if (control === 'TagPicker') expect(document.querySelector('.fs-tag')).toBeNull();
		if (control === 'Rating') expect(document.querySelector('.rating-icon.selected')).toBeNull();
		if (control === 'Slider')
			expect(document.querySelector<HTMLElement>('.fs-slider')!.style.cssText).toContain('--slider-percentage: 10%');
	});

	it('returns a Slider with no defaultValue to its min', async () => {
		render(FormControlsTestWrapper, { control: 'Slider', fieldProps: { value: 40, min: 10 } });

		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.poll(submitted).toEqual(['10']);
	});

	it('returns a picker to the defaultValue given to its native field', async () => {
		render(FormControlsTestWrapper, {
			control: 'DatePicker',
			fieldProps: { value: '2024-03-15', defaultValue: '2020-01-02' }
		});

		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.poll(submitted).toEqual(['2020-01-02']);
		await expect.poll(() => document.querySelector('.fs-date-picker')!.textContent).toContain('January');
	});
});

describe('native events', () => {
	it('fires input and change on the native field when a DatePicker date is confirmed', async () => {
		const oninput = vi.fn();
		const onchange = vi.fn();
		render(FormControlsTestWrapper, { control: 'DatePicker', fieldProps: { oninput, onchange } });

		await page.getByRole('button', { name: /Day/ }).click();
		await page.getByRole('button', { name: 'Confirm' }).click();

		expect(oninput).toHaveBeenCalledOnce();
		expect(onchange).toHaveBeenCalledOnce();
		expect(onchange.mock.calls[0][0].target).toBe(native());
		expect(submitted()[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('fires change on the native select when a Dropdown option is chosen', async () => {
		const onchange = vi.fn((event: Event) => (event.target as HTMLSelectElement).value);
		render(FormControlsTestWrapper, { control: 'Dropdown', fieldProps: { onchange } });

		await page.getByRole('combobox').first().click();
		await page.selector('.fs-dropdown-flyout').getByRole('option', { name: 'Cherry' }).click();

		expect(onchange).toHaveBeenCalledOnce();
		expect(onchange.mock.results[0].value).toBe('cherry');
	});

	it('fires change on the native select when a TagPicker option is chosen or removed', async () => {
		const onchange = vi.fn();
		render(FormControlsTestWrapper, { control: 'TagPicker', fieldProps: { onchange } });

		await userEvent.click(page.getByRole('combobox'));
		await page.selector('.fs-tagpicker-flyout').getByRole('option', { name: 'Banana' }).click();
		expect(onchange).toHaveBeenCalledOnce();
		expect(submitted()).toEqual(['banana']);

		await userEvent.keyboard('{Backspace}');
		expect(onchange).toHaveBeenCalledTimes(2);
		expect(submitted()).toEqual([]);
	});

	it('fires input and change on the native range when the Slider moves with the keyboard', async () => {
		const oninput = vi.fn();
		const onchange = vi.fn();
		render(FormControlsTestWrapper, { control: 'Slider', fieldProps: { value: 40, oninput, onchange } });

		// The first Tab of a test can leave the page, unless something in it was clicked first.
		await userEvent.click(document.body);
		await userEvent.tab();
		await userEvent.keyboard('{ArrowRight}');

		expect(oninput).toHaveBeenCalledOnce();
		expect(onchange).toHaveBeenCalledOnce();
		expect(submitted()).toEqual(['41']);
	});
});
