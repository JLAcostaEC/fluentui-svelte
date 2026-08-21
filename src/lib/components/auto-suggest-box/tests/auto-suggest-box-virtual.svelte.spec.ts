import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AutoSuggestBoxVirtualTestWrapper from './AutoSuggestBoxVirtualTestWrapper.svelte';
import AutoSuggestBoxDocsTestWrapper from './AutoSuggestBoxDocsTestWrapper.svelte';
import { fake } from '$constants';

/**
 * The windowed list only ever has a slice of its options in the DOM, so these
 * tests are about the two things that slice makes hard: walking onto an option
 * that is not rendered yet, and knowing where the list really ends.
 */

const combobox = () => page.getByRole('combobox');

function activeOption() {
	const input = document.querySelector('input[role="combobox"]');
	return input?.getAttribute('aria-activedescendant') || '';
}

function focusInput() {
	document.querySelector<HTMLInputElement>('input[role="combobox"]')?.focus();
}

const renderedOptions = () => document.querySelectorAll('.fs-autosuggest-option').length;

async function walk(key: 'ArrowDown' | 'ArrowUp', times: number) {
	for (let i = 0; i < times; i++) await userEvent.keyboard(`{${key}}`);
}

describe('virtualized suggestions', () => {
	it('renders a window instead of the whole list', async () => {
		render(AutoSuggestBoxVirtualTestWrapper, { open: true });
		await expect.element(page.getByRole('option', { name: 'Item 0' })).toBeInTheDocument();

		expect(renderedOptions()).toBeLessThan(60);
	});

	it('opens on the first option', async () => {
		render(AutoSuggestBoxVirtualTestWrapper);
		focusInput();

		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() => expect(activeOption()).toBe('item-0'));
	});

	it('walks past the rendered window', async () => {
		render(AutoSuggestBoxVirtualTestWrapper, { open: true });
		focusInput();

		await walk('ArrowDown', 30);

		await vi.waitFor(() => expect(activeOption()).toBe('item-29'));
		await expect.element(page.getByRole('option', { name: 'Item 29' })).toBeInTheDocument();
	});

	it('opens on the last option of the whole list, not of the window', async () => {
		render(AutoSuggestBoxVirtualTestWrapper);
		focusInput();

		await userEvent.keyboard('{ArrowUp}');

		await vi.waitFor(() => expect(activeOption()).toBe('item-59'), { timeout: 3000 });
	});

	it('returns the query when it walks off the end', async () => {
		render(AutoSuggestBoxVirtualTestWrapper);
		focusInput();

		await userEvent.keyboard('{ArrowUp}');
		await vi.waitFor(() => expect(activeOption()).toBe('item-59'), { timeout: 3000 });

		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() => expect(activeOption()).toBe(''));
	});

	it('chooses the option under the cursor on Enter', async () => {
		const suggestionChosen = vi.fn();
		render(AutoSuggestBoxVirtualTestWrapper, { suggestionChosen });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('item-0'));

		await userEvent.keyboard('{Enter}');

		expect(suggestionChosen).toHaveBeenCalledWith(expect.anything(), 'Item 0');
		await expect.element(combobox()).toHaveValue('Item 0');
	});

	it('chooses an option the window had to scroll to', async () => {
		const suggestionChosen = vi.fn();
		render(AutoSuggestBoxVirtualTestWrapper, { suggestionChosen });
		focusInput();

		await walk('ArrowDown', 30);
		await vi.waitFor(() => expect(activeOption()).toBe('item-29'));

		await userEvent.keyboard('{Enter}');

		expect(suggestionChosen).toHaveBeenCalledWith(expect.anything(), 'Item 29');
		await expect.element(combobox()).toHaveValue('Item 29');
	});

	it('chooses the option clicked with the pointer', async () => {
		const suggestionChosen = vi.fn();
		render(AutoSuggestBoxVirtualTestWrapper, { open: true, suggestionChosen });

		await page.getByRole('option', { name: 'Item 3' }).click();

		expect(suggestionChosen).toHaveBeenCalledWith(expect.anything(), 'Item 3');
	});

	it('chooses the option the query highlighted on Enter', async () => {
		const suggestionChosen = vi.fn();
		const querySubmitted = vi.fn();
		render(AutoSuggestBoxVirtualTestWrapper, { suggestionChosen, querySubmitted });
		await combobox().fill('Item 42');
		await vi.waitFor(() => expect(activeOption()).toBe('item-42'));

		await userEvent.keyboard('{Enter}');

		expect(suggestionChosen).toHaveBeenCalledWith(expect.anything(), 'Item 42');
		expect(querySubmitted).not.toHaveBeenCalled();
	});

	it('chooses an option reached by arrowing through a filtered list', async () => {
		const suggestionChosen = vi.fn();
		render(AutoSuggestBoxVirtualTestWrapper, { suggestionChosen });
		await combobox().fill('Item 1');
		await vi.waitFor(() => expect(activeOption()).toBe('item-1'));

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('item-10'));
		await userEvent.keyboard('{Enter}');

		expect(suggestionChosen).toHaveBeenCalledWith(expect.anything(), 'Item 10');
	});

	it('collects options on Enter in multiselect mode', async () => {
		const suggestionChosen = vi.fn();
		render(AutoSuggestBoxVirtualTestWrapper, { multiselect: true, suggestionChosen });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('item-0'));
		await userEvent.keyboard('{Enter}');

		expect(suggestionChosen).toHaveBeenCalledWith(expect.anything(), 'Item 0');
	});

	it('steps over disabled options', async () => {
		render(AutoSuggestBoxVirtualTestWrapper, { open: true, disabledEvery: 2 });
		focusInput();

		// Every even index is disabled, so the cursor should land on the odd ones.
		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('item-1'));

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('item-3'));
	});

	it('keeps the active option scrolled into view', async () => {
		render(AutoSuggestBoxVirtualTestWrapper, { open: true });
		focusInput();

		await walk('ArrowDown', 12);
		await vi.waitFor(() => expect(activeOption()).toBe('item-11'));

		const active = document.getElementById('item-11')!;
		const viewport = active.closest('.fs-list-view')!;
		const activeBox = active.getBoundingClientRect();
		const viewportBox = viewport.getBoundingClientRect();

		expect(activeBox.top).toBeGreaterThanOrEqual(viewportBox.top - 1);
		expect(activeBox.bottom).toBeLessThanOrEqual(viewportBox.bottom + 1);
	});

	it('shows the not-found text when the query filters everything out', async () => {
		render(AutoSuggestBoxVirtualTestWrapper);
		await combobox().fill('zzz');

		await expect.element(page.getByText('No results found')).toBeInTheDocument();
	});
});

