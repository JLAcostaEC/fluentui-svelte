import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { NumberBox } from '$lib/index.js';
import NumberBoxTestWrapper from './NumberBoxTestWrapper.svelte';

const input = () => page.getByRole('spinbutton');
const value = () => page.getByTestId('value');
const increase = () => page.getByRole('button', { name: 'Increase Number' });
const decrease = () => page.getByRole('button', { name: 'Decrease Number' });

describe('rendering', () => {
	it('renders a number input', async () => {
		render(NumberBox);
		await expect.element(input()).toBeInTheDocument();
		await expect.element(input()).toHaveAttribute('type', 'number');
	});

	it('carries the number box class', async () => {
		render(NumberBox);
		await expect.element(page.selector('.fs-number-box')).toBeInTheDocument();
	});

	it('shows the value it is given', async () => {
		render(NumberBox, { value: 7 });
		await expect.element(input()).toHaveValue(7);
	});
});

describe('the inline variant', () => {
	it('puts both steppers inside the input', async () => {
		render(NumberBox);
		await expect.element(increase()).toBeInTheDocument();
		await expect.element(decrease()).toBeInTheDocument();
	});

	it('steps the value up', async () => {
		render(NumberBoxTestWrapper, { value: 4 });

		await increase().click();

		await expect.element(value()).toHaveTextContent('5');
	});

	it('steps the value down', async () => {
		render(NumberBoxTestWrapper, { value: 4 });

		await decrease().click();

		await expect.element(value()).toHaveTextContent('3');
	});

	it('starts counting from 1 when there is no value yet', async () => {
		render(NumberBoxTestWrapper);
		await expect.element(value()).toHaveTextContent('empty');

		await increase().click();

		await expect.element(value()).toHaveTextContent('1');
	});

	it('goes negative from an empty value', async () => {
		render(NumberBoxTestWrapper);

		await decrease().click();

		await expect.element(value()).toHaveTextContent('-1');
	});
});

describe('the compact variant', () => {
	it('replaces the steppers with a single toggle', async () => {
		render(NumberBox, { variant: 'compact' });
		await expect.element(page.getByRole('button', { name: 'Open' })).toBeInTheDocument();
		await expect.element(increase()).not.toBeInTheDocument();
	});

	it('opens the steppers in a flyout', async () => {
		render(NumberBox, { variant: 'compact' });

		await page.getByRole('button', { name: 'Open' }).click();

		await expect.element(increase()).toBeInTheDocument();
		await expect.element(decrease()).toBeInTheDocument();
	});

	it('steps the value from inside the flyout', async () => {
		render(NumberBoxTestWrapper, { variant: 'compact', value: 4 });

		await page.getByRole('button', { name: 'Open' }).click();
		await increase().click();

		await expect.element(value()).toHaveTextContent('5');
	});
});

describe('typing', () => {
	it('reports what is typed through the binding', async () => {
		render(NumberBoxTestWrapper);

		await input().fill('12');

		await expect.element(value()).toHaveTextContent('12');
	});
});
