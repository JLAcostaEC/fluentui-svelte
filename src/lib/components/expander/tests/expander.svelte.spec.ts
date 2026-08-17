import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Expander } from '$lib/index.js';
import ExpanderTestWrapper from './ExpanderTestWrapper.svelte';

describe('rendering', () => {
	it('renders a details element with the fs-expander class', async () => {
		render(Expander, { header: 'Title' });
		const el = page.selector('details.fs-expander');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders the header text', async () => {
		render(Expander, { header: 'My header' });
		const el = page.getByText('My header');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders the description when provided', async () => {
		render(Expander, { header: 'Title', description: 'A description' });
		const el = page.getByText('A description');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders a summary element', async () => {
		render(Expander, { header: 'Title' });
		const el = page.selector('summary.fs-summary');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('direction', () => {
	it('applies the "down" direction class by default', async () => {
		render(Expander, { header: 'Title' });
		const el = page.selector('details.fs-expander');
		await expect.element(el).toHaveClass('down');
	});

	it('applies the "up" direction class', async () => {
		render(Expander, { header: 'Title', direction: 'up' });
		const el = page.selector('details.fs-expander');
		await expect.element(el).toHaveClass('up');
	});
});

describe('expanded state', () => {
	it('is collapsed by default (no open attribute)', async () => {
		render(Expander, { header: 'Title' });
		const el = page.selector('details.fs-expander');
		await expect.element(el).not.toHaveAttribute('open');
	});

	it('is open when expanded is true', async () => {
		render(Expander, { header: 'Title', expanded: true });
		const el = page.selector('details.fs-expander');
		await expect.element(el).toHaveAttribute('open');
	});

	it('opens when the summary is clicked', async () => {
		render(ExpanderTestWrapper);
		const el = page.selector('details.fs-expander');
		await expect.element(el).not.toHaveAttribute('open');
		await page.selector('summary.fs-summary').click();
		await expect.element(el).toHaveAttribute('open');
	});

	it('closes again on a second click', async () => {
		render(ExpanderTestWrapper, { expanded: true });
		const el = page.selector('details.fs-expander');
		await expect.element(el).toHaveAttribute('open');
		await page.selector('summary.fs-summary').click();
		await expect.element(el).not.toHaveAttribute('open');
	});
});

describe('disabled state', () => {
	it('applies the disabled class', async () => {
		render(Expander, { header: 'Title', disabled: true });
		const el = page.selector('details.fs-expander');
		await expect.element(el).toHaveClass('disabled');
	});

	it('does not toggle when disabled', async () => {
		render(ExpanderTestWrapper, { disabled: true });
		const el = page.selector('details.fs-expander');
		await expect.element(el).not.toHaveAttribute('open');
		await page.selector('summary.fs-summary').click({ force: true });
		await expect.element(el).not.toHaveAttribute('open');
	});
});

describe('justify', () => {
	it('applies the justify class', async () => {
		render(Expander, { header: 'Title', justify: true });
		const el = page.selector('details.fs-expander');
		await expect.element(el).toHaveClass('justify');
	});
});

describe('content', () => {
	it('renders the child content', async () => {
		render(ExpanderTestWrapper, { content: 'Hello from inside' });
		const el = page.getByText('Hello from inside');
		await expect.element(el).toBeInTheDocument();
	});
});
