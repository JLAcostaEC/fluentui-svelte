import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Checkbox } from '$lib/index.js';
import CheckboxTestWrapper from './CheckboxTestWrapper.svelte';

describe('rendering', () => {
	it('renders a label wrapper by default, so the children name the input', async () => {
		render(Checkbox);
		const el = page.selector('label.fs-checkbox');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders a div wrapper when wrapperAs="div"', async () => {
		render(Checkbox, { wrapperAs: 'div' });
		const el = page.selector('div.fs-checkbox');
		await expect.element(el).toBeInTheDocument();
	});

	it('gives the input an accessible name from its children', async () => {
		render(CheckboxTestWrapper, { label: 'Accept terms' });
		await expect.element(page.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
	});

	it('renders an input of type checkbox', async () => {
		render(Checkbox);
		const el = page.getByRole('checkbox');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders label text passed as children', async () => {
		render(CheckboxTestWrapper, { label: 'Accept terms' });
		const el = page.getByText('Accept terms');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('checked state', () => {
	it('is unchecked by default', async () => {
		render(Checkbox);
		const input = page.getByRole('checkbox');
		await expect.element(input).not.toBeChecked();
	});

	it('reflects the checked prop', async () => {
		render(Checkbox, { checked: true });
		const input = page.getByRole('checkbox');
		await expect.element(input).toBeChecked();
	});

	it('toggles checked on click', async () => {
		render(Checkbox);
		const input = page.getByRole('checkbox');
		await expect.element(input).not.toBeChecked();
		await input.click();
		await expect.element(input).toBeChecked();
	});

	it('toggles checked when its label is clicked', async () => {
		render(CheckboxTestWrapper, { label: 'Toggle me' });
		const input = page.getByRole('checkbox');
		await expect.element(input).not.toBeChecked();
		await page.getByText('Toggle me').click();
		await expect.element(input).toBeChecked();
	});
});

describe('indeterminate state', () => {
	it('reflects the indeterminate prop on the input', async () => {
		render(Checkbox, { indeterminate: true });
		const input = page.getByRole('checkbox');
		expect((input.element() as HTMLInputElement).indeterminate).toBe(true);
	});
});

describe('disabled state', () => {
	it('renders disabled when the disabled prop is set', async () => {
		render(Checkbox, { disabled: true });
		const input = page.getByRole('checkbox');
		await expect.element(input).toBeDisabled();
	});

	it('does not toggle when disabled', async () => {
		render(Checkbox, { disabled: true });
		const input = page.getByRole('checkbox');
		await expect.element(input).not.toBeChecked();
		await input.click({ force: true });
		await expect.element(input).not.toBeChecked();
	});
});

describe('aria-hidden', () => {
	it('applies aria-hidden to the input', async () => {
		render(Checkbox, { 'aria-hidden': 'true' });
		const input = page.getByRole('checkbox', { includeHidden: true });
		await expect.element(input).toHaveAttribute('aria-hidden', 'true');
	});
});

describe('attributes', () => {
	it('forwards extra attributes to the input', async () => {
		render(Checkbox, { 'data-testid': 'my-checkbox' });
		const el = page.getByTestId('my-checkbox');
		await expect.element(el).toBeInTheDocument();
	});

	it('forwards wrapperAttributes to the wrapper element', async () => {
		render(Checkbox, { wrapperAttributes: { 'data-testid': 'my-wrapper' } });
		const el = page.getByTestId('my-wrapper');
		await expect.element(el).toBeInTheDocument();
	});
});
