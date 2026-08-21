import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { RadioButton } from '$lib/index.js';
import RadioButtonGroupTestWrapper from './RadioButtonGroupTestWrapper.svelte';

const selection = () => page.getByTestId('selection');

describe('rendering', () => {
	it('renders a radio input wrapped in a label', async () => {
		render(RadioButton);
		await expect.element(page.getByRole('radio')).toBeInTheDocument();
		await expect.element(page.selector('label.fs-radio-button')).toBeInTheDocument();
	});

	it('renders the label text it is given', async () => {
		render(RadioButton, { label: 'Apple' });
		await expect.element(page.getByRole('radio', { name: 'Apple' })).toBeInTheDocument();
	});

	it('leaves out the label span when there is no label', async () => {
		render(RadioButton);
		await expect.element(page.selector('label.fs-radio-button span')).not.toBeInTheDocument();
	});

	it('carries the name and value it is given', async () => {
		render(RadioButton, { name: 'fruit', value: 'apple' });
		const el = page.getByRole('radio');
		await expect.element(el).toHaveAttribute('name', 'fruit');
		await expect.element(el).toHaveAttribute('value', 'apple');
	});
});

describe('checked state', () => {
	it('is unchecked while the group holds a different value', async () => {
		render(RadioButton, { value: 'apple' });
		await expect.element(page.getByRole('radio')).not.toBeChecked();
	});

	it('reflects the checked prop', async () => {
		render(RadioButton, { checked: true });
		await expect.element(page.getByRole('radio')).toBeChecked();
	});

	it('becomes checked when its label is clicked', async () => {
		render(RadioButton, { label: 'Apple', value: 'apple' });
		const input = page.getByRole('radio');
		await expect.element(input).not.toBeChecked();

		await page.getByText('Apple').click();

		await expect.element(input).toBeChecked();
	});
});

describe('disabled', () => {
	it('is disabled when asked', async () => {
		render(RadioButton, { disabled: true });
		await expect.element(page.getByRole('radio')).toBeDisabled();
	});
});

describe('a group', () => {
	it('checks the member matching the bound group value', async () => {
		render(RadioButtonGroupTestWrapper);
		await expect.element(page.getByRole('radio', { name: 'Apple' })).toBeChecked();
		await expect.element(page.getByRole('radio', { name: 'Banana' })).not.toBeChecked();
	});

	it('moves the selection to the member that is clicked', async () => {
		render(RadioButtonGroupTestWrapper);

		await page.getByRole('radio', { name: 'Banana' }).click();

		await expect.element(page.getByRole('radio', { name: 'Banana' })).toBeChecked();
		await expect.element(page.getByRole('radio', { name: 'Apple' })).not.toBeChecked();
	});

	it('reports the new selection through the bound group', async () => {
		render(RadioButtonGroupTestWrapper);
		await expect.element(selection()).toHaveTextContent('apple');

		await page.getByRole('radio', { name: 'Banana' }).click();

		await expect.element(selection()).toHaveTextContent('banana');
	});

	it('leaves a disabled member out of reach', async () => {
		render(RadioButtonGroupTestWrapper);
		await expect.element(page.getByRole('radio', { name: 'Cherry' })).toBeDisabled();
	});
});
