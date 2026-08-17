import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Slider } from '$lib/index.js';

describe('rendering', () => {
	it('renders an element with role="slider"', async () => {
		render(Slider);
		const el = page.getByRole('slider');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies the base fs-slider class', async () => {
		render(Slider);
		const el = page.selector('.fs-slider');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders a hidden range input reflecting min/max/step', async () => {
		render(Slider, { min: 10, max: 50, step: 5, value: 20 });
		const input = page.selector('input[type="range"]');
		await expect.element(input).toHaveAttribute('min', '10');
		await expect.element(input).toHaveAttribute('max', '50');
		await expect.element(input).toHaveAttribute('step', '5');
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

describe('aria attributes', () => {
	it('exposes aria-valuemin, aria-valuemax and aria-valuenow', async () => {
		render(Slider, { min: 0, max: 100, value: 40 });
		const el = page.getByRole('slider');
		await expect.element(el).toHaveAttribute('aria-valuemin', '0');
		await expect.element(el).toHaveAttribute('aria-valuemax', '100');
		await expect.element(el).toHaveAttribute('aria-valuenow', '40');
	});

	it('defaults aria-valuenow to 0', async () => {
		render(Slider);
		const el = page.getByRole('slider');
		await expect.element(el).toHaveAttribute('aria-valuenow', '0');
	});
});

describe('value clamping', () => {
	it('clamps a value above max down to max and calls onChange', async () => {
		const onChange = vi.fn();
		render(Slider, { min: 0, max: 100, value: 150, onChange });
		const el = page.getByRole('slider');
		await expect.element(el).toHaveAttribute('aria-valuenow', '100');
		expect(onChange).toHaveBeenCalledWith(100);
	});

	it('clamps a value below min up to min', async () => {
		render(Slider, { min: 10, max: 100, value: -5 });
		const el = page.getByRole('slider');
		await expect.element(el).toHaveAttribute('aria-valuenow', '10');
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

	it('sets tabindex to -1 when disabled', async () => {
		render(Slider, { disabled: true });
		const el = page.getByRole('slider');
		await expect.element(el).toHaveAttribute('tabindex', '-1');
	});

	it('sets tabindex to 0 when enabled', async () => {
		render(Slider);
		const el = page.getByRole('slider');
		await expect.element(el).toHaveAttribute('tabindex', '0');
	});
});

describe('keyboard interaction', () => {
	it('increments the value with ArrowRight', async () => {
		render(Slider, { value: 50, step: 1 });
		const el = page.getByRole('slider');
		(el.element() as HTMLElement).focus();
		await expect.element(el).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(el).toHaveAttribute('aria-valuenow', '51');
	});

	it('decrements the value with ArrowLeft', async () => {
		render(Slider, { value: 50, step: 1 });
		const el = page.getByRole('slider');
		(el.element() as HTMLElement).focus();
		await expect.element(el).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(el).toHaveAttribute('aria-valuenow', '49');
	});

	it('does not step above max', async () => {
		render(Slider, { value: 100, max: 100, step: 1 });
		const el = page.getByRole('slider');
		(el.element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(el).toHaveAttribute('aria-valuenow', '100');
	});
});

describe('validation', () => {
	it('throws when step is larger than the range', async () => {
		expect(() => render(Slider, { min: 0, max: 100, step: 200 })).toThrow(
			'Step must be less than or equal to the difference between max and min'
		);
	});
});

describe('attributes', () => {
	it('forwards extra attributes to the root element', async () => {
		render(Slider, { 'data-testid': 'my-slider' });
		const el = page.getByTestId('my-slider');
		await expect.element(el).toBeInTheDocument();
	});
});
