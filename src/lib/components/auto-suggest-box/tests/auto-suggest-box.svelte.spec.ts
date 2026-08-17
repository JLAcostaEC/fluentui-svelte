import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { AutoSuggestBoxOption } from '$lib/index.js';
import AutoSuggestBoxTestWrapper from './AutoSuggestBoxTestWrapper.svelte';

describe('rendering', () => {
	it('renders a combobox input', async () => {
		render(AutoSuggestBoxTestWrapper);
		const el = page.getByRole('combobox');
		await expect.element(el).toBeInTheDocument();
	});

	it('sets the correct aria attributes', async () => {
		render(AutoSuggestBoxTestWrapper);
		const el = page.getByRole('combobox');
		await expect.element(el).toHaveAttribute('aria-autocomplete', 'list');
		await expect.element(el).toHaveAttribute('aria-haspopup', 'listbox');
	});

	it('is collapsed by default', async () => {
		render(AutoSuggestBoxTestWrapper);
		const el = page.getByRole('combobox');
		await expect.element(el).toHaveAttribute('aria-expanded', 'false');
	});

	it('renders a custom placeholder', async () => {
		render(AutoSuggestBoxTestWrapper, { placeholder: 'Search fruits' });
		const el = page.getByRole('combobox');
		await expect.element(el).toHaveAttribute('placeholder', 'Search fruits');
	});
});

describe('open state', () => {
	it('shows the option list when open', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true });
		const el = page.getByRole('option', { name: 'Apple' });
		await expect.element(el).toBeInTheDocument();
	});

	it('reflects the open state in aria-expanded', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true });
		const el = page.getByRole('combobox');
		await expect.element(el).toHaveAttribute('aria-expanded', 'true');
	});

	it('opens the list when typing', async () => {
		render(AutoSuggestBoxTestWrapper);
		const input = page.getByRole('combobox');
		await input.fill('App');
		await expect.element(input).toHaveAttribute('aria-expanded', 'true');
		await expect.element(page.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
	});

	it('filters options based on the typed value', async () => {
		render(AutoSuggestBoxTestWrapper);
		const input = page.getByRole('combobox');
		await input.fill('Ban');
		await expect.element(page.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
		await expect.element(page.getByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
	});

	it('shows the not-found text when there are no options', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true, options: [] });
		const el = page.getByText('No results found');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('selection', () => {
	it('sets the input value and closes when an option is clicked', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true });
		const input = page.getByRole('combobox');
		await page.getByRole('option', { name: 'Banana' }).click();
		await expect.element(input).toHaveValue('Banana');
		await expect.element(input).toHaveAttribute('aria-expanded', 'false');
	});

	it('keeps the list open after selecting in multiselect mode', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true, multiselect: true });
		const input = page.getByRole('combobox');
		await page.getByRole('option', { name: 'Apple' }).click();
		await expect.element(input).toHaveAttribute('aria-expanded', 'true');
	});
});

describe('validation', () => {
	it('throws when selectOnFocus and multiselect are both enabled', async () => {
		expect(() => render(AutoSuggestBoxTestWrapper, { selectOnFocus: true, multiselect: true })).toThrow(
			'selectOnFocus is not supported when multiselect is true'
		);
	});
});

describe('AutoSuggestBoxOption', () => {
	it('throws when used outside an AutoSuggestBox', async () => {
		expect(() => render(AutoSuggestBoxOption, { index: 0 })).toThrow(
			'AutoSuggestOption must be used within an AutoSuggestBox'
		);
	});
});
