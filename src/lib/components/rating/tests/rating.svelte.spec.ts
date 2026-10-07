import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { HeartFilled, HeartRegular } from 'fluentui-icons-svelte';
import { Rating, type RatingProps } from '$lib/index.js';

const radios = () => Array.from(document.querySelectorAll<HTMLInputElement>('.fs-rating input'));

describe('rendering', () => {
	it('renders a radiogroup with the base fs-rating class', async () => {
		render(Rating);
		await expect.element(page.getByRole('radiogroup')).toHaveClass('fs-rating');
	});

	it('provides a default accessible name', async () => {
		render(Rating);
		await expect.element(page.getByRole('radiogroup')).toHaveAccessibleName('Rating');
	});

	it('preserves a consumer-provided accessible label', async () => {
		const props: RatingProps = { 'aria-label': 'Product quality' };
		render(Rating, props);
		await expect.element(page.getByRole('radiogroup')).toHaveAccessibleName('Product quality');
	});

	it('preserves aria-labelledby without adding a default label', async () => {
		const label = document.createElement('span');
		label.id = 'rating-label';
		label.textContent = 'Product quality';
		document.body.appendChild(label);
		try {
			render(Rating, { 'aria-labelledby': label.id });
			await expect.element(page.getByRole('radiogroup')).toHaveAccessibleName('Product quality');
			await expect.element(page.getByRole('radiogroup')).toHaveAttribute('aria-labelledby', label.id);
			await expect.element(page.getByRole('radiogroup')).not.toHaveAttribute('aria-label');
		} finally {
			label.remove();
		}
	});

	it('preserves both supplied naming attributes', async () => {
		render(Rating, { 'aria-label': 'Quality', 'aria-labelledby': 'quality-label' });
		await expect.element(page.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Quality');
		await expect.element(page.getByRole('radiogroup')).toHaveAttribute('aria-labelledby', 'quality-label');
	});

	it('renders 5 radios by default', async () => {
		render(Rating);
		expect(radios()).toHaveLength(5);
	});

	it('renders max items', async () => {
		render(Rating, { max: 8 });
		expect(radios()).toHaveLength(8);
	});

	it('renders two radios per item when step is 0.5', async () => {
		render(Rating, { step: 0.5 });
		expect(radios()).toHaveLength(10);
	});

	it('applies the extra-large size by default', async () => {
		render(Rating);
		await expect.element(page.getByRole('radiogroup')).toHaveClass('size-extra-large');
	});

	it('applies the requested size', async () => {
		render(Rating, { size: 'small' });
		await expect.element(page.getByRole('radiogroup')).toHaveClass('size-small');
	});
});

describe('value', () => {
	it('checks the radio matching the value', async () => {
		render(Rating, { value: 3 });
		await expect.element(page.getByRole('radio', { name: '3', exact: true })).toBeChecked();
	});

	it('checks half values when step is 0.5', async () => {
		render(Rating, { value: 2.5, step: 0.5 });
		await expect.element(page.getByRole('radio', { name: '2.5' })).toBeChecked();
	});

	it.each([
		{ value: 0, step: 1, choice: undefined },
		{ value: 0, step: 0.5, choice: undefined },
		{ value: 0.1, step: 1, choice: '1' },
		{ value: 0.1, step: 0.5, choice: '0.5' },
		{ value: 2.25, step: 1, choice: '2' },
		{ value: 2.75, step: 1, choice: '3' },
		{ value: 2.25, step: 0.5, choice: '2.5' },
		{ value: 2.6, step: 0.5, choice: '2.5' },
		{ value: 4.9, step: 1, choice: '5' }
	] as const)('checks $choice for value=$value and step=$step', async ({ value, step, choice }) => {
		render(Rating, { value, step });
		expect(
			radios()
				.filter((radio) => radio.checked)
				.map((radio) => radio.value)
		).toEqual(choice ? [choice] : []);
		await expect
			.element(page.getByRole('radiogroup'))
			.toHaveAccessibleDescription(`Current rating: ${value} out of 5.`);
	});

	it('keeps consumer descriptions alongside the exact value and updates it with props', async () => {
		const description = document.createElement('span');
		description.id = 'rating-help';
		description.textContent = 'Rate this product.';
		document.body.appendChild(description);
		try {
			const screen = await render(Rating, { value: 2.25, 'aria-describedby': description.id });
			await expect
				.element(page.getByRole('radiogroup'))
				.toHaveAccessibleDescription('Rate this product. Current rating: 2.25 out of 5.');
			await screen.rerender({ value: 3.75 });
			await expect
				.element(page.getByRole('radiogroup'))
				.toHaveAccessibleDescription('Rate this product. Current rating: 3.75 out of 5.');
			await expect.element(page.getByRole('radio', { name: '4', exact: true })).toBeChecked();
		} finally {
			description.remove();
		}
	});

	it('uses itemLabel for the aria-label of each radio', async () => {
		render(Rating, { itemLabel: (rating) => `${rating} stars` });
		await expect.element(page.getByRole('radio', { name: '4 stars' })).toBeInTheDocument();
	});

	it('shares one name between all the radios', async () => {
		render(Rating, { name: 'quality' });
		expect(new Set(radios().map((r) => r.name))).toEqual(new Set(['quality']));
	});
});

describe('icons', () => {
	const icons = () => Array.from(document.querySelectorAll('.rating-icon'));

	it('marks the stars up to the value as selected', async () => {
		render(Rating, { value: 3 });
		expect(icons().map((i) => i.classList.contains('selected'))).toEqual([true, true, true, false, false]);
	});

	it('draws the fraction of an unrated value in quarters', async () => {
		render(Rating, { value: 2.25 });
		const paths = icons().map((i) => i.querySelector('path')?.getAttribute('d'));
		// 2 whole stars, a quarter star, 2 empty stars: the quarter differs from both
		expect(new Set(paths).size).toBe(3);
		expect(icons().map((i) => i.classList.contains('selected'))).toEqual([true, true, true, false, false]);
	});
});

describe('interaction', () => {
	it('calls onChange and updates the value when a star is picked', async () => {
		const onChange = vi.fn();
		render(Rating, { onChange });
		await page.getByRole('radio', { name: '4' }).click({ force: true });
		expect(onChange).toHaveBeenCalledWith(4);
		await expect.element(page.getByRole('radio', { name: '4' })).toBeChecked();
	});

	it('picks half values by clicking the first half of a star', async () => {
		const onChange = vi.fn();
		render(Rating, { step: 0.5, onChange });
		await page.getByRole('radio', { name: '2.5' }).click({ force: true });
		expect(onChange).toHaveBeenCalledWith(2.5);
	});

	it('moves the rating with the arrow keys', async () => {
		const onChange = vi.fn();
		render(Rating, { value: 2, onChange });
		(document.querySelector('input[type="radio"]:checked') as HTMLInputElement).focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(onChange).toHaveBeenCalledWith(3);
	});

	it('selects the rounded choice when it is already checked for a fractional value', async () => {
		const onChange = vi.fn();
		render(Rating, { value: 2.25, onChange });
		await page.getByRole('radio', { name: '2', exact: true }).click({ force: true });
		expect(onChange).toHaveBeenCalledExactlyOnceWith(2);
		await expect.element(page.getByRole('radiogroup')).toHaveAccessibleDescription('Current rating: 2 out of 5.');
	});

	it('moves from the nearest choice using the keyboard', async () => {
		const onChange = vi.fn();
		render(Rating, { value: 2.25, step: 0.5, onChange });
		radios()
			.find((radio) => radio.checked)
			?.focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(onChange).toHaveBeenCalledExactlyOnceWith(3);
		await expect.element(page.getByRole('radiogroup')).toHaveAccessibleDescription('Current rating: 3 out of 5.');
	});

	it('snaps an unrated fraction to the step once the user rates', async () => {
		render(Rating, { value: 2.25 });
		await page.getByRole('radio', { name: '3', exact: true }).click({ force: true });
		const selected = Array.from(document.querySelectorAll('.rating-icon.selected'));
		expect(selected).toHaveLength(3);
	});
});

describe('custom icons', () => {
	it('renders the custom icons and clips the filled one to the value', async () => {
		render(Rating, { value: 2.5, step: 0.5, iconFilled: HeartFilled, iconOutline: HeartRegular });
		const icons = Array.from(document.querySelectorAll<HTMLElement>('.rating-icon.custom'));
		expect(icons).toHaveLength(5);
		expect(icons.map((i) => i.style.getPropertyValue('--rating-fill'))).toEqual(['100%', '100%', '50%', '0%', '0%']);
	});
});
