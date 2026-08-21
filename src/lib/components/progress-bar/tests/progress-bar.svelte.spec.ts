import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { ProgressBar } from '$lib/index.js';

const bar = () => page.getByRole('progressbar');

describe('rendering', () => {
	it('renders a progressbar', async () => {
		render(ProgressBar);
		await expect.element(bar()).toBeInTheDocument();
		await expect.element(bar()).toHaveClass(/fs-progress-bar/);
	});

	it('renders the rail by default', async () => {
		render(ProgressBar, { value: 40 });
		await expect.element(page.selector('.progress-bar-rail')).toBeInTheDocument();
	});

	it('drops the rail when asked', async () => {
		render(ProgressBar, { value: 40, hideRail: true });
		await expect.element(page.selector('.progress-bar-rail')).not.toBeInTheDocument();
	});
});

describe('value', () => {
	it('announces the value it is given', async () => {
		render(ProgressBar, { value: 40 });
		await expect.element(bar()).toHaveAttribute('aria-valuenow', '40');
	});

	it('spans 0 to 100 by default', async () => {
		render(ProgressBar, { value: 40 });
		await expect.element(bar()).toHaveAttribute('aria-valuemin', '0');
		await expect.element(bar()).toHaveAttribute('aria-valuemax', '100');
	});

	it('takes the range it is given', async () => {
		render(ProgressBar, { value: 5, min: 0, max: 10 });
		await expect.element(bar()).toHaveAttribute('aria-valuemax', '10');
		await expect.element(bar()).toHaveAttribute('aria-valuenow', '5');
	});

	it('clamps a value above the maximum', async () => {
		render(ProgressBar, { value: 150 });
		await expect.element(bar()).toHaveAttribute('aria-valuenow', '100');
	});

	it('clamps a value below the minimum', async () => {
		render(ProgressBar, { value: -20 });
		await expect.element(bar()).toHaveAttribute('aria-valuenow', '0');
	});

	it('fills the track to the percentage of the value', async () => {
		render(ProgressBar, { value: 25 });
		await expect.element(page.selector('rect.progress-bar-track')).toHaveAttribute('width', '25%');
	});
});

describe('indeterminate', () => {
	it('is indeterminate when no value is given', async () => {
		render(ProgressBar);
		await expect.element(bar()).toHaveClass(/indeterminate/);
		await expect.element(bar()).not.toHaveAttribute('aria-valuenow');
	});

	it('renders the second track it animates while indeterminate', async () => {
		render(ProgressBar);
		await expect.element(page.selector('.progress-bar-secondary')).toBeInTheDocument();
	});

	it('drops the second track once it has a value', async () => {
		render(ProgressBar, { value: 10 });
		await expect.element(page.selector('.progress-bar-secondary')).not.toBeInTheDocument();
	});
});

describe('status', () => {
	it('carries no status by default', async () => {
		render(ProgressBar, { value: 10 });
		await expect.element(bar()).not.toHaveClass(/status-/);
	});

	it('recolours the track for the status it is given', async () => {
		render(ProgressBar, { value: 10, status: 'error' });
		await expect.element(bar()).toHaveClass(/status-error/);
	});
});