describe('the docs example', () => {
	it('chooses the option under the cursor on Enter', async () => {
		const suggestionChosen = vi.fn();
		const querySubmitted = vi.fn();
		render(AutoSuggestBoxDocsTestWrapper, { suggestionChosen, querySubmitted });
		focusInput();

		// Every tenth option is disabled, so the cursor lands on the second one.
		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe(fake[1].id));

		await userEvent.keyboard('{Enter}');

		expect(suggestionChosen).toHaveBeenCalledWith(expect.anything(), fake[1].name);
		expect(querySubmitted).not.toHaveBeenCalled();
	});

	it('lists the chosen names in the text box, comma separated', async () => {
		render(AutoSuggestBoxDocsTestWrapper);
		focusInput();

		// Every tenth person is disabled, starting with the first one. Opening a
		// windowed list is asynchronous — render, then scroll — so the cursor has to
		// arrive before Enter has anything to choose.
		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe(fake[1].id));
		await userEvent.keyboard('{Enter}');
		await expect.element(combobox()).toHaveValue(fake[1].name);

		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe(fake[2].id));
		await userEvent.keyboard('{Enter}');
		await expect.element(combobox()).toHaveValue(`${fake[1].name}, ${fake[2].name}`);
	});

	it('returns the query when the list ends in an option nothing can land on', async () => {
		// The first person is disabled, so index 0 is rendered but not navigable.
		// Walking up onto it is the move Tabspot's virtual boundary cannot resolve:
		// arithmetic puts the cursor there, the row is not one of its items, and the
		// move is dropped without an edge — leaving no way back to the text box.
		render(AutoSuggestBoxDocsTestWrapper);
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe(fake[1].id));

		await userEvent.keyboard('{ArrowUp}');

		await vi.waitFor(() => expect(activeOption()).toBe(''));
	});

	it('chooses the option a typed query highlighted', async () => {
		const suggestionChosen = vi.fn();
		render(AutoSuggestBoxDocsTestWrapper, { suggestionChosen });
		await combobox().fill(fake[3].name);
		await vi.waitFor(() => expect(activeOption()).not.toBe(''));

		await userEvent.keyboard('{Enter}');

		expect(suggestionChosen).toHaveBeenCalledWith(expect.anything(), fake[3].name);
	});
});

describe('a disabled match', () => {
	it('is not highlighted, so Enter submits the query', async () => {
		const suggestionChosen = vi.fn();
		const querySubmitted = vi.fn();
		// Disabling by filtered index means the single match of a full-name query
		// always lands on index 0 — and is therefore always disabled. With no other
		// match to walk on to, the cursor stays where it was: at home.
		render(AutoSuggestBoxVirtualTestWrapper, { disabledEvery: 10, suggestionChosen, querySubmitted });
		await combobox().fill('Item 42');
		await expect.element(page.getByRole('option', { name: 'Item 42' })).toBeInTheDocument();

		expect(activeOption()).toBe('');

		await userEvent.keyboard('{Enter}');
		expect(suggestionChosen).not.toHaveBeenCalled();
		expect(querySubmitted).toHaveBeenCalled();
	});
});
