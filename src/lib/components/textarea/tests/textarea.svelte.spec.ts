import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { TextArea } from '$lib/index.js';
import TextAreaTestWrapper from './TextAreaTestWrapper.svelte';

const textarea = () => page.getByRole('textbox');

describe('rendering', () => {
	it('renders a textarea inside a wrapper', async () => {
		render(TextArea);
		await expect.element(textarea()).toBeInTheDocument();
		await expect.element(page.selector('div.fs-textarea')).toBeInTheDocument();
	});

	it('renders the placeholder it is given', async () => {
		render(TextArea, { placeholder: 'Tell us more' });
		await expect.element(textarea()).toHaveAttribute('placeholder', 'Tell us more');
	});

	it('carries the name and id it is given', async () => {
		render(TextArea, { name: 'notes', id: 'notes' });
		await expect.element(textarea()).toHaveAttribute('name', 'notes');
		await expect.element(textarea()).toHaveAttribute('id', 'notes');
	});
});

describe('value', () => {
	it('starts empty', async () => {
		render(TextArea);
		await expect.element(textarea()).toHaveValue('');
	});

	it('shows the value it is given', async () => {
		render(TextArea, { value: 'Hello' });
		await expect.element(textarea()).toHaveValue('Hello');
	});

	it('reports what is typed through the binding', async () => {
		render(TextAreaTestWrapper);

		await textarea().fill('Hello');

		await expect.element(page.getByTestId('value')).toHaveTextContent('Hello');
	});
});

describe('resize', () => {
	it('resizes vertically by default', async () => {
		render(TextArea);
		await expect.element(textarea()).toHaveStyle({ resize: 'vertical' });
	});

	it('takes the resize behaviour it is given', async () => {
		render(TextArea, { resize: 'none' });
		await expect.element(textarea()).toHaveStyle({ resize: 'none' });
	});
});

describe('disabled', () => {
	it('is disabled when asked', async () => {
		render(TextArea, { disabled: true });
		await expect.element(textarea()).toBeDisabled();
	});

	it('does not fire onchange while disabled', async () => {
		const onchange = vi.fn();
		render(TextArea, { disabled: true, onchange });

		await expect(textarea().fill('Hello', { timeout: 300 })).rejects.toThrow();

		expect(onchange).not.toHaveBeenCalled();
	});
});
