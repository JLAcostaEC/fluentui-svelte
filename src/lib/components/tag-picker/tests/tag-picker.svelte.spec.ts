import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { TagPickerOption } from '$lib/index.js';
import TagPickerTestWrapper from './TagPickerTestWrapper.svelte';

const combobox = () => page.getByRole('combobox');
const tags = () => page.selector('.fs-tag-group').getByRole('listitem');
const control = () => page.selector('.fs-tagpicker .control');

const input = () => document.querySelector<HTMLInputElement>('.fs-tagpicker input')!;

/** The option the combobox announces as active, or '' when there is none. */
const activeOption = () => input().getAttribute('aria-activedescendant') || '';

/** Put the caret in the input. Clicking is not an option: the list is laid over what is below the control. */
const focusInput = () => input().focus();

const people = [
	{ value: 'apple', text: 'Apple' },
	{ value: 'banana', text: 'Banana', disabled: true },
	{ value: 'cherry', text: 'Cherry' }
];

describe('rendering', () => {
	it('renders a collapsed combobox', async () => {
		render(TagPickerTestWrapper);

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(combobox()).toHaveAttribute('aria-haspopup', 'listbox');
		await expect.element(combobox()).toHaveAttribute('aria-autocomplete', 'list');
		expect(input().hasAttribute('aria-controls')).toBe(false);
	});

	it('is named by the aria-label of the input', async () => {
		render(TagPickerTestWrapper);

		await expect.element(page.getByRole('combobox', { name: 'Fruits' })).toBeInTheDocument();
	});

	it('renders the placeholder', async () => {
		render(TagPickerTestWrapper, { placeholder: 'Pick a fruit' });

		await expect.element(combobox()).toHaveAttribute('placeholder', 'Pick a fruit');
	});

	it('shows a multiselectable listbox when open', async () => {
		render(TagPickerTestWrapper, { open: true });

		const listbox = page.getByRole('listbox');
		await expect.element(listbox).toBeInTheDocument();
		await expect.element(listbox).toHaveAttribute('aria-multiselectable', 'true');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(combobox()).toHaveAttribute('aria-controls', listbox.element().id);
		await expect.element(page.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
	});

	it('does not mark a single listbox as multiselectable', async () => {
		render(TagPickerTestWrapper, { open: true, single: true });

		await expect.element(page.getByRole('listbox')).not.toHaveAttribute('aria-multiselectable');
	});

	it('names the listbox like the input', async () => {
		render(TagPickerTestWrapper, { open: true });

		await expect.element(page.getByRole('listbox', { name: 'Fruits' })).toBeInTheDocument();
	});

	it('reflects the size', async () => {
		render(TagPickerTestWrapper, { size: 'large', selectedOptions: ['apple'] });

		await expect.element(page.selector('.fs-tagpicker')).toHaveClass('size-large');
		await expect.element(page.selector('.fs-tag')).toHaveClass('small');
		await expect.element(page.selector('.fs-tag')).toHaveClass('filled');
	});

	it('is disabled', async () => {
		render(TagPickerTestWrapper, { disabled: true, selectedOptions: ['apple'] });

		await expect.element(combobox()).toBeDisabled();
		await expect.element(tags()).toBeDisabled();
	});

	it('does not open when disabled', async () => {
		render(TagPickerTestWrapper, { disabled: true, open: true });

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(page.getByRole('listbox')).not.toBeInTheDocument();
	});

	it('is a plain textbox without children', async () => {
		const querySubmitted = vi.fn();
		render(TagPickerTestWrapper, { noList: true, querySubmitted });

		await expect.element(combobox()).not.toBeInTheDocument();
		const textbox = page.getByRole('textbox', { name: 'Fruits' });
		await textbox.fill('zzz');
		await expect.element(page.getByRole('listbox')).not.toBeInTheDocument();

		await userEvent.keyboard('{Enter}');
		expect(querySubmitted).toHaveBeenCalledWith(expect.anything(), 'zzz');
	});
});

describe('selection', () => {
	it('shows the text of a tag before the list has ever been opened', async () => {
		render(TagPickerTestWrapper, {
			options: [
				{ value: 'a1', text: 'Alpha' },
				{ value: 'b2', text: 'Beta' }
			],
			selectedOptions: ['a1', 'b2']
		});

		await expect.element(tags().first()).toHaveTextContent('Alpha');
		await expect.element(tags().last()).toHaveTextContent('Beta');
		expect(tags().elements()).toHaveLength(2);
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
	});

	it('shows a value that no option has as it is', async () => {
		render(TagPickerTestWrapper, { selectedOptions: ['ghost'] });

		await expect.element(tags()).toHaveTextContent('ghost');
	});

	it('adds a tag, clears the text and keeps the list open when an option is clicked', async () => {
		const onSelectionChange = vi.fn();
		render(TagPickerTestWrapper, { onSelectionChange });

		await combobox().fill('a');
		await page.getByRole('option', { name: 'Apple' }).click();

		await expect.element(tags()).toHaveTextContent('Apple');
		await expect.element(combobox()).toHaveValue('');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
		expect(onSelectionChange).toHaveBeenCalledWith(expect.anything(), ['apple']);
	});

	it('does not offer a chosen option again', async () => {
		render(TagPickerTestWrapper, { open: true });

		await page.getByRole('option', { name: 'Apple' }).click();

		await expect.element(page.getByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
		await expect.element(page.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
	});

	it('replaces the tag and closes the list when single', async () => {
		render(TagPickerTestWrapper, { open: true, single: true });

		await page.getByRole('option', { name: 'Apple' }).click();
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(tags()).toHaveTextContent('Apple');

		await control().click();
		await expect.element(page.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
		await page.getByRole('option', { name: 'Banana' }).click();

		expect(tags().elements()).toHaveLength(1);
		await expect.element(tags()).toHaveTextContent('Banana');

		await control().click();
		await expect.element(page.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
	});

	it('removes a tag when it is dismissed', async () => {
		const onSelectionChange = vi.fn();
		render(TagPickerTestWrapper, { selectedOptions: ['apple', 'banana'], onSelectionChange });

		await tags().first().click();

		expect(tags().elements()).toHaveLength(1);
		await expect.element(tags()).toHaveTextContent('Banana');
		expect(onSelectionChange).toHaveBeenCalledWith(expect.anything(), ['banana']);
		await vi.waitFor(() => expect(document.activeElement).toBe(input()));
	});

	it('offers a dismissed option again', async () => {
		render(TagPickerTestWrapper, { selectedOptions: ['apple'], open: true });

		await expect.element(page.getByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
		await tags().click();

		await expect.element(page.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
	});

	it('removes the last tag on Backspace in an empty input', async () => {
		const onSelectionChange = vi.fn();
		render(TagPickerTestWrapper, { selectedOptions: ['apple', 'banana'], onSelectionChange });
		focusInput();

		await userEvent.keyboard('{Backspace}');

		expect(tags().elements()).toHaveLength(1);
		await expect.element(tags()).toHaveTextContent('Apple');
		expect(onSelectionChange).toHaveBeenCalledWith(expect.anything(), ['apple']);
	});

	it('edits the text on Backspace and keeps the tags', async () => {
		render(TagPickerTestWrapper, { selectedOptions: ['apple'] });
		await combobox().fill('x');

		await userEvent.keyboard('{Backspace}');

		await expect.element(combobox()).toHaveValue('');
		expect(tags().elements()).toHaveLength(1);
	});

	it('does nothing on Backspace without tags', async () => {
		const onSelectionChange = vi.fn();
		render(TagPickerTestWrapper, { onSelectionChange });
		focusInput();

		await userEvent.keyboard('{Backspace}');

		expect(onSelectionChange).not.toHaveBeenCalled();
	});

	it('keeps the text of a tag once its option is gone', async () => {
		render(TagPickerTestWrapper, {
			options: [
				{ value: 'a1', text: 'Alpha' },
				{ value: 'b2', text: 'Beta' }
			],
			open: true
		});

		await page.getByRole('option', { name: 'Alpha' }).click();
		await expect.element(tags()).toHaveTextContent('Alpha');

		focusInput();
		await userEvent.keyboard('{Escape}');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');

		await expect.element(tags()).toHaveTextContent('Alpha');
	});

	it('shows the not found text when every option is chosen', async () => {
		render(TagPickerTestWrapper, { open: true, selectedOptions: ['apple', 'banana', 'cherry'] });

		await expect.element(page.getByText('No options available')).toBeInTheDocument();
	});

	it('shows a custom not found text', async () => {
		render(TagPickerTestWrapper, { open: true, options: [], notFoundText: 'Nothing here' });

		await expect.element(page.getByText('Nothing here')).toBeInTheDocument();
	});
});

describe('filtering', () => {
	it('opens the list and filters the options by what is typed', async () => {
		render(TagPickerTestWrapper);

		await combobox().fill('AN');

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(page.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
		await expect.element(page.getByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
	});

	it('filters by the text of an option, not by its value', async () => {
		render(TagPickerTestWrapper, {
			options: [
				{ value: 'a1', text: 'Alpha' },
				{ value: 'b2', text: 'Beta' }
			]
		});

		await combobox().fill('alp');
		await expect.element(page.getByRole('option', { name: 'Alpha' })).toBeInTheDocument();
		await expect.element(page.getByRole('option', { name: 'Beta' })).not.toBeInTheDocument();

		await combobox().fill('a1');
		await expect.element(page.getByRole('option', { name: 'Alpha' })).not.toBeInTheDocument();
		await expect.element(page.getByText('No options available')).toBeInTheDocument();
	});

	it('falls back to the value of an option without text', async () => {
		render(TagPickerTestWrapper, { options: [{ value: 'Plain' }, { value: 'Other' }] });

		await combobox().fill('pla');
		await expect.element(page.getByRole('option', { name: 'Plain' })).toBeInTheDocument();
		await expect.element(page.getByRole('option', { name: 'Other' })).not.toBeInTheDocument();

		await page.getByRole('option', { name: 'Plain' }).click();
		await expect.element(tags()).toHaveTextContent('Plain');
	});

	it('highlights the first match', async () => {
		render(TagPickerTestWrapper);

		await combobox().fill('a');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await combobox().fill('an');
		await vi.waitFor(() => expect(activeOption()).toBe('banana'));

		await combobox().fill('');
		await vi.waitFor(() => expect(activeOption()).toBe(''));
	});

	it('keeps the cursor off the options the query filtered out', async () => {
		render(TagPickerTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('an');
		await vi.waitFor(() => expect(activeOption()).toBe('banana'));

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe(''));
	});

	it('shows the not found text when nothing matches', async () => {
		render(TagPickerTestWrapper);

		await combobox().fill('zzz');

		await expect.element(page.getByText('No options available')).toBeInTheDocument();
		expect(activeOption()).toBe('');
	});

	it('hides a group when none of its options match', async () => {
		render(TagPickerTestWrapper, {
			groups: [
				{ label: 'Fruits', options: [{ value: 'apple', text: 'Apple' }] },
				{ label: 'Vegetables', options: [{ value: 'carrot', text: 'Carrot' }] }
			]
		});

		await combobox().fill('car');

		await expect.element(page.getByText('Vegetables')).toBeVisible();
		await expect.element(page.getByText('Fruits')).not.toBeVisible();
	});
});

describe('keyboard navigation', () => {
	it('opens the list and activates the first option on ArrowDown', async () => {
		render(TagPickerTestWrapper);
		focusInput();

		await userEvent.keyboard('{ArrowDown}');

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));
	});

	it('activates the last option on ArrowUp from a closed list', async () => {
		render(TagPickerTestWrapper);
		focusInput();

		await userEvent.keyboard('{ArrowUp}');

		await vi.waitFor(() => expect(activeOption()).toBe('cherry'));
	});

	it('walks the list, steps over disabled options and leaves past either end', async () => {
		render(TagPickerTestWrapper, { open: true, options: people });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('cherry'));

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe(''));

		await userEvent.keyboard('{ArrowDown}{ArrowUp}');
		await vi.waitFor(() => expect(activeOption()).toBe(''));
	});

	it('chooses the active option on Enter and keeps the list open', async () => {
		const onSelectionChange = vi.fn();
		render(TagPickerTestWrapper, { onSelectionChange });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));
		await userEvent.keyboard('{Enter}');

		await expect.element(tags()).toHaveTextContent('Apple');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
		expect(onSelectionChange).toHaveBeenCalledWith(expect.anything(), ['apple']);
	});

	it('closes the list on Enter when single', async () => {
		render(TagPickerTestWrapper, { single: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));
		await userEvent.keyboard('{Enter}');

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(tags()).toHaveTextContent('Apple');
	});

	it('chooses the highlighted option on Enter after typing', async () => {
		const querySubmitted = vi.fn();
		render(TagPickerTestWrapper, { querySubmitted });
		await combobox().fill('Ban');
		await vi.waitFor(() => expect(activeOption()).toBe('banana'));

		await userEvent.keyboard('{Enter}');

		await expect.element(tags()).toHaveTextContent('Banana');
		expect(querySubmitted).not.toHaveBeenCalled();
	});

	it('submits the query on Enter when no option is active', async () => {
		const querySubmitted = vi.fn();
		render(TagPickerTestWrapper, { querySubmitted });
		await combobox().fill('zzz');

		await userEvent.keyboard('{Enter}');

		expect(querySubmitted).toHaveBeenCalledWith(expect.anything(), 'zzz');
		expect(tags().elements()).toHaveLength(0);
	});

	it('opens the list on Enter without text', async () => {
		const querySubmitted = vi.fn();
		render(TagPickerTestWrapper, { querySubmitted });
		focusInput();

		await userEvent.keyboard('{Enter}');

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
		expect(querySubmitted).not.toHaveBeenCalled();
	});

	it('closes on Escape and stops announcing an active option', async () => {
		render(TagPickerTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('{Escape}');

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
		await vi.waitFor(() => expect(activeOption()).toBe(''));
	});

	it('does not swallow Escape when closed', async () => {
		render(TagPickerTestWrapper);
		focusInput();
		const seen = vi.fn();
		document.addEventListener('keydown', seen);

		await userEvent.keyboard('{Escape}');
		document.removeEventListener('keydown', seen);

		expect(seen).toHaveBeenCalled();
		expect(seen.mock.calls[0][0].defaultPrevented).toBe(false);
	});

	it('leaves Home and End to the text caret', async () => {
		render(TagPickerTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));

		await userEvent.keyboard('{Home}{End}');

		expect(activeOption()).toBe('apple');
	});

	it('closes on Tab', async () => {
		render(TagPickerTestWrapper, { open: true });
		focusInput();

		await userEvent.keyboard('{Tab}');

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
	});

	it('does not point at a removed option after a choice', async () => {
		render(TagPickerTestWrapper);
		focusInput();

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('apple'));
		await userEvent.keyboard('{Enter}');
		await vi.waitFor(() => expect(activeOption()).toBe(''));

		await userEvent.keyboard('{ArrowDown}');
		await vi.waitFor(() => expect(activeOption()).toBe('banana'));
	});

	it('walks across the groups in document order', async () => {
		render(TagPickerTestWrapper, {
			open: true,
			groups: [
				{
					label: 'Fruits',
					options: [
						{ value: 'apple', text: 'Apple' },
						{ value: 'banana', text: 'Banana' }
					]
				},
				{ label: 'Vegetables', options: [{ value: 'carrot', text: 'Carrot' }] }
			]
		});
		focusInput();

		await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');

		await vi.waitFor(() => expect(activeOption()).toBe('carrot'));
	});
});

describe('pointer', () => {
	it('opens the list when the control is clicked', async () => {
		render(TagPickerTestWrapper);

		await control().click();

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');
		expect(document.activeElement).toBe(input());
	});

	it('toggles the list with the chevron', async () => {
		render(TagPickerTestWrapper);

		await page.selector('.chevron').click();
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');

		await page.selector('.chevron').click();
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
	});

	it('closes the list when clicking outside', async () => {
		render(TagPickerTestWrapper, { open: true });

		await page.getByRole('button', { name: 'before' }).click();

		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
	});

	it('keeps the focus in the input when an option is clicked', async () => {
		render(TagPickerTestWrapper, { open: true });
		focusInput();

		await page.getByRole('option', { name: 'Apple' }).click();

		await expect.element(tags()).toHaveTextContent('Apple');
		expect(document.activeElement).toBe(input());
	});

	it('keeps the focus in the input when the padding of the list is pressed', async () => {
		render(TagPickerTestWrapper, { open: true });
		focusInput();

		const list = document.querySelector<HTMLElement>('.fs-tagpicker-flyout .fs-list-view')!;
		const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
		list.dispatchEvent(press);

		expect(press.defaultPrevented).toBe(true);
	});

	it('hands the focus back to the input when the secondary action is clicked while open', async () => {
		render(TagPickerTestWrapper, { open: true, withSecondary: true });
		focusInput();

		await page.getByRole('button', { name: 'Clear all' }).click();

		expect(document.activeElement).toBe(input());
		await userEvent.keyboard('{Escape}');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
	});

	it('does not choose a disabled option', async () => {
		render(TagPickerTestWrapper, { open: true, options: people });

		await page.getByRole('option', { name: 'Banana' }).click({ force: true });

		expect(tags().elements()).toHaveLength(0);
	});
});

describe('readonly input', () => {
	it('acts as a trigger', async () => {
		render(TagPickerTestWrapper, {
			selectedOptions: ['apple'],
			inputProps: { 'aria-label': 'Fruits', readonly: true }
		});
		focusInput();

		await userEvent.keyboard('zzz');
		await expect.element(combobox()).toHaveValue('');

		await userEvent.keyboard('{ArrowDown}');
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'true');

		await userEvent.keyboard('{Escape}{Backspace}');
		expect(tags().elements()).toHaveLength(0);
	});
});

describe('slots', () => {
	it('removes the chevron when expandIcon is null', async () => {
		render(TagPickerTestWrapper, { expandIcon: null });

		expect(document.querySelector('.chevron')).toBeNull();
	});

	it('has no chevron without a list', async () => {
		render(TagPickerTestWrapper, { noList: true });

		expect(document.querySelector('.chevron')).toBeNull();
	});

	it('renders a custom expandIcon', async () => {
		render(TagPickerTestWrapper, { customExpand: true });

		await expect.element(page.getByTestId('custom-expand')).toBeInTheDocument();
	});

	it('renders the secondaryAction without opening the list', async () => {
		const onSecondary = vi.fn();
		render(TagPickerTestWrapper, { withSecondary: true, onSecondary });

		await page.getByRole('button', { name: 'Clear all' }).click();

		expect(onSecondary).toHaveBeenCalled();
		await expect.element(combobox()).toHaveAttribute('aria-expanded', 'false');
	});

	it('renders the tags with the tag snippet', async () => {
		render(TagPickerTestWrapper, { useTagSnippet: true, selectedOptions: ['apple'] });

		await expect.element(tags()).toHaveTextContent('custom Apple');
	});

	it('keeps the input on the row of the last tag', async () => {
		render(TagPickerTestWrapper, { selectedOptions: ['apple', 'banana'] });

		const lastTag = tags().elements().at(-1)!.getBoundingClientRect();
		const field = input().getBoundingClientRect();

		expect(field.top).toBeLessThan(lastTag.bottom);
		expect(field.left).toBeGreaterThan(lastTag.left);
	});

	it('names the group of tags', async () => {
		render(TagPickerTestWrapper, {
			selectedOptions: ['apple'],
			tagGroupProps: { 'aria-label': 'Selected fruits' }
		});

		await expect.element(page.getByRole('list', { name: 'Selected fruits' })).toBeInTheDocument();
	});
});

describe('validation', () => {
	it('throws when a single picker holds more than one option', async () => {
		await expect(render(TagPickerTestWrapper, { single: true, selectedOptions: ['apple', 'banana'] })).rejects.toThrow(
			'A single TagPicker cannot hold more than one selected option'
		);
	});

	it('throws when an option is used outside a TagPicker', async () => {
		await expect(render(TagPickerOption, { value: 'apple' })).rejects.toThrow(
			'TagPickerOption must be used within a TagPicker'
		);
	});

	it('names an option group after its label', async () => {
		render(TagPickerTestWrapper, {
			open: true,
			groups: [{ label: 'Managers', options: [{ value: 'apple', text: 'Apple' }] }]
		});

		await expect.element(page.getByRole('group', { name: 'Managers' })).toBeInTheDocument();
	});
});
