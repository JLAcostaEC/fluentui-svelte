import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { AutoSuggestBoxOption } from '$lib/index.js';
import AutoSuggestBoxTestWrapper from './AutoSuggestBoxTestWrapper.svelte';

const combobox = () => page.getByRole('combobox');

/** The option the combobox announces as active, or '' when there is none. */
function activeOption() {
	const input = document.querySelector('input[role="combobox"]');
	return input?.getAttribute('aria-activedescendant') || '';
}

/**
 * Put the caret in the text box. Clicking is not an option: the flyout is
 * absolutely positioned over the text box, so it swallows the pointer.
 */
function focusInput() {
	document.querySelector<HTMLInputElement>('input[role="combobox"]')?.focus();
}

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

	it('collects every chosen option in multiselect mode', async () => {
		render(AutoSuggestBoxTestWrapper, { multiselect: true, open: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}{Enter}');
		await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveClass(/active/);
		await expect.element(page.getByRole('option', { name: 'Banana' })).toHaveClass(/active/);
	});

	it('lists the chosen options in the text box when showTextualMultiselect is set', async () => {
		render(AutoSuggestBoxTestWrapper, { multiselect: true, showTextualMultiselect: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}{Enter}');
		await expect.element(combobox()).toHaveValue('apple');

		await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
		await expect.element(combobox()).toHaveValue('apple, banana');
	});

	it('keeps the list open after selecting in multiselect mode', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true, multiselect: true });
		const input = page.getByRole('combobox');
		await page.getByRole('option', { name: 'Apple' }).click();
		await expect.element(input).toHaveAttribute('aria-expanded', 'true');
	});
});

describe('keyboard navigation', () => {
	it('opens the list and activates the first option on ArrowDown', async () => {
		render(AutoSuggestBoxTestWrapper);
		focusInput();

		await userEvent.keyboard('{ArrowDown}');

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));
	});

	it('walks down the list', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('banana'));
	});

	it('walks back up the list', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('banana'));

		await userEvent.keyboard('{ArrowUp}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));
	});

	it('activates the last option on ArrowUp from the text box', async () => {
		render(AutoSuggestBoxTestWrapper);
		focusInput();

		await userEvent.keyboard('{ArrowUp}');

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
		await vi.waitFor(() => expect(activeOption()).toBe('cherry'));
	});

	it('leaves the list when ArrowUp passes the first option', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('{ArrowUp}');
		await vi.waitFor(() => expect(activeOption()).toBe(''));
	});

	it('leaves the list when ArrowDown passes the last option', async () => {
		render(AutoSuggestBoxTestWrapper);
		focusInput();

		await userEvent.keyboard('{ArrowUp}');
		await vi.waitFor(() => expect(activeOption()).toBe('cherry'));

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe(''));
	});

	it('steps over disabled options', async () => {
		render(AutoSuggestBoxTestWrapper, {
			open: true,
			options: [
				{ value: 'apple', text: 'Apple' },
				{ value: 'banana', text: 'Banana', disabled: true },
				{ value: 'cherry', text: 'Cherry' }
			]
		});
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('cherry'));
	});

	it('chooses the active option on Enter and closes', async () => {
		const suggestionChosen = vi.fn();
		render(AutoSuggestBoxTestWrapper, { suggestionChosen });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));
		await userEvent.keyboard('{Enter}');

		await expect.element(combobox()).toHaveValue('Apple');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
		expect(suggestionChosen).toHaveBeenCalledWith(expect.anything(), 'apple');
	});

	it('submits the query on Enter when no option is active', async () => {
		const querySubmitted = vi.fn();
		render(AutoSuggestBoxTestWrapper, { querySubmitted });
		focusInput();

		await userEvent.keyboard('{Enter}');

		expect(querySubmitted).toHaveBeenCalled();
	});

	it('leaves Home and End to the text caret', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('{Home}{End}');

		expect(activeOption()).toBe('apple');
	});

	it('stops announcing an active option once closed', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('{Escape}');

		await vi.waitFor(() => expect(activeOption()).toBe(''));
	});

	it('closes on Escape', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{Escape}');

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
	});
});

