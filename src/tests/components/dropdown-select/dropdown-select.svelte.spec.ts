import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DropdownSelectTestWrapper from './DropdownSelectTestWrapper.svelte';

describe('rendering', () => {
	it('renders a wrapper with the fs-dropdown class', async () => {
		render(DropdownSelectTestWrapper);
		const el = page.selector('.fs-dropdown');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders a select element', async () => {
		render(DropdownSelectTestWrapper);
		const el = page.selector('select.fs-dropdown-select');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders the chevron indicator for a single select', async () => {
		render(DropdownSelectTestWrapper);
		const el = page.selector('.indicator');
		await expect.element(el).toBeInTheDocument();
	});

	it('does not render the chevron indicator for a multiple select', async () => {
		render(DropdownSelectTestWrapper, { multiple: true });
		const el = page.selector('.indicator');
		await expect.element(el).not.toBeInTheDocument();
	});
});

describe('placeholder', () => {
	it('renders the placeholder option by default', async () => {
		render(DropdownSelectTestWrapper);
		const el = page.selector('option.fs-dropdown-placeholder');
		await expect.element(el).toBeInTheDocument();
	});

	it('uses the default placeholder text', async () => {
		render(DropdownSelectTestWrapper);
		const el = page.selector('option.fs-dropdown-placeholder');
		await expect.element(el).toHaveTextContent('Native Select Dropdown');
	});

	it('renders a custom placeholder', async () => {
		render(DropdownSelectTestWrapper, { placeholder: 'Choose one' });
		const el = page.selector('option.fs-dropdown-placeholder');
		await expect.element(el).toHaveTextContent('Choose one');
	});

	it('does not render the placeholder when hidePlaceholder is set', async () => {
		render(DropdownSelectTestWrapper, { hidePlaceholder: true });
		const el = page.selector('option.fs-dropdown-placeholder');
		await expect.element(el).not.toBeInTheDocument();
	});
});

describe('options', () => {
	it('renders an option per item', async () => {
		render(DropdownSelectTestWrapper);
		await expect.element(page.selector('option[value="apple"]')).toBeInTheDocument();
		await expect.element(page.selector('option[value="banana"]')).toBeInTheDocument();
		await expect.element(page.selector('option[value="cherry"]')).toBeInTheDocument();
	});

	it('marks an option as disabled', async () => {
		render(DropdownSelectTestWrapper, {
			options: [{ value: 'apple', text: 'Apple', disabled: true }]
		});
		const el = page.selector('option[value="apple"]');
		await expect.element(el).toBeDisabled();
	});
});

describe('value binding', () => {
	it('reflects the initial value on the select', async () => {
		render(DropdownSelectTestWrapper, { value: 'banana' });
		const el = page.selector('select.fs-dropdown-select');
		await expect.element(el).toHaveValue('banana');
	});
});

describe('multiple', () => {
	it('renders the select with its options in multiple mode', async () => {
		render(DropdownSelectTestWrapper, { multiple: true });
		const el = page.selector('select.fs-dropdown-select');
		await expect.element(el).toBeInTheDocument();
		await expect.element(page.selector('option[value="apple"]')).toBeInTheDocument();
	});
});

describe('attributes', () => {
	it('forwards wrapperProps to the wrapper element', async () => {
		render(DropdownSelectTestWrapper, { wrapperProps: { 'data-testid': 'my-select' } });
		const el = page.getByTestId('my-select');
		await expect.element(el).toBeInTheDocument();
	});
});
