// Test both components (Badge and BadgeIcon)
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Badge, BadgeIcon } from '$lib/index.js';

describe('Badge', () => {
	it('renders as a span element', async () => {
		render(Badge);
		const el = page.selector('.fs-badge');
		await expect.element(el).toBeInTheDocument();
	});

	it('applies custom shape class', async () => {
		render(Badge, { shape: 'rounded' });
		const el = page.selector('.fs-badge');
		await expect.element(el).toHaveClass('rounded');
	});

	it('forwards extra attributes', async () => {
		render(Badge, { 'data-testid': 'my-badge' });
		const el = page.getByTestId('my-badge');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('BadgeIcon', () => {
	it('renders as a span with role="img"', async () => {
		render(BadgeIcon);
		const el = page.getByRole('img');
		await expect.element(el).toBeInTheDocument();
	});

	it('has aria-label derived from status', async () => {
		render(BadgeIcon, { status: 'available' });
		const el = page.getByRole('img');
		await expect.element(el).toHaveAttribute('aria-label', 'Available');
	});

	it('applies correct color class for available status', async () => {
		render(BadgeIcon, { status: 'available' });
		const el = page.selector('.fs-badge-icon');
		await expect.element(el).toHaveClass('success');
	});

	it('applies correct color class for busy status', async () => {
		render(BadgeIcon, { status: 'busy' });
		const el = page.selector('.fs-badge-icon');
		await expect.element(el).toHaveClass('critical');
	});

	it('applies correct color class for away status', async () => {
		render(BadgeIcon, { status: 'away' });
		const el = page.selector('.fs-badge-icon');
		await expect.element(el).toHaveClass('warning');
	});

	it('applies correct color class for offline status', async () => {
		render(BadgeIcon, { status: 'offline' });
		const el = page.selector('.fs-badge-icon');
		await expect.element(el).toHaveClass('information');
	});

	it('applies correct color class for do-not-disturb status', async () => {
		render(BadgeIcon, { status: 'do-not-disturb' });
		const el = page.selector('.fs-badge-icon');
		await expect.element(el).toHaveClass('critical');
	});

	it('applies aria-label for do-not-disturb as "Do Not Disturb"', async () => {
		render(BadgeIcon, { status: 'do-not-disturb' });
		const el = page.getByRole('img');
		await expect.element(el).toHaveAttribute('aria-label', 'Do Not Disturb');
	});

	it('allows overriding color via prop', async () => {
		render(BadgeIcon, { status: 'available', color: 'critical' });
		const el = page.selector('.fs-badge-icon');
		await expect.element(el).toHaveClass('critical');
	});

	it('forwards extra attributes', async () => {
		render(BadgeIcon, { 'data-testid': 'my-badge-icon' });
		const el = page.getByTestId('my-badge-icon');
		await expect.element(el).toBeInTheDocument();
	});
});
