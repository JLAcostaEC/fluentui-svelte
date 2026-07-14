import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Button } from '$lib/index.js';

describe('element type', () => {
	it('renders as a <button> by default', async () => {
		render(Button);
		const el = page.getByRole('button');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders as an <a> when as="a"', async () => {
		render(Button, { as: 'a', href: '#' });
		const el = page.getByRole('link');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders as a <div> when as="div"', async () => {
		render(Button, { as: 'div' });
		// div has no implicit role, query by class
		const el = await page.selector('div.fs-button');

		await expect.element(el).toBeInTheDocument();
	});

	it('throws an error when as is set to an unsupported value', async () => {
		// @ts-expect-error forcing 'as' to an unsupported value
		expect(() => render(Button, { as: 'span' })).toThrow(
			"Invalid 'as' prop value: span. Expected 'button', 'a', or 'div'."
		);
	});
});

describe('indicator position', () => {
	it('renders indicator after content by default', async () => {
		render(Button, { isMenuButton: true });
		const button = page.getByRole('button');
		const indicator = button.nth(0);
		await expect.element(indicator).toBeInTheDocument();
	});

	it('renders indicator before content when indicatorPosition="before"', async () => {
		render(Button, { isMenuButton: true, indicatorPosition: 'before', 'data-testid': 'fs-button' });
		const indicator = page.selector('.indicator').nth(0);

		await expect.element(indicator).toHaveClass('indicator');
	});

	it('does not render indicator when isMenuButton is false', async () => {
		render(Button, { isMenuButton: false, 'data-testid': 'fs-button' });
		const indicator = page.selector('.indicator');

		await expect.element(indicator).not.toBeInTheDocument();
	});
});

describe('tabindex', () => {
	it('does not add tabindex when rendered as <div>', async () => {
		render(Button, { as: 'div', 'data-testid': 'fs-button' });
		const el = page.getByTestId('fs-button');
		await expect.element(el).not.toHaveAttribute('tabindex');
	});

	it('does not add tabindex when rendered as <button>', async () => {
		render(Button);
		const el = page.getByRole('button');
		await expect.element(el).not.toHaveAttribute('tabindex');
	});

	it('does not add tabindex when rendered as <a>', async () => {
		render(Button, { as: 'a', href: '#' });
		const el = page.getByRole('link');
		await expect.element(el).not.toHaveAttribute('tabindex');
	});
});

describe('event handlers', () => {
	it('calls onclick when clicked', async () => {
		const onclick = vi.fn();
		render(Button, { onclick });
		await page.getByRole('button').click();
		expect(onclick).toHaveBeenCalledOnce();
	});

	it('does not call onclick when disabled', async () => {
		const onclick = vi.fn();
		render(Button, { onclick, disabled: true });
		await page.getByRole('button').click({ force: true });
		expect(onclick).not.toHaveBeenCalled();
	});

	it('calls onkeydown when a key is pressed', async () => {
		const onkeydown = vi.fn();
		render(Button, { onkeydown });
		const button = await page.getByRole('button');
		await userEvent.tab();
		expect(button).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		expect(onkeydown).toHaveBeenCalledOnce();
	});

	it('does not call onkeydown when disabled', async () => {
		const onkeydown = vi.fn();
		render(Button, { onkeydown, disabled: true });
		const button = await page.getByRole('button');
		await userEvent.tab();
		expect(button).not.toHaveFocus();
		await userEvent.keyboard('{Enter}');
		expect(onkeydown).not.toHaveBeenCalled();
	});
});
