import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { TextBox } from '$lib/index.js';

describe('rendering', () => {
	it('renders a wrapper with the fs-textbox class', async () => {
		render(TextBox);
		const el = page.selector('.fs-textbox');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders a text input by default', async () => {
		render(TextBox);
		const input = page.getByRole('textbox');
		await expect.element(input).toBeInTheDocument();
	});

	it('uses the default placeholder', async () => {
		render(TextBox);
		const input = page.getByRole('textbox');
		await expect.element(input).toHaveAttribute('placeholder', 'Fluent TextBox');
	});

	it('renders a custom placeholder', async () => {
		render(TextBox, { placeholder: 'Enter your name' });
		const input = page.getByRole('textbox');
		await expect.element(input).toHaveAttribute('placeholder', 'Enter your name');
	});
});

describe('size', () => {
	it('applies the medium size class by default', async () => {
		render(TextBox);
		const el = page.selector('.fs-textbox');
		await expect.element(el).toHaveClass('text-box-size-medium');
	});

	it('applies the small size class', async () => {
		render(TextBox, { size: 'small' });
		const el = page.selector('.fs-textbox');
		await expect.element(el).toHaveClass('text-box-size-small');
	});

	it('applies the large size class', async () => {
		render(TextBox, { size: 'large' });
		const el = page.selector('.fs-textbox');
		await expect.element(el).toHaveClass('text-box-size-large');
	});
});

describe('padding', () => {
	const padding = (element: Element) => {
		const { paddingTop, paddingRight, paddingBottom, paddingLeft } = getComputedStyle(element);
		return { paddingTop, paddingRight, paddingBottom, paddingLeft };
	};

	it('uses 11px of horizontal padding at the start of the input and keeps the vertical padding', async () => {
		render(TextBox);
		const input = page.getByRole('textbox').element();
		expect(padding(input)).toMatchObject({ paddingLeft: '11px', paddingTop: '6px', paddingBottom: '6px' });
	});

	it('uses 11px of horizontal padding at the end of the input when there are no action buttons', async () => {
		render(TextBox, { hideActionButtons: true });
		const input = page.getByRole('textbox').element();
		expect(padding(input)).toMatchObject({ paddingLeft: '11px', paddingRight: '11px' });
	});

	it('moves the outer horizontal padding to the content before and after the input', async () => {
		render(TextBox, { contentBefore: 'https://', contentAfter: '.com', hideActionButtons: true });
		const before = page.getByText('https://').element();
		const after = page.getByText('.com').element();
		const input = page.getByRole('textbox').element();
		expect(padding(before).paddingLeft).toBe('11px');
		expect(padding(after).paddingRight).toBe('11px');
		expect(padding(input)).toMatchObject({ paddingLeft: '6px', paddingRight: '6px' });
	});
});

describe('content before/after', () => {
	it('renders string content before the input', async () => {
		render(TextBox, { contentBefore: 'https://' });
		const el = page.getByText('https://');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders string content after the input', async () => {
		render(TextBox, { contentAfter: '.com' });
		const el = page.getByText('.com');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('value binding and events', () => {
	it('calls textChanged when typing', async () => {
		const textChanged = vi.fn();
		render(TextBox, { textChanged });
		const input = page.getByRole('textbox');
		await input.fill('hello');
		expect(textChanged).toHaveBeenCalled();
	});

	it('reflects the typed value on the input element', async () => {
		render(TextBox);
		const input = page.getByRole('textbox');
		await input.fill('world');
		await expect.element(input).toHaveValue('world');
	});
});

describe('clear button', () => {
	it('shows a clear button when there is a value', async () => {
		render(TextBox, { value: 'some text' });
		const clear = page.getByRole('button', { name: 'Delete Text' });
		await expect.element(clear).toBeInTheDocument();
	});

	it('does not show a clear button when empty', async () => {
		render(TextBox);
		const clear = page.getByRole('button', { name: 'Delete Text' });
		await expect.element(clear).not.toBeInTheDocument();
	});

	it('clears the value and calls onClear when clicked', async () => {
		const onClear = vi.fn();
		render(TextBox, { value: 'clear me', onClear });
		const clear = page.getByRole('button', { name: 'Delete Text' });
		await clear.click();
		const input = page.getByRole('textbox');
		await expect.element(input).toHaveValue('');
		expect(onClear).toHaveBeenCalledOnce();
	});

	it('does not show a clear button when hideActionButtons is set', async () => {
		render(TextBox, { value: 'text', hideActionButtons: true });
		const clear = page.getByRole('button', { name: 'Delete Text' });
		await expect.element(clear).not.toBeInTheDocument();
	});
});

describe('search type', () => {
	it('renders a search button and calls querySubmitted on click', async () => {
		const querySubmitted = vi.fn();
		render(TextBox, { type: 'search', querySubmitted });
		const search = page.getByRole('button', { name: 'Search' });
		await expect.element(search).toBeInTheDocument();
		await search.click();
		expect(querySubmitted).toHaveBeenCalledOnce();
	});
});

describe('password type', () => {
	it('renders a reveal button that toggles the input type', async () => {
		render(TextBox, { type: 'password' });
		const reveal = page.getByRole('button', { name: 'Reveal Password' });
		await expect.element(reveal).toBeInTheDocument();
		// the input starts as password
		const passwordInput = page.selector('input[type="password"]');
		await expect.element(passwordInput).toBeInTheDocument();
		await reveal.click();
		const textInput = page.selector('input[type="text"]');
		await expect.element(textInput).toBeInTheDocument();
	});
});

describe('readonly', () => {
	it('marks the input as readonly', async () => {
		render(TextBox, { readonly: true });
		const input = page.getByRole('textbox');
		await expect.element(input).toHaveAttribute('readonly');
	});

	it('does not show a clear button when readonly even with a value', async () => {
		render(TextBox, { readonly: true, value: 'text' });
		const clear = page.getByRole('button', { name: 'Delete Text' });
		await expect.element(clear).not.toBeInTheDocument();
	});
});
