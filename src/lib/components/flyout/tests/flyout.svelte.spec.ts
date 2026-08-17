import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FlyoutTestWrapper from './FlyoutTestWrapper.svelte';

describe('rendering', () => {
	it('renders a wrapper with the fs-flyout class', async () => {
		render(FlyoutTestWrapper);
		const el = page.selector('.fs-flyout');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders its children', async () => {
		render(FlyoutTestWrapper, { content: 'Inside the flyout' });
		const el = page.getByText('Inside the flyout');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('roundCorners', () => {
	it('applies round-all by default', async () => {
		render(FlyoutTestWrapper);
		const el = page.selector('.fs-flyout');
		await expect.element(el).toHaveClass('round-all');
	});

	it('applies round-top when roundCorners="top"', async () => {
		render(FlyoutTestWrapper, { roundCorners: 'top' });
		const el = page.selector('.fs-flyout');
		await expect.element(el).toHaveClass('round-top');
	});

	it('applies round-bottom when roundCorners="bottom"', async () => {
		render(FlyoutTestWrapper, { roundCorners: 'bottom' });
		const el = page.selector('.fs-flyout');
		await expect.element(el).toHaveClass('round-bottom');
	});

	it('applies round-left when roundCorners="left"', async () => {
		render(FlyoutTestWrapper, { roundCorners: 'left' });
		const el = page.selector('.fs-flyout');
		await expect.element(el).toHaveClass('round-left');
	});

	it('applies round-right when roundCorners="right"', async () => {
		render(FlyoutTestWrapper, { roundCorners: 'right' });
		const el = page.selector('.fs-flyout');
		await expect.element(el).toHaveClass('round-right');
	});
});

describe('floating', () => {
	it('does not apply the floating class by default', async () => {
		render(FlyoutTestWrapper);
		const el = page.selector('.fs-flyout');
		await expect.element(el).not.toHaveClass('floating');
	});

	it('applies the floating class when floating is true', async () => {
		render(FlyoutTestWrapper, { floating: true });
		const el = page.selector('.fs-flyout');
		await expect.element(el).toHaveClass('floating');
	});
});

describe('custom class and attributes', () => {
	it('applies a custom class', async () => {
		render(FlyoutTestWrapper, { class: 'my-custom-class' });
		const el = page.selector('.fs-flyout');
		await expect.element(el).toHaveClass('my-custom-class');
	});

	it('forwards extra attributes to the root element', async () => {
		render(FlyoutTestWrapper, { 'data-testid': 'my-flyout' });
		const el = page.getByTestId('my-flyout');
		await expect.element(el).toBeInTheDocument();
	});
});
