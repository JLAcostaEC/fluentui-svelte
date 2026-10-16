import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Label } from '$lib/index.js';
import LabelTestWrapper from './LabelTestWrapper.svelte';

const label = () => page.selector('.fs-label > label');
const wrapper = () => page.selector('.fs-label');

describe('rendering', () => {
	it('renders a label element', async () => {
		render(Label);
		await expect.element(label()).toBeInTheDocument();
	});

	it('falls back to its default text', async () => {
		render(Label);
		await expect.element(page.getByText('Label Element')).toBeInTheDocument();
	});

	it('renders the text it is given', async () => {
		render(Label, { label: 'First name' });
		await expect.element(page.getByText('First name')).toBeInTheDocument();
	});

	it('wraps the field passed as children', async () => {
		render(LabelTestWrapper, { field: 'First name' });
		await expect.element(page.getByRole('textbox', { name: 'First name' })).toBeInTheDocument();
	});
});

describe('size and weight', () => {
	it('is medium and regular by default', async () => {
		render(Label);
		await expect.element(label()).toHaveClass(/size-medium/);
		await expect.element(label()).toHaveClass(/weight-regular/);
	});

	it('takes the size it is given', async () => {
		render(Label, { size: 'large' });
		await expect.element(label()).toHaveClass(/size-large/);
	});

	it('takes the weight it is given', async () => {
		render(Label, { weight: 'semibold' });
		await expect.element(label()).toHaveClass(/weight-semibold/);
	});
});

describe('position', () => {
	it('stacks the text when it sits above or below the field', async () => {
		render(Label, { labelPosition: 'above' });
		await expect.element(wrapper()).toHaveClass(/column/);
	});

	it('stays on one line when the text sits after the field', async () => {
		render(Label, { labelPosition: 'after' });
		await expect.element(wrapper()).not.toHaveClass(/column/);
	});
});

describe('required', () => {
	it('is not marked required by default', async () => {
		render(Label);
		await expect.element(wrapper()).not.toHaveClass(/required/);
	});

	it('marks itself required and explains why', async () => {
		render(Label, { label: 'Email', required: { message: 'We need it to reply' } });
		await expect.element(wrapper()).toHaveClass(/required/);
		const abbr = page.selector('.fs-label > label abbr');
		await expect.element(abbr).toHaveTextContent('*');
		await expect.element(abbr).toHaveAttribute('title', 'We need it to reply');
	});

	it('takes a custom abbreviation', async () => {
		render(Label, { label: 'Email', required: { abbr: '(required)', message: 'We need it to reply' } });
		await expect.element(page.selector('.fs-label > label abbr')).toHaveTextContent('(required)');
	});
});

describe('disabled', () => {
	it('renders as disabled to match its field', async () => {
		render(Label, { disabled: true });
		await expect.element(wrapper()).toHaveClass(/disabled/);
	});
});

describe('wrapper and association', () => {
	it('uses a div root and can render as a span', async () => {
		render(LabelTestWrapper, { as: 'span', field: 'Email' });
		expect(wrapper().element().tagName).toBe('SPAN');
		await expect.element(page.getByRole('textbox', { name: 'Email', exact: true })).toBeInTheDocument();
		expect(document.querySelector('label input')).toBeNull();
	});

	it('puts its text before the field when requested and focuses the field on click', async () => {
		render(LabelTestWrapper, { field: 'Email', labelPosition: 'above' });
		expect(wrapper().element().firstElementChild?.tagName).toBe('LABEL');
		await page.getByText('Email', { exact: true }).click();
		await expect.element(page.getByRole('textbox', { name: 'Email', exact: true })).toHaveFocus();
	});

	it('keeps the required indicator out of the accessible name', async () => {
		render(LabelTestWrapper, { field: 'Email', required: { message: 'Required field' } });
		await expect.element(page.getByRole('textbox', { name: 'Email', exact: true })).toBeInTheDocument();
	});

	it('applies typography to the label text without changing the field wrapper', async () => {
		render(LabelTestWrapper, { size: 'large', weight: 'semibold' });
		expect(getComputedStyle(label().element()).fontWeight).toBe('600');
		expect(getComputedStyle(wrapper().element()).fontWeight).not.toBe('600');
	});
});
