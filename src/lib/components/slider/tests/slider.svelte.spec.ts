import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Slider } from '$lib/index.js';

describe('rendering', () => {
	it('renders a native range input as the slider', async () => {
		render(Slider);
		const el = page.getByRole('slider');
		await expect.element(el).toBeInTheDocument();
		expect(el.element()).toBeInstanceOf(HTMLInputElement);
	});

	it('applies the base fs-slider class', async () => {
		render(Slider);
		const el = page.selector('.fs-slider');
		await expect.element(el).toBeInTheDocument();
	});

	it('keeps the range input in the thumb, out of sight, reflecting min/max/step', async () => {
		render(Slider, { min: 10, max: 50, step: 5, value: 20 });
		const input = page.selector('input[type="range"]');
		await expect.element(input).toHaveAttribute('min', '10');
		await expect.element(input).toHaveAttribute('max', '50');
		await expect.element(input).toHaveAttribute('step', '5');
		expect(input.element().closest('.slider-thumb')).not.toBeNull();
		expect(getComputedStyle(input.element()).opacity).toBe('0');
	});

	it('renders the track by default', async () => {
		render(Slider);
		const track = page.selector('.slider-track');
		await expect.element(track).toBeInTheDocument();
	});

	it('does not render the track when track={false}', async () => {
		render(Slider, { track: false });
		const track = page.selector('.slider-track');
		await expect.element(track).not.toBeInTheDocument();
	});

	it('renders a tick per value in ticks', async () => {
		render(Slider, { ticks: [0, 25, 50, 75, 100] });
		const ticks = page.selector('.slider-tick');
		await expect.element(ticks.nth(0)).toBeInTheDocument();
		await expect.element(ticks.nth(4)).toBeInTheDocument();
	});
});

describe('range semantics', () => {
	it('exposes the range and the value through the native input', async () => {
		render(Slider, { min: 0, max: 100, value: 40 });
		const el = page.getByRole('slider');
		await expect.element(el).toHaveAttribute('min', '0');
		await expect.element(el).toHaveAttribute('max', '100');
		await expect.element(el).toHaveValue('40');
	});

	it('defaults the value to 0', async () => {
		render(Slider);
		await expect.element(page.getByRole('slider')).toHaveValue('0');
	});

	it('falls back to a generic name when nothing names it', async () => {
		render(Slider);
		await expect.element(page.getByRole('slider')).toHaveAccessibleName('Slider');
	});

	it('announces the prefix and suffix with the value', async () => {
		render(Slider, { value: 40, prefix: '$', suffix: ' USD' });
		await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuetext', '$40 USD');
	});
});

describe('value clamping', () => {
	it('clamps a value above max down to max and calls onChange', async () => {
		const onChange = vi.fn();
		render(Slider, { min: 0, max: 100, value: 150, onChange });
		const el = page.getByRole('slider');
		await expect.element(el).toHaveValue('100');
		expect(onChange).toHaveBeenCalledWith(100);
	});

	it('clamps a value below min up to min', async () => {
		render(Slider, { min: 10, max: 100, value: -5 });
		const el = page.getByRole('slider');
		await expect.element(el).toHaveValue('10');
	});
});

describe('orientation', () => {
	it('applies orientation-horizontal by default', async () => {
		render(Slider);
		const el = page.selector('.fs-slider');
		await expect.element(el).toHaveClass('orientation-horizontal');
	});

	it('applies orientation-vertical when orientation="vertical"', async () => {
		render(Slider, { orientation: 'vertical' });
		const el = page.selector('.fs-slider');
		await expect.element(el).toHaveClass('orientation-vertical');
	});
});

describe('disabled state', () => {
	it('applies the disabled class', async () => {
		render(Slider, { disabled: true });
		const el = page.selector('.fs-slider');
		await expect.element(el).toHaveClass('disabled');
	});

	it('disables the native input', async () => {
		render(Slider, { disabled: true });
		await expect.element(page.getByRole('slider')).toBeDisabled();
	});

	it('takes the keyboard focus on the native input when enabled', async () => {
		render(Slider);
		// The first Tab of a test can leave the page, unless something in it was clicked first.
		await userEvent.click(document.body);
		await userEvent.tab();
		await expect.element(page.getByRole('slider')).toHaveFocus();
	});
});

describe('keyboard interaction', () => {
	it('increments the value with ArrowRight', async () => {
		render(Slider, { value: 50, step: 1 });
		const el = page.getByRole('slider');
		(el.element() as HTMLElement).focus();
		await expect.element(el).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(el).toHaveValue('51');
	});

	it('decrements the value with ArrowLeft', async () => {
		render(Slider, { value: 50, step: 1 });
		const el = page.getByRole('slider');
		(el.element() as HTMLElement).focus();
		await expect.element(el).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(el).toHaveValue('49');
	});

	it('does not step above max', async () => {
		render(Slider, { value: 100, max: 100, step: 1 });
		const el = page.getByRole('slider');
		(el.element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(el).toHaveValue('100');
	});
});

describe('validation', () => {
	it('throws when step is larger than the range', async () => {
		await expect(render(Slider, { min: 0, max: 100, step: 200 })).rejects.toThrow(
			'Step must be less than or equal to the difference between max and min'
		);
	});
});

describe('attributes', () => {
	it('forwards extra attributes to the native input and wrapperAttributes to the drawing', async () => {
		render(Slider, { 'data-testid': 'my-slider', wrapperAttributes: { 'data-testid': 'my-drawing' } });
		expect(page.getByTestId('my-slider').element()).toBe(page.getByRole('slider').element());
		await expect.element(page.getByTestId('my-drawing')).toHaveClass('fs-slider');
	});
});
