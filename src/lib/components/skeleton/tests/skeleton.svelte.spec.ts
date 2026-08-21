import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Skeleton } from '$lib/index.js';

const skeleton = () => page.selector('.fs-skeleton');

describe('rendering', () => {
	it('renders a div by default', async () => {
		render(Skeleton);
		await expect.element(page.selector('div.fs-skeleton')).toBeInTheDocument();
	});

	it('renders as the tag given in "as"', async () => {
		render(Skeleton, { as: 'span' });
		await expect.element(page.selector('span.fs-skeleton')).toBeInTheDocument();
	});
});

describe('animation', () => {
	it('waves by default', async () => {
		render(Skeleton);
		await expect.element(skeleton()).toHaveClass(/wave/);
	});

	it('pulses when asked', async () => {
		render(Skeleton, { animation: 'pulse' });
		await expect.element(skeleton()).toHaveClass(/pulse/);
	});
});

describe('shape', () => {
	it('is rounded by default', async () => {
		render(Skeleton);
		await expect.element(skeleton()).toHaveClass(/rounded/);
	});

	it('takes the shape it is given', async () => {
		render(Skeleton, { shape: 'circular' });
		await expect.element(skeleton()).toHaveClass(/circular/);
	});
});

describe('justify', () => {
	it('does not stretch by default', async () => {
		render(Skeleton);
		await expect.element(skeleton()).not.toHaveClass(/justify/);
	});

	it('stretches to the full width when justified', async () => {
		render(Skeleton, { justify: true });
		await expect.element(skeleton()).toHaveClass(/justify/);
	});
});
