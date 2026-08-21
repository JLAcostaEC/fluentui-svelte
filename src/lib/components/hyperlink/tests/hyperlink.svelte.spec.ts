import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Hyperlink } from '$lib/index.js';
import HyperlinkTestWrapper from './HyperlinkTestWrapper.svelte';

const link = () => page.getByRole('link');

describe('rendering', () => {
	it('renders an anchor', async () => {
		render(Hyperlink);
		await expect.element(link()).toBeInTheDocument();
		await expect.element(link()).toHaveClass(/fs-hyperlink/);
	});

	it('points at "#" when no href is given', async () => {
		render(Hyperlink);
		await expect.element(link()).toHaveAttribute('href', '#');
	});

	it('points at the href it is given', async () => {
		render(Hyperlink, { href: 'https://example.com' });
		await expect.element(link()).toHaveAttribute('href', 'https://example.com');
	});

	it('renders its children as the label', async () => {
		render(HyperlinkTestWrapper, { label: 'Docs' });
		await expect.element(page.getByText('Docs')).toBeInTheDocument();
	});

	it('falls back to showing the href when there are no children', async () => {
		render(Hyperlink, { href: 'https://example.com' });
		await expect.element(page.getByText('https://example.com')).toBeInTheDocument();
	});
});

describe('disabled', () => {
	it('is not disabled by default', async () => {
		render(HyperlinkTestWrapper);
		await expect.element(link()).not.toHaveAttribute('aria-disabled');
		await expect.element(link()).not.toHaveAttribute('tabindex');
	});

	it('announces itself as disabled and leaves the tab order', async () => {
		render(HyperlinkTestWrapper, { disabled: true });
		await expect.element(link()).toHaveAttribute('aria-disabled', 'true');
		await expect.element(link()).toHaveAttribute('tabindex', '-1');
		await expect.element(link()).toHaveClass(/disabled/);
	});

	it('is not clickable while disabled', async () => {
		render(HyperlinkTestWrapper, { disabled: true });

		// Playwright refuses to act on it: `aria-disabled` makes it a disabled control,
		// which is the whole point of the attribute.
		await expect(link().click({ timeout: 300 })).rejects.toThrow();
	});

	it('cancels the navigation of a click it does receive while disabled', async () => {
		render(HyperlinkTestWrapper, { disabled: true, href: '#somewhere' });
		const el = document.querySelector<HTMLAnchorElement>('a.fs-hyperlink')!;

		const event = new MouseEvent('click', { bubbles: true, cancelable: true });
		el.dispatchEvent(event);

		expect(event.defaultPrevented).toBe(true);
	});

	it('passes the click through when it is not disabled', async () => {
		const onclick = vi.fn();
		render(HyperlinkTestWrapper, { onclick });

		await link().click();

		expect(onclick).toHaveBeenCalled();
	});
});
