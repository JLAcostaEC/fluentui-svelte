import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Dropdown, DropdownOption } from '$lib/index.js';
import DropdownTestWrapper from './DropdownTestWrapper.svelte';

/** The button that opens the list. The native select of a single dropdown is a combobox too, after it. */
const trigger = () => page.getByRole('combobox').first();
/** The options on screen, not those of the native select that holds the selection. */
const list = () => page.selector('.fs-dropdown-flyout');

describe('rendering', () => {
	it('renders a combobox button', async () => {
		render(DropdownTestWrapper);
		const el = trigger();
		await expect.element(el).toBeInTheDocument();
	});

	it('shows the default placeholder when nothing is selected', async () => {
		render(DropdownTestWrapper);
		const el = trigger();
		await expect.element(el).toHaveTextContent('Select an option');
	});

	it('shows a custom placeholder', async () => {
		render(DropdownTestWrapper, { placeholder: 'Pick a fruit' });
		const el = trigger();
		await expect.element(el).toHaveTextContent('Pick a fruit');
	});

	it('sets the correct aria attributes', async () => {
		render(DropdownTestWrapper);
		const el = trigger();
		await expect.element(el).toHaveAttribute('aria-haspopup', 'listbox');
		await expect.element(el).toHaveAttribute('aria-expanded', 'false');
	});

	it('points aria-controls to the listbox only while it is rendered', async () => {
		render(DropdownTestWrapper);
		const el = trigger();
		await expect.element(el).not.toHaveAttribute('aria-controls');
		await el.click();
		await expect.element(el).toHaveAttribute('aria-controls', list().getByRole('listbox').element().id);
	});

	it('is initially collapsed (no options in the DOM)', async () => {
		render(DropdownTestWrapper);
		const option = list().getByRole('option');
		await expect.element(option.first()).not.toBeInTheDocument();
	});
});

describe('opening', () => {
	it('opens on click and reveals options', async () => {
		render(DropdownTestWrapper);
		await trigger().click();
		await expect.element(trigger()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(list().getByRole('option', { name: 'Apple' })).toBeInTheDocument();
	});

	it('closes on Escape', async () => {
		render(DropdownTestWrapper);
		const combobox = trigger();
		await combobox.click();
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'true');
		await userEvent.keyboard('{Escape}');
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'false');
	});

	it('shows "No options available" when there are no options', async () => {
		render(Dropdown);
		await trigger().click();
		const el = page.getByText('No options available');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('single selection', () => {
	it('selects an option, updates the label and closes', async () => {
		render(DropdownTestWrapper);
		const combobox = trigger();
		await combobox.click();
		await list().getByRole('option', { name: 'Banana' }).click();
		await expect.element(combobox).toHaveTextContent('Banana');
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'false');
	});

	it.each(['{Enter}', ' '])('selects the option under the cursor with %s and closes', async (key) => {
		render(DropdownTestWrapper);
		const combobox = trigger();
		await combobox.click();
		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		await expect.element(list().getByRole('option', { name: 'Banana' })).toHaveAttribute('data-active', 'true');
		await userEvent.keyboard(key);
		await expect.element(combobox).toHaveTextContent('Banana');
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'false');
		await expect.element(combobox).toHaveFocus();
	});

	it('shows the label for an initially selected value', async () => {
		render(DropdownTestWrapper, { value: 'cherry' });
		// options only mount while open, so open once to let the option register its label
		const combobox = trigger();
		await combobox.click();
		await list().getByRole('option', { name: 'Cherry' }).click();
		await expect.element(combobox).toHaveTextContent('Cherry');
	});
});

describe('multiple selection', () => {
	it('keeps the dropdown open after selecting an option', async () => {
		render(DropdownTestWrapper, { multiple: true });
		const combobox = trigger();
		await combobox.click();
		await list().getByRole('option', { name: 'Apple' }).click();
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'true');
	});

	it('toggles the option under the cursor with the keyboard and stays open', async () => {
		render(DropdownTestWrapper, { multiple: true });
		const combobox = trigger();
		await combobox.click();
		await userEvent.keyboard('{ArrowDown}');
		const apple = list().getByRole('option', { name: 'Apple' });
		await expect.element(apple).toHaveAttribute('data-active', 'true');
		await userEvent.keyboard(' ');
		await expect.element(apple).toHaveAttribute('aria-selected', 'true');
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'true');
		await userEvent.keyboard('{Enter}');
		await expect.element(apple).toHaveAttribute('aria-selected', 'false');
	});
});

describe('disabled state', () => {
	it('disables the combobox button', async () => {
		render(DropdownTestWrapper, { disabled: true });
		const el = trigger();
		await expect.element(el).toBeDisabled();
	});

	it('does not open when disabled', async () => {
		render(DropdownTestWrapper, { disabled: true });
		const combobox = trigger();
		await combobox.click({ force: true });
		await expect.element(combobox).toHaveAttribute('aria-expanded', 'false');
	});
});

describe('DropdownOption', () => {
	it('throws when used outside a Dropdown', async () => {
		await expect(render(DropdownOption, { value: 'x' })).rejects.toThrow(
			'DropdownOption must be used within a Dropdown'
		);
	});
});
