import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { InfoBar } from '$lib/index.js';
import InfoBarTestWrapper from './InfoBarTestWrapper.svelte';

const bar = () => page.selector('.fs-info-bar');
const closeButton = () => page.getByRole('button', { name: 'Close InfoBar' });

describe('rendering', () => {
	it('renders the bar', async () => {
		render(InfoBar);
		await expect.element(bar()).toBeInTheDocument();
	});

	it('renders the title it is given', async () => {
		render(InfoBar, { title: 'Update available' });
		await expect.element(page.getByRole('heading', { name: 'Update available' })).toBeInTheDocument();
	});

	it('renders the message passed as children', async () => {
		render(InfoBarTestWrapper, { message: 'Your changes were saved.' });
		await expect.element(page.getByText('Your changes were saved.')).toBeInTheDocument();
	});
});

describe('status', () => {
	it('is informational by default', async () => {
		render(InfoBar);
		await expect.element(bar()).toHaveClass(/information/);
	});

	it('takes the status it is given', async () => {
		render(InfoBar, { status: 'critical' });
		await expect.element(bar()).toHaveClass(/critical/);
	});
});

describe('layout', () => {
	it('lays the message out inline by default', async () => {
		render(InfoBar);
		await expect.element(bar()).toHaveClass(/inline/);
	});

	it('stacks the message below the title when asked', async () => {
		render(InfoBar, { style: 'multiline' });
		await expect.element(bar()).toHaveClass(/multiline/);
	});
});

describe('dismissing', () => {
	it('offers a close button by default', async () => {
		render(InfoBar);
		await expect.element(closeButton()).toBeInTheDocument();
	});

	it('drops the close button when asked', async () => {
		render(InfoBar, { hideCloseButton: true });
		await expect.element(closeButton()).not.toBeInTheDocument();
	});

	it('takes itself off the page when closed', async () => {
		render(InfoBarTestWrapper, { message: 'Your changes were saved.' });
		await expect.element(bar()).toBeInTheDocument();

		await closeButton().click();

		await expect.element(bar()).not.toBeInTheDocument();
	});
});
