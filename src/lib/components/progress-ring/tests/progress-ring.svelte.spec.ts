import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { ProgressRing } from '$lib/index.js';

const ring = () => page.selector('svg.progress-ring');

describe('rendering', () => {
	it('renders a progressbar when it reports a value', async () => {
		render(ProgressRing, { value: 40 });
		await expect.element(page.getByRole('progressbar')).toBeInTheDocument();
	});

	it('is 32px across by default', async () => {
		render(ProgressRing);
		await expect.element(ring()).toHaveAttribute('width', '32');
		await expect.element(ring()).toHaveAttribute('height', '32');
	});

	it('takes the size it is given', async () => {
		render(ProgressRing, { size: 64 });
		await expect.element(ring()).toHaveAttribute('width', '64');
	});

	it('renders the rail by default', async () => {
		render(ProgressRing, { value: 40 });
		await expect.element(page.selector('.progress-ring-rail')).toBeInTheDocument();
	});

	it('drops the rail when asked', async () => {
		render(ProgressRing, { value: 40, hideRail: true });
		await expect.element(page.selector('.progress-ring-rail')).not.toBeInTheDocument();
	});
});

describe('value', () => {
	it('announces the value it is given', async () => {
		render(ProgressRing, { value: 40 });
		await expect.element(ring()).toHaveAttribute('aria-valuenow', '40');
	});

	it('clamps a value above the maximum', async () => {
		render(ProgressRing, { value: 150 });
		await expect.element(ring()).toHaveAttribute('aria-valuenow', '100');
	});

	it('clamps a value below the minimum', async () => {
		render(ProgressRing, { value: -20 });
		await expect.element(ring()).toHaveAttribute('aria-valuenow', '0');
	});

	it('describes the progress in its label', async () => {
		render(ProgressRing, { value: 40 });
		await expect.element(ring()).toHaveAttribute('aria-label', 'Progress: 40%');
	});
});

describe('indeterminate', () => {
	it('becomes a status region with no value to report', async () => {
		render(ProgressRing, { indeterminate: true });
		await expect.element(page.getByRole('status')).toBeInTheDocument();
		await expect.element(ring()).not.toHaveAttribute('aria-valuenow');
		await expect.element(ring()).toHaveClass(/indeterminate/);
	});

	it('says it is loading', async () => {
		render(ProgressRing, { indeterminate: true });
		await expect.element(ring()).toHaveAttribute('aria-label', 'Loading');
	});

	it('says what it is waiting on when it carries a status', async () => {
		render(ProgressRing, { indeterminate: true, status: 'paused' });
		await expect.element(ring()).toHaveAttribute('aria-label', 'Status: paused');
	});

	it('keeps a label the consumer wrote', async () => {
		render(ProgressRing, { indeterminate: true, 'aria-label': 'Uploading photos' });
		await expect.element(ring()).toHaveAttribute('aria-label', 'Uploading photos');
	});
});

describe('status', () => {
	it('recolours the track for the status it is given', async () => {
		render(ProgressRing, { value: 10, status: 'error' });
		await expect.element(ring()).toHaveClass(/status-error/);
	});
});
