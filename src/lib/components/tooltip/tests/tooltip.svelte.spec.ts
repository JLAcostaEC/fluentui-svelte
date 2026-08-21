import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TooltipTestWrapper from './TooltipTestWrapper.svelte';

const tooltip = () => page.getByRole('tooltip', { includeHidden: true });
const trigger = () => page.getByTestId('trigger');

/** The tooltip element stays mounted; a class is what hides it. */
const isHidden = () => document.querySelector('.fs-tooltip')?.classList.contains('tooltip-hidden') ?? true;

describe('rendering', () => {
	it('renders the tooltip element and its trigger', async () => {
		render(TooltipTestWrapper);
		await expect.element(trigger()).toBeInTheDocument();
		await expect.element(tooltip()).toBeInTheDocument();
	});

	it('renders string content', async () => {
		render(TooltipTestWrapper, { content: 'More information', open: true });
		await expect.element(tooltip()).toHaveTextContent('More information');
	});

	it('renders the arrow when asked', async () => {
		render(TooltipTestWrapper, { open: true, withArrow: true });
		await expect.element(page.selector('.fs-tooltip-arrow')).toBeInTheDocument();
	});

	it('leaves the arrow out by default', async () => {
		render(TooltipTestWrapper, { open: true });
		await expect.element(page.selector('.fs-tooltip-arrow')).not.toBeInTheDocument();
	});
});

describe('visibility', () => {
	it('is hidden until something opens it', async () => {
		render(TooltipTestWrapper);
		expect(isHidden()).toBe(true);
	});

	it('is visible when opened through the binding', async () => {
		render(TooltipTestWrapper, { open: true });
		await vi.waitFor(() => expect(isHidden()).toBe(false));
	});

	it('opens on hover', async () => {
		render(TooltipTestWrapper, { openDelay: 0 });

		await trigger().hover();

		await vi.waitFor(() => expect(isHidden()).toBe(false));
	});

	it('opens on focus', async () => {
		render(TooltipTestWrapper, { openDelay: 0 });

		document.querySelector<HTMLButtonElement>('button')?.focus();

		await vi.waitFor(() => expect(isHidden()).toBe(false));
	});

	it('closes again once the focus leaves', async () => {
		render(TooltipTestWrapper, { openDelay: 0, hideDelay: 0 });

		document.querySelector<HTMLButtonElement>('button')?.focus();
		await vi.waitFor(() => expect(isHidden()).toBe(false));

		await userEvent.tab();

		await vi.waitFor(() => expect(isHidden()).toBe(true));
	});

	it('reports the change to onVisibleChange', async () => {
		const onVisibleChange = vi.fn();
		render(TooltipTestWrapper, { openDelay: 0, onVisibleChange });

		await trigger().hover();

		await vi.waitFor(() => expect(onVisibleChange).toHaveBeenCalledWith(true));
	});
});

describe('relationship', () => {
	it('labels its trigger by default', async () => {
		render(TooltipTestWrapper, { content: 'Save the file' });
		await expect.element(trigger()).toHaveAttribute('aria-labelledby');
		await expect.element(trigger()).not.toHaveAttribute('aria-describedby');
	});

	it('lends its content to the trigger as the accessible name', async () => {
		render(TooltipTestWrapper, { content: 'Save the file' });
		await expect.element(page.getByRole('button', { name: 'Save the file' })).toBeInTheDocument();
	});

	it('leaves the trigger its own name when it only describes it', async () => {
		render(TooltipTestWrapper, { content: 'Save the file', relationship: 'description' });
		await expect.element(page.getByRole('button', { name: 'Hover over me' })).toBeInTheDocument();
	});

	it('describes its trigger when asked', async () => {
		render(TooltipTestWrapper, { content: 'Save the file', relationship: 'description' });
		await expect.element(trigger()).toHaveAttribute('aria-describedby');
		await expect.element(trigger()).not.toHaveAttribute('aria-labelledby');
	});

	it('stays out of the accessibility tree when it is inaccessible', async () => {
		render(TooltipTestWrapper, { content: 'Save the file', relationship: 'inaccessible' });
		await expect.element(trigger()).not.toHaveAttribute('aria-labelledby');
		await expect.element(trigger()).not.toHaveAttribute('aria-describedby');
	});

	it('points the relationship at the tooltip it renders', async () => {
		render(TooltipTestWrapper, { content: 'Save the file', relationship: 'description' });

		const button = document.querySelector('button')!;
		const described = button.getAttribute('aria-describedby');

		expect(described).toBeTruthy();
		expect(document.getElementById(described!)).toHaveClass('fs-tooltip');
	});
});
