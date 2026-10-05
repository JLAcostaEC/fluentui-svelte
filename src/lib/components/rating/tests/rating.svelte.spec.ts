import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { HeartFilled, HeartRegular } from 'fluentui-icons-svelte';
import { Rating } from '$lib/index.js';

const radios = () => Array.from(document.querySelectorAll<HTMLInputElement>('.fs-rating input'));

describe('rendering', () => {
	it('renders a radiogroup with the base fs-rating class', async () => {
		render(Rating);
		await expect.element(page.getByRole('radiogroup')).toHaveClass('fs-rating');
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
