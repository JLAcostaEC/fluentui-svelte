import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { SplitButton } from '$lib/index.js';

const baseProps = {
	primaryButtonProps: {},
	menuTriggerProps: {}
};

describe('rendering', () => {
	it('renders a wrapper div with two buttons', async () => {
		render(SplitButton, baseProps);
		const wrapper = page.selector('.fs-split-button');
		await expect.element(wrapper).toBeInTheDocument();
		const buttons = page.getByRole('button');
		await expect.element(buttons.nth(0)).toBeInTheDocument();
		await expect.element(buttons.nth(1)).toBeInTheDocument();
	});

	it('renders the menu trigger with a chevron indicator', async () => {
		render(SplitButton, baseProps);
		const indicator = page.selector('.menu-button .indicator');
		await expect.element(indicator).toBeInTheDocument();
	});
});

describe('appearance', () => {
	it('applies accent appearance by default', async () => {
		render(SplitButton, baseProps);
		const buttons = page.selector('.fs-button.accent');
		await expect.element(buttons.nth(0)).toBeInTheDocument();
	});

	it('applies standard appearance to both buttons', async () => {
		render(SplitButton, { ...baseProps, appearance: 'standard' });
		const buttons = page.selector('.fs-button.standard');
		await expect.element(buttons.nth(0)).toBeInTheDocument();
		await expect.element(buttons.nth(1)).toBeInTheDocument();
	});

	it('applies subtle appearance to both buttons', async () => {
		render(SplitButton, { ...baseProps, appearance: 'subtle' });
		const buttons = page.selector('.fs-button.subtle');
		await expect.element(buttons.nth(0)).toBeInTheDocument();
		await expect.element(buttons.nth(1)).toBeInTheDocument();
	});
});

describe('shape', () => {
	it('applies rounded shape by default', async () => {
		render(SplitButton, baseProps);
		const buttons = page.selector('.fs-button.rounded');
		await expect.element(buttons.nth(0)).toBeInTheDocument();
	});

	it('applies circular shape to both buttons', async () => {
		render(SplitButton, { ...baseProps, shape: 'circular' });
		const buttons = page.selector('.fs-button.circular');
		await expect.element(buttons.nth(0)).toBeInTheDocument();
		await expect.element(buttons.nth(1)).toBeInTheDocument();
	});
});

describe('disabled state', () => {
	it('disables both buttons when disabled is true', async () => {
		render(SplitButton, { ...baseProps, disabled: true });
		const buttons = page.getByRole('button');
		await expect.element(buttons.nth(0)).toHaveAttribute('disabled');
		await expect.element(buttons.nth(1)).toHaveAttribute('disabled');
	});
});

describe('event handlers', () => {
	it('calls primaryButtonProps.onclick on primary button click', async () => {
		const onclick = vi.fn();
		render(SplitButton, {
			primaryButtonProps: { onclick },
			menuTriggerProps: {}
		});
		await page.getByRole('button').nth(0).click();
		expect(onclick).toHaveBeenCalledOnce();
	});

	it('calls menuTriggerProps.onclick on menu trigger click', async () => {
		const onclick = vi.fn();
		render(SplitButton, {
			primaryButtonProps: {},
			menuTriggerProps: { onclick }
		});
		await page.getByRole('button').nth(1).click();
		expect(onclick).toHaveBeenCalledOnce();
	});
});

describe('attributes', () => {
	it('forwards extra attributes to the wrapper', async () => {
		render(SplitButton, { ...baseProps, 'data-testid': 'split-wrapper' });
		const el = page.getByTestId('split-wrapper');
		await expect.element(el).toBeInTheDocument();
	});
});
