import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { ToggleSwitch } from '$lib/index.js';
import ToggleSwitchTestWrapper from './ToggleSwitchTestWrapper.svelte';

const toggle = () => page.getByRole('switch');
const state = () => page.getByTestId('state');

describe('rendering', () => {
	it('renders a checkbox that announces itself as a switch', async () => {
		render(ToggleSwitch);
		await expect.element(toggle()).toBeInTheDocument();
		await expect.element(toggle()).toHaveAttribute('type', 'checkbox');
	});

	it('wraps the input in a label', async () => {
		render(ToggleSwitch);
		await expect.element(page.selector('label.fs-toggle-switch')).toBeInTheDocument();
	});

	it('renders the label text it is given', async () => {
		render(ToggleSwitch, { label: 'Wi-Fi' });
		await expect.element(page.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument();
	});

	it('leaves out the label span when there is no label', async () => {
		render(ToggleSwitch);
		await expect.element(page.selector('label.fs-toggle-switch span')).not.toBeInTheDocument();
	});
});

describe('checked state', () => {
	it('is off by default', async () => {
		render(ToggleSwitch);
		await expect.element(toggle()).not.toBeChecked();
	});

	it('reflects the checked prop', async () => {
		render(ToggleSwitch, { checked: true });
		await expect.element(toggle()).toBeChecked();
	});

	it('turns on when clicked', async () => {
		render(ToggleSwitch);
		await expect.element(toggle()).not.toBeChecked();

		await toggle().click();

		await expect.element(toggle()).toBeChecked();
	});

	it('turns on when its label is clicked', async () => {
		render(ToggleSwitch, { label: 'Wi-Fi' });

		await page.getByText('Wi-Fi').click();

		await expect.element(toggle()).toBeChecked();
	});

	it('reports the new state through the binding', async () => {
		render(ToggleSwitchTestWrapper);
		await expect.element(state()).toHaveTextContent('off');

		await toggle().click();

		await expect.element(state()).toHaveTextContent('on');
	});

	it('turns back off on a second click', async () => {
		render(ToggleSwitchTestWrapper, { checked: true });
		await expect.element(state()).toHaveTextContent('on');

		await toggle().click();

		await expect.element(state()).toHaveTextContent('off');
	});
});

describe('disabled', () => {
	it('is disabled when asked', async () => {
		render(ToggleSwitch, { disabled: true });
		await expect.element(toggle()).toBeDisabled();
	});

	it('does not toggle while disabled', async () => {
		render(ToggleSwitchTestWrapper, { disabled: true });

		await expect(toggle().click({ timeout: 300 })).rejects.toThrow();
		await expect.element(state()).toHaveTextContent('off');
	});
});
