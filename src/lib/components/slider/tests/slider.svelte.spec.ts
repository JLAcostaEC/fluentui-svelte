import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Slider } from '#lib/index.js';

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

	it('draws a vertical slider from the bottom up, so the maximum is at the top', async () => {
		render(Slider, { orientation: 'vertical', value: 100 });
		const wrapper = page.selector('.fs-slider');
		await expect.element(wrapper).not.toHaveClass('reverse');
		const rail = page.selector('.slider-rail').element().getBoundingClientRect();
		const thumb = page.selector('.slider-thumb').element().getBoundingClientRect();
		expect(thumb.top + thumb.height / 2).toBeLessThanOrEqual(rail.top + 1);
	});

	it('draws a vertical slider from the top down with reverse', async () => {
		render(Slider, { orientation: 'vertical', value: 100, reverse: true });
		const wrapper = page.selector('.fs-slider');
		await expect.element(wrapper).toHaveClass('reverse');
		const rail = page.selector('.slider-rail').element().getBoundingClientRect();
		const thumb = page.selector('.slider-thumb').element().getBoundingClientRect();
		expect(thumb.top + thumb.height / 2).toBeGreaterThanOrEqual(rail.bottom - 1);
	});

	it('takes the value from where the pointer drags a vertical slider', async () => {
		render(Slider, { orientation: 'vertical', value: 50, wrapperAttributes: { style: 'block-size: 200px' } });
		const wrapper = page.selector('.fs-slider');
		const { top } = page.selector('.slider-rail').element().getBoundingClientRect();
		const { top: wrapperTop } = wrapper.element().getBoundingClientRect();
		await userEvent.dragAndDrop(page.selector('.slider-thumb'), wrapper, {
			targetPosition: { x: 16, y: top - wrapperTop }
		});
		await expect.element(page.getByRole('slider')).toHaveValue('100');
	});

	it('keeps its value when a vertical slider has no height to read the pointer on', async () => {
		render(Slider, { orientation: 'vertical', value: 50 });
		const thumb = page.selector('.slider-thumb').element();
		const rail = page.selector('.slider-rail').element().getBoundingClientRect();
		const { left, top } = thumb.getBoundingClientRect();
		thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: left, clientY: top }));
		window.dispatchEvent(new MouseEvent('mousemove', { clientX: left, clientY: rail.top }));
		await expect.element(page.getByRole('slider')).toHaveValue('50');
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

describe('pressing the rail', () => {
	it('moves the value to the pointer with a single press', async () => {
		const onchange = vi.fn();
		render(Slider, { value: 0, onchange });
		const wrapper = page.selector('.fs-slider').element();
		const rail = page.selector('.slider-rail').element().getBoundingClientRect();
		const at = { bubbles: true, cancelable: true, clientX: rail.left + rail.width * 0.75, clientY: rail.top };

		wrapper.dispatchEvent(new MouseEvent('mousedown', at));
		window.dispatchEvent(new MouseEvent('mouseup', at));

		await expect.element(page.getByRole('slider')).toHaveValue('75');
		expect(onchange).toHaveBeenCalledOnce();
	});
});

describe('buffer', () => {
	it('draws no buffer without one', async () => {
		render(Slider);
		await expect.element(page.getByRole('slider')).toBeInTheDocument();
		expect(document.querySelector('.slider-buffer')).toBeNull();
	});

	it('fills the rail up to the buffer, on the scale of the value', async () => {
		render(Slider, { value: 10, min: 0, max: 200, buffer: 100 });
		await expect.element(page.getByRole('slider')).toBeInTheDocument();
		const buffer = document.querySelector('.slider-buffer') as HTMLElement;
		const rail = page.selector('.slider-rail').element().getBoundingClientRect();
		expect(buffer.getBoundingClientRect().width).toBeCloseTo(rail.width / 2, 0);
	});

	it('keeps the buffer inside the rail', async () => {
		render(Slider, { buffer: 500 });
		await expect.element(page.getByRole('slider')).toBeInTheDocument();
		const buffer = document.querySelector('.slider-buffer') as HTMLElement;
		expect(buffer.style.getPropertyValue('--slider-buffer-percentage')).toBe('100%');
	});
});
