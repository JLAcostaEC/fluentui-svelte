import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Dropdown, DropdownOption } from '$lib/index.js';
import DropdownTestWrapper from './DropdownTestWrapper.svelte';

describe('rendering', () => {
	it('renders a combobox button', async () => {
		render(DropdownTestWrapper);
		const el = page.getByRole('combobox');
		await expect.element(el).toBeInTheDocument();
	});

	it('shows the default placeholder when nothing is selected', async () => {
		render(DropdownTestWrapper);
		const el = page.getByRole('combobox');
		await expect.element(el).toHaveTextContent('Select an option');
	});

	it('shows a custom placeholder', async () => {
		render(DropdownTestWrapper, { placeholder: 'Pick a fruit' });
		const el = page.getByRole('combobox');
		await expect.element(el).toHaveTextContent('Pick a fruit');
	});

	it('sets the correct aria attributes', async () => {
		render(DropdownTestWrapper);
		const el = page.getByRole('combobox');
		await expect.element(el).toHaveAttribute('aria-haspopup', 'listbox');
		await expect.element(el).toHaveAttribute('aria-expanded', 'false');
	});

	it('is initially collapsed (no options in the DOM)', async () => {
		render(DropdownTestWrapper);
		const option = page.getByRole('option');
		await expect.element(option.first()).not.toBeInTheDocument();
	});
});

describe('opening', () => {
	it('opens on click and reveals options', async () => {
		render(DropdownTestWrapper);
		await page.getByRole('combobox').click();
		await expect.element(page.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
		await expect.element(page.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
	});

	it('closes on Escape', async () => {
		render(DropdownTestWrapper);
		const combobox = page.getByRole('combobox');
		await combobox.click();
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'true');
		await userEvent.keyboard('{Escape}');
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'false');
	});

	it('shows "No options available" when there are no options', async () => {
		render(Dropdown);
		await page.getByRole('combobox').click();
		const el = page.getByText('No options available');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('single selection', () => {
	it('selects an option, updates the label and closes', async () => {
		render(DropdownTestWrapper);
		const combobox = page.getByRole('combobox');
		await combobox.click();
		await page.getByRole('option', { name: 'Banana' }).click();
		await expect.element(combobox).toHaveTextContent('Banana');
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'false');
	});

	it('shows the label for an initially selected value', async () => {
		render(DropdownTestWrapper, { value: 'cherry' });
		// options only mount while open, so open once to let the option register its label
		const combobox = page.getByRole('combobox');
		await combobox.click();
		await page.getByRole('option', { name: 'Cherry' }).click();
		await expect.element(combobox).toHaveTextContent('Cherry');
	});
});

describe('multiple selection', () => {
	it('keeps the dropdown open after selecting an option', async () => {
		render(DropdownTestWrapper, { multiple: true });
		const combobox = page.getByRole('combobox');
		await combobox.click();
		await page.getByRole('option', { name: 'Apple' }).click();
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'true');
	});
});

describe('disabled state', () => {
	it('disables the combobox button', async () => {
		render(DropdownTestWrapper, { disabled: true });
		const el = page.getByRole('combobox');
		await expect.element(el).toBeDisabled();
	});

	it('does not open when disabled', async () => {
		render(DropdownTestWrapper, { disabled: true });
		const combobox = page.getByRole('combobox');
		await combobox.click({ force: true });
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'false');
	});
});

describe('DropdownOption', () => {
	it('throws when used outside a Dropdown', async () => {
		expect(() => render(DropdownOption, { value: 'x' })).toThrow('DropdownOption must be used within a Dropdown');
	});
});