describe('selectOnFocus', () => {
	it('fills the text box with the option being walked over', async () => {
		render(AutoSuggestBoxTestWrapper, { selectOnFocus: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');

		await expect.element(combobox()).toHaveValue('Apple');
	});

	it('restores what was typed when the list is left', async () => {
		render(AutoSuggestBoxTestWrapper, { selectOnFocus: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await expect.element(combobox()).toHaveValue('Apple');

		await userEvent.keyboard('{ArrowUp}');
		await expect.element(combobox()).toHaveValue('');
	});
});

describe('filtering', () => {
	it('shows the not-found text when nothing matches the query', async () => {
		render(AutoSuggestBoxTestWrapper);
		await combobox().fill('zzz');

		await expect.element(page.getByText('No results found')).toBeInTheDocument();
	});

	it('highlights the option the query is a prefix of', async () => {
		render(AutoSuggestBoxTestWrapper);
		await combobox().fill('Ban');

		await vi.waitFor(() => expect(activeOption()).toBe('banana'));
	});

	it('chooses the highlighted option on Enter after typing', async () => {
		const querySubmitted = vi.fn();
		const suggestionChosen = vi.fn();
		render(AutoSuggestBoxTestWrapper, { querySubmitted, suggestionChosen });
		await combobox().fill('App');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('{Enter}');

		expect(suggestionChosen).toHaveBeenCalledWith(expect.anything(), 'apple');
		expect(querySubmitted).not.toHaveBeenCalled();
		await expect.element(combobox()).toHaveValue('Apple');
	});

	it('submits the query on Enter when the query matches nothing', async () => {
		const querySubmitted = vi.fn();
		const suggestionChosen = vi.fn();
		render(AutoSuggestBoxTestWrapper, { querySubmitted, suggestionChosen });
		await combobox().fill('zzz');
		await vi.waitFor(() => expect(activeOption()).toBe(''));

		await userEvent.keyboard('{Enter}');

		expect(querySubmitted).toHaveBeenCalledWith(expect.anything(), 'zzz');
		expect(suggestionChosen).not.toHaveBeenCalled();
	});

	it('walks on from the highlighted option', async () => {
		render(AutoSuggestBoxTestWrapper);
		await combobox().fill('a');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() => expect(activeOption()).toBe('banana'));
	});

	it('does not type over the query when selectOnFocus is set', async () => {
		render(AutoSuggestBoxTestWrapper, { selectOnFocus: true });
		await combobox().fill('Ban');

		await vi.waitFor(() => expect(activeOption()).toBe('banana'));
		await expect.element(combobox()).toHaveValue('Ban');
	});

	it('marks the option under the cursor', async () => {
		render(AutoSuggestBoxTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');

		await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveAttribute('data-active', 'true');
	});

	it('drops filtered out options from keyboard navigation', async () => {
		render(AutoSuggestBoxTestWrapper);
		await combobox().fill('an');

		// Only Banana and Mango-like matches survive; Apple and Cherry are gone.
		await expect.element(page.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
		await expect.element(page.getByRole('option', { name: 'Apple' })).not.toBeInTheDocument();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('banana'));
	});
});

describe('validation', () => {
	it('throws when selectOnFocus and multiselect are both enabled', async () => {
		await expect(render(AutoSuggestBoxTestWrapper, { selectOnFocus: true, multiselect: true })).rejects.toThrow(
			'selectOnFocus is not supported when multiselect is true'
		);
	});
});

describe('AutoSuggestBoxOption', () => {
	it('throws when used outside an AutoSuggestBox', async () => {
		await expect(render(AutoSuggestBoxOption, { index: 0 })).rejects.toThrow(
			'AutoSuggestOption must be used within an AutoSuggestBox'
		);
	});
});
