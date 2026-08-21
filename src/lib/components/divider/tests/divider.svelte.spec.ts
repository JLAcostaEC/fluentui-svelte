import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Divider } from '$lib/index.js';
import DividerTestWrapper from './DividerTestWrapper.svelte';

const separator = () => page.getByRole('separator');

describe('rendering', () => {
	it('renders a separator', async () => {
		render(Divider);
		await expect.element(separator()).toBeInTheDocument();
		await expect.element(separator()).toHaveClass(/fs-divider/);
	});

	it('renders as the tag given in "as"', async () => {
		render(Divider, { as: 'hr' });
		await expect.element(page.selector('hr.fs-divider')).toBeInTheDocument();
	});

	it('renders its children as the label on the line', async () => {
		render(DividerTestWrapper, { label: 'Section' });
		await expect.element(page.getByText('Section')).toBeInTheDocument();
	});
});

describe('orientation', () => {
	it('is horizontal by default', async () => {
		render(Divider);
		await expect.element(separator()).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('announces itself as vertical when asked', async () => {
		render(Divider, { vertical: true });
		await expect.element(separator()).toHaveAttribute('aria-orientation', 'vertical');
		await expect.element(separator()).toHaveClass(/vertical/);
	});
});

describe('appearance', () => {
	it('centres its label by default', async () => {
		render(Divider);
		await expect.element(separator()).toHaveClass(/align-center/);
	});

	it('takes the alignment it is given', async () => {
		render(Divider, { alignContent: 'start' });
		await expect.element(separator()).toHaveClass(/align-start/);
	});

	it('takes the appearance it is given', async () => {
		render(Divider, { appearance: 'accent' });
		await expect.element(separator()).toHaveClass(/accent/);
	});

	it('drops its padding when inset', async () => {
		render(Divider, { inset: true });
		await expect.element(separator()).toHaveClass(/inset/);
	});
});
