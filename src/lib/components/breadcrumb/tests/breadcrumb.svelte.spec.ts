import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import BreadcrumbTestWrapper from './BreadcrumbTestWrapper.svelte';

describe('Breadcrumb', () => {
	it('renders a landmark around an ordered list', async () => {
		render(BreadcrumbTestWrapper);
		const nav = page.getByRole('navigation', { name: 'Breadcrumb' });
		await expect.element(nav).toBeInTheDocument();
		await expect.element(page.selector('nav.fs-breadcrumb > ol.fs-breadcrumb-list')).toBeInTheDocument();
	});

	it('takes a name of its own when one is given', async () => {
		render(BreadcrumbTestWrapper, { 'aria-label': 'You are here' });
		await expect.element(page.getByRole('navigation', { name: 'You are here' })).toBeInTheDocument();
	});

	it('steps aside for aria-labelledby rather than naming itself twice', async () => {
		render(BreadcrumbTestWrapper, { 'aria-labelledby': 'somewhere' });
		const nav = page.selector('nav.fs-breadcrumb');
		await expect.element(nav).toHaveAttribute('aria-labelledby', 'somewhere');
		await expect.element(nav).not.toHaveAttribute('aria-label');
	});

	it('carries the size as a class', async () => {
		render(BreadcrumbTestWrapper, { size: 'large' });
		await expect.element(page.selector('nav.fs-breadcrumb')).toHaveClass('large');
	});

	it('marks the end of the trail as the current page', async () => {
		render(BreadcrumbTestWrapper);
		await expect.element(page.getByText('This page')).toBeInTheDocument();
		await expect.element(page.selector('[aria-current="page"]')).toHaveTextContent('This page');
		// Only the last step claims it.
		expect(page.selector('[aria-current="page"]').elements()).toHaveLength(1);
	});

	it('holds the dividers out of the accessibility tree', async () => {
		render(BreadcrumbTestWrapper);
		const dividers = page.selector('.fs-breadcrumb-divider');
		expect(dividers.elements()).toHaveLength(2);
		await expect.element(dividers.first()).toHaveAttribute('aria-hidden', 'true');
		// A trail of three steps reads as three, not as five.
		expect(page.getByRole('listitem').elements()).toHaveLength(3);
	});

	it('renders the steps that go somewhere as anchors, and the last as a button', async () => {
		render(BreadcrumbTestWrapper);
		await expect.element(page.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
		await expect.element(page.selector('button.fs-breadcrumb-button')).toHaveTextContent('This page');
	});

	it('renders the icon of a step', async () => {
		render(BreadcrumbTestWrapper, { withIcon: true });
		await expect.element(page.selector('.fs-breadcrumb-button-icon svg').first()).toBeInTheDocument();
	});
});

describe('a disabled step', () => {
	it('is out of the tab order and answers no click', async () => {
		const onclick = vi.fn();
		render(BreadcrumbTestWrapper, { buttonProps: { disabled: true, onclick } });

		const step = page.selector('button.fs-breadcrumb-button');
		// The attribute of the button is what takes it out of the tab order, so it is the one to read.
		await expect.element(step).toHaveAttribute('disabled');
		await expect.element(step).toHaveAttribute('aria-disabled', 'true');
		expect(onclick).not.toHaveBeenCalled();
	});

	it('keeps its place in the tab order when it is disabledFocusable', async () => {
		const onclick = vi.fn();
		render(BreadcrumbTestWrapper, { buttonProps: { disabled: true, disabledFocusable: true, onclick } });

		const step = page.selector('button.fs-breadcrumb-button');
		await expect.element(step).not.toHaveAttribute('disabled');
		await expect.element(step).toHaveAttribute('aria-disabled', 'true');

		// Reachable, and still inert: the click is answered and cancelled.
		(step.element() as HTMLElement).focus();
		await expect.element(step).toHaveFocus();
		(step.element() as HTMLElement).click();
		expect(onclick).not.toHaveBeenCalled();
	});
});

describe('focusMode', () => {
	it('leaves every step its own tab stop by default', async () => {
		render(BreadcrumbTestWrapper);
		await expect.element(page.selector('ol.fs-breadcrumb-list')).not.toHaveAttribute('data-tabspot');
	});

	it('gives the trail a single tab stop and walks it with the arrows', async () => {
		render(BreadcrumbTestWrapper, { focusMode: 'arrow' });
		await expect.element(page.selector('ol.fs-breadcrumb-list')).toHaveAttribute('data-tabspot');

		const steps = page.selector('.fs-breadcrumb-button');
		(steps.elements()[0] as HTMLElement).focus();
		await expect.element(steps.first()).toHaveFocus();

		await userEvent.keyboard('{ArrowRight}');
		await expect.element(steps.nth(1)).toHaveFocus();

		await userEvent.keyboard('{End}');
		await expect.element(steps.nth(2)).toHaveFocus();
	});
});

describe('a step that holds something else', () => {
	it('takes whatever the consumer puts in it, which is what an overflow menu needs', async () => {
		render(BreadcrumbTestWrapper, { withSlot: true });
		// The slot is a step of the trail like any other, and the list still counts it as one item.
		await expect.element(page.getByRole('button', { name: 'More steps' })).toBeInTheDocument();
		expect(page.getByRole('listitem').elements()).toHaveLength(4);
	});
});
