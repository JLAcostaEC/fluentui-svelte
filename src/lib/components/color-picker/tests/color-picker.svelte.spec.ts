import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Wrapper from './ColorPickerTestWrapper.svelte';
import '#lib/css/theme.css';

describe('ColorPicker', () => {
	it('normalizes CSS colors in the Hex editor while preserving the submitted value', async () => {
		render(Wrapper, { initial: 'hsl(120, 100%, 50%)' });
		await expect.element(page.getByRole('textbox', { name: 'Hex', exact: true })).toHaveValue('#00ff00');
		expect(new FormData(document.querySelector('form')!).get('color')).toBe('hsl(120, 100%, 50%)');
	});
	it('submits only the color and follows external updates', async () => {
		render(Wrapper);
		expect([...new FormData(document.querySelector('form')!).entries()]).toEqual([['color', '#ff0000']]);
		await page.getByRole('button', { name: 'Set blue' }).click();
		await expect.element(page.getByRole('textbox', { name: 'Hex', exact: true })).toHaveValue('#0000ff');
		await expect.element(page.getByRole('slider', { name: 'Hue', exact: true })).toHaveValue('240');
	});
	it.each(['square', 'rounded', 'circular'] as const)('changes %s spectrum with keyboard and resets', async (shape) => {
		render(Wrapper, { pickerProps: { shape } });
		page.getByRole('slider', { name: 'Hue', exact: true }).element().focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByTestId('value')).not.toHaveTextContent('#ff0000');
		await page.getByRole('button', { name: 'Reset', exact: true }).click();
		await expect.element(page.getByTestId('value')).toHaveTextContent('#ff0000');
	});
	it('collapses fields accessibly without losing the color', async () => {
		render(Wrapper, { pickerProps: { collapsed: true } });
		await expect
			.element(page.getByRole('button', { name: 'More', exact: true }))
			.toHaveAttribute('aria-expanded', 'false');
		await page.getByRole('button', { name: 'More', exact: true }).click();
		await expect.element(page.getByRole('textbox', { name: 'Hex', exact: true })).toHaveValue('#ff0000');
		await expect
			.element(page.getByRole('button', { name: 'Less', exact: true }))
			.toHaveAttribute('aria-expanded', 'true');
	});
	it('supports fieldset disabling and excludes its value from submission', async () => {
		render(Wrapper, { fieldsetDisabled: true });
		await expect.element(page.getByRole('slider', { name: 'Hue', exact: true })).toBeDisabled();
		expect([...new FormData(document.querySelector('form')!).entries()]).toEqual([]);
	});
	it.each(['prop', 'fieldset'] as const)(
		'disables every editor with %s without making inputs readonly',
		async (mode) => {
			render(Wrapper, {
				fieldsetDisabled: mode === 'fieldset',
				pickerProps: { alpha: true, disabled: mode === 'prop' }
			});
			for (const name of ['Hex', 'Red', 'Green', 'Blue', 'Opacity']) {
				const input =
					name === 'Hex'
						? page.getByRole('textbox', { name, exact: true })
						: page.getByRole('spinbutton', { name, exact: true });
				await expect.element(input).toBeDisabled();
				expect((input.element() as HTMLInputElement).readOnly).toBe(false);
			}
			for (const name of ['Hue', 'Saturation', 'Brightness', 'Opacity']) {
				await expect.element(page.getByRole('slider', { name, exact: true })).toBeDisabled();
			}
			await expect.element(page.getByRole('combobox', { name: 'Color format', exact: true })).toBeDisabled();
			await expect.element(page.getByRole('button', { name: 'Less', exact: true })).toBeDisabled();
			expect([...new FormData(document.querySelector('form')!).entries()]).toEqual([]);
		}
	);
	it.each(['vertical', 'horizontal'] as const)(
		'updates color and alpha with the %s layout sliders',
		async (orientation) => {
			render(Wrapper, { initial: '#ff000080', pickerProps: { alpha: true, orientation } });
			const brightness = page.getByRole('slider', { name: 'Brightness', exact: true });
			brightness.element().focus();
			await userEvent.keyboard('{ArrowDown}');
			await expect.element(page.getByRole('textbox', { name: 'Hex', exact: true })).not.toHaveValue('#ff000080');
			await userEvent.keyboard('{Home}');
			await expect.element(page.getByRole('textbox', { name: 'Hex', exact: true })).toHaveValue('#00000080');
			await userEvent.keyboard('{End}');
			await expect.element(page.getByTestId('value')).toHaveTextContent('#ff000080');
			page.getByRole('slider', { name: 'Opacity', exact: true }).element().focus();
			await userEvent.keyboard('{Home}');
			await expect.element(page.getByTestId('value')).toHaveTextContent('#ff000000');
			await userEvent.keyboard('{End}');
			await expect.element(page.getByTestId('value')).toHaveTextContent('#ff0000');
			expect(new FormData(document.querySelector('form')!).get('color')).toBe('#ff0000');
		}
	);
	it.each(['vertical', 'horizontal'] as const)(
		'updates the color when pressing %s slider rails',
		async (orientation) => {
			render(Wrapper, { pickerProps: { alpha: true, orientation } });
			for (const channel of ['brightness', 'opacity']) {
				const rail = page.selector(`.${channel} .slider-rail`).element().getBoundingClientRect();
				const at = {
					bubbles: true,
					cancelable: true,
					clientX: rail.left + rail.width / 2,
					clientY: rail.top + rail.height / 2
				};
				page.selector(`.${channel} .fs-slider`).element().dispatchEvent(new MouseEvent('mousedown', at));
				window.dispatchEvent(new MouseEvent('mouseup', at));
				await expect
					.element(page.getByRole('slider', { name: channel === 'brightness' ? 'Brightness' : 'Opacity', exact: true }))
					.toHaveValue('50');
			}
			expect(new FormData(document.querySelector('form')!).get('color')).toMatch(/^#(?:7f|80)000080$/);
		}
	);
	it.each(['square', 'rounded', 'circular'] as const)(
		'moves the %s marker vertically and horizontally with arrow keys',
		async (shape) => {
			render(Wrapper, { initial: '#008080', pickerProps: { shape } });
			const marker = page.selector('.marker').element() as HTMLElement;
			const hue = page.getByRole('slider', { name: 'Hue', exact: true });
			hue.element().focus();
			const x = marker.style.left;
			const y = parseFloat(marker.style.top);
			await userEvent.keyboard('{ArrowDown}');
			await expect.poll(() => parseFloat(marker.style.top)).toBeGreaterThan(y);
			if (shape !== 'circular') expect(marker.style.left).toBe(x);
			const afterDown = marker.style.top;
			const afterX = parseFloat(marker.style.left);
			await userEvent.keyboard('{ArrowLeft}');
			await expect.poll(() => parseFloat(marker.style.left)).toBeLessThan(afterX);
			if (shape !== 'circular') expect(marker.style.top).toBe(afterDown);
			const beforeUp = parseFloat(marker.style.top);
			await userEvent.keyboard('{ArrowUp}');
			await expect.poll(() => parseFloat(marker.style.top)).toBeLessThan(beforeUp);
			const beforeRight = parseFloat(marker.style.left);
			await userEvent.keyboard('{ArrowRight}');
			await expect.poll(() => parseFloat(marker.style.left)).toBeGreaterThan(beforeRight);
			await expect.element(hue).toHaveAttribute('aria-valuetext', expect.stringContaining('Saturation'));
		}
	);
	it('edits RGB fields and preserves alpha', async () => {
		render(Wrapper, { initial: '#ff000080', pickerProps: { alpha: true } });
		await page.getByRole('spinbutton', { name: 'Green', exact: true }).fill('255');
		await expect.element(page.getByTestId('value')).toHaveTextContent('#ffff0080');
	});
	it('normalizes an overflowing channel even when the color is already at its limit', async () => {
		const onColorChange = vi.fn();
		render(Wrapper, { initial: '#ff90ff', pickerProps: { onColorChange } });
		const red = page.getByRole('spinbutton', { name: 'Red', exact: true });
		await red.fill('25555555');
		await expect.element(red).toHaveValue(255);
		expect((red.element() as HTMLInputElement).validity.valid).toBe(true);
		await expect.element(page.getByTestId('value')).toHaveTextContent('#ff90ff');
		expect(onColorChange).not.toHaveBeenCalled();
	});
	it.each(['Red', 'Green', 'Blue'])('limits %s to integers from 0 to 255', async (name) => {
		render(Wrapper, { initial: '#123456' });
		const input = page.getByRole('spinbutton', { name, exact: true });
		for (const [typed, expected] of [
			['-20', '0'],
			['999999', '255'],
			['12.7', '13'],
			['1e5', '255']
		]) {
			await input.fill(typed);
			await expect.element(input).toHaveValue(Number(expected));
			expect((input.element() as HTMLInputElement).validity.valid).toBe(true);
		}
	});
	it('limits HSV and opacity fields to their own ranges', async () => {
		render(Wrapper, { initial: '#008080', pickerProps: { format: 'hsv', alpha: true } });
		for (const [name, max] of [
			['Hue', '360'],
			['Saturation', '100'],
			['Brightness', '100'],
			['Opacity', '100']
		]) {
			const input = page.getByRole('spinbutton', { name, exact: true });
			await input.fill('999999');
			await expect.element(input).toHaveValue(Number(max));
			expect((input.element() as HTMLInputElement).validity.valid).toBe(true);
			await input.fill('-20');
			await expect.element(input).toHaveValue(0);
		}
	});
	it('allows replacing an empty channel and restores an uncommitted empty field on blur', async () => {
		const onColorChange = vi.fn();
		render(Wrapper, { initial: '#123456', pickerProps: { onColorChange } });
		const green = page.getByRole('spinbutton', { name: 'Green', exact: true });
		await green.fill('');
		expect((green.element() as HTMLInputElement).value).toBe('');
		green.element().blur();
		await expect.element(green).toHaveValue(52);
		expect(onColorChange).not.toHaveBeenCalled();
		await green.fill('120');
		await expect.element(green).toHaveValue(120);
		await expect.element(page.getByTestId('value')).toHaveTextContent('#127856');
	});
	it('accepts hexadecimal edits and restores unsupported or incomplete values on blur', async () => {
		render(Wrapper, { initial: '#123456' });
		const input = page.getByRole('textbox', { name: 'Hex', exact: true });
		for (const typed of ['red', '#zzzzzz', '#12', '#1234', '']) {
			await input.fill(typed);
			input.element().blur();
			await expect.element(input).toHaveValue('#123456');
			expect(new FormData(document.querySelector('form')!).get('color')).toBe('#123456');
		}
		await input.fill('ABC');
		input.element().blur();
		await expect.element(input).toHaveValue('#aabbcc');
		expect(new FormData(document.querySelector('form')!).get('color')).toBe('#aabbcc');
		await expect.element(input).toHaveAttribute('maxlength', '7');
	});
	it('accepts hexadecimal alpha only when opacity is enabled', async () => {
		render(Wrapper, { pickerProps: { alpha: true } });
		const input = page.getByRole('textbox', { name: 'Hex', exact: true });
		await input.fill('#abcdef80');
		input.element().blur();
		await expect.element(input).toHaveValue('#abcdef80');
		await expect.element(input).toHaveAttribute('maxlength', '9');
		expect(new FormData(document.querySelector('form')!).get('color')).toBe('#abcdef80');
	});
	it('reports native input and change events from the submitted field', async () => {
		const oninput = vi.fn();
		const onchange = vi.fn();
		render(Wrapper, { pickerProps: { oninput, onchange } });
		page.getByRole('slider', { name: 'Hue', exact: true }).element().focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(oninput).toHaveBeenCalledOnce();
		expect(onchange).toHaveBeenCalledOnce();
		expect((oninput.mock.calls[0][0] as Event).target).toBe(document.querySelector('[name="color"]'));
	});
	it('validates an empty required color and clears the error after editing', async () => {
		render(Wrapper, { initial: '', pickerProps: { required: true } });
		await page.getByRole('button', { name: 'Submit', exact: true }).click();
		const hue = page.getByRole('slider', { name: 'Hue', exact: true });
		await expect.element(hue).toHaveAttribute('aria-invalid', 'true');
		hue.element().focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(hue).not.toHaveAttribute('aria-invalid');
		expect(document.querySelector('form')!.checkValidity()).toBe(true);
	});
	it('clears reported invalid state after an external correction without firing edit events', async () => {
		const onColorChange = vi.fn();
		const onchange = vi.fn();
		render(Wrapper, { initial: '', pickerProps: { required: true, onColorChange, onchange } });
		expect(document.querySelector('form')!.checkValidity()).toBe(false);
		const hue = page.getByRole('slider', { name: 'Hue', exact: true });
		await expect.element(hue).toHaveAttribute('aria-invalid', 'true');
		await page.getByRole('button', { name: 'Set blue' }).click();
		await expect.element(hue).not.toHaveAttribute('aria-invalid');
		expect(document.querySelector('form')!.checkValidity()).toBe(true);
		expect(onColorChange).not.toHaveBeenCalled();
		expect(onchange).not.toHaveBeenCalled();
	});
	it.each([false, true])('focuses a visible control when its label is activated (readonly: %s)', async (readonly) => {
		render(Wrapper, { pickerProps: { readonly } });
		const field = document.querySelector<HTMLInputElement>('input[name="color"]')!;
		const label = document.createElement('label');
		label.htmlFor = field.id;
		label.textContent = 'Choose color';
		document.querySelector('form')!.appendChild(label);
		await page.getByText('Choose color', { exact: true }).click();
		const target = readonly
			? document.querySelector('.fs-color-picker')
			: page.getByRole('slider', { name: 'Hue', exact: true }).element();
		await expect.poll(() => document.activeElement).toBe(target);
	});
	it('keeps focus on the native field while reporting validation', async () => {
		render(Wrapper, { initial: '', pickerProps: { required: true } });
		const field = document.querySelector<HTMLInputElement>('input[name="color"]')!;
		expect(document.querySelector('form')!.reportValidity()).toBe(false);
		await expect.poll(() => document.activeElement).toBe(field);
		expect(field.hasAttribute('aria-hidden')).toBe(false);
	});
	it('keeps readonly colors in the form without allowing edits', async () => {
		render(Wrapper, { pickerProps: { readonly: true } });
		await expect.element(page.getByRole('slider', { name: 'Hue', exact: true })).toBeDisabled();
		const hex = page.getByRole('textbox', { name: 'Hex', exact: true });
		await expect.element(hex).not.toBeDisabled();
		await expect.element(hex).toHaveAttribute('readonly');
		await page.selector('.spectrum').click();
		await expect.element(page.getByTestId('value')).toHaveTextContent('#ff0000');
		expect(new FormData(document.querySelector('form')!).get('color')).toBe('#ff0000');
	});
	it.each(['square', 'rounded', 'circular'] as const)('selects a color with the %s spectrum pointer', async (shape) => {
		render(Wrapper, { pickerProps: { shape } });
		await page.selector('.spectrum').click();
		await expect.element(page.getByTestId('value')).not.toHaveTextContent('#ff0000');
	});
});
