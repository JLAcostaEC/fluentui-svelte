import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { DialogSurface, DialogTrigger, DialogTitle, DialogContent, DialogActions } from '$lib/index.js';
import DialogTestWrapper from './DialogTestWrapper.svelte';

describe('DialogTrigger', () => {
	it('renders a button with the default label', async () => {
		render(DialogTestWrapper);
		const el = page.getByRole('button', { name: 'Open Dialog' });
		await expect.element(el).toBeInTheDocument();
	});

	it('renders custom trigger content', async () => {
		render(DialogTestWrapper, { triggerText: 'Launch' });
		const el = page.getByRole('button', { name: 'Launch' });
		await expect.element(el).toBeInTheDocument();
	});

	it('throws when used outside a Dialog', async () => {
		expect(() => render(DialogTrigger)).toThrow('DialogTrigger must be used within a Dialog component');
	});
});

describe('DialogSurface', () => {
	it('renders a dialog element with the fs-dialog class', async () => {
		render(DialogTestWrapper);
		const el = page.selector('dialog.fs-dialog');
		await expect.element(el).toBeInTheDocument();
	});

	it('throws when used outside a Dialog', async () => {
		expect(() => render(DialogSurface)).toThrow('DialogSurface must be used within a Dialog component');
	});

	it('renders a close button for non-modal dialogs', async () => {
		render(DialogTestWrapper, { type: 'non-modal', open: true });
		const el = page.getByRole('button', { name: 'Close dialog' });
		await expect.element(el).toBeInTheDocument();
	});
});

describe('open/close behaviour', () => {
	it('calls onOpenChange with true when the trigger is clicked', async () => {
		const onOpenChange = vi.fn();
		render(DialogTestWrapper, { type: 'non-modal', onOpenChange });
		await page.getByRole('button', { name: 'Open Dialog' }).click();
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('is closed by default (no open attribute)', async () => {
		render(DialogTestWrapper, { type: 'non-modal' });
		const dialog = page.selector('dialog.fs-dialog');
		await expect.element(dialog).not.toHaveAttribute('open');
	});

	it('reflects the open state via the open attribute', async () => {
		render(DialogTestWrapper, { type: 'non-modal', open: true });
		const dialog = page.selector('dialog.fs-dialog');
		await expect.element(dialog).toHaveAttribute('open');
	});

	it('closes a non-modal dialog when the close button is clicked', async () => {
		const onOpenChange = vi.fn();
		render(DialogTestWrapper, { type: 'non-modal', open: true, onOpenChange });
		const dialog = page.selector('dialog.fs-dialog');
		await expect.element(dialog).toHaveAttribute('open');
		await page.getByRole('button', { name: 'Close dialog' }).click();
		await expect.element(dialog).not.toHaveAttribute('open');
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
	});
});

describe('DialogTitle', () => {
	it('renders content inside an h3 by default', async () => {
		render(DialogTestWrapper);
		const el = page.selector('h3.dialog-title');
		await expect.element(el).toBeInTheDocument();
		await expect.element(el).toHaveTextContent('Dialog Title');
	});

	it('renders as the requested heading tag', async () => {
		render(DialogTestWrapper, { titleAs: 'h1' });
		const el = page.selector('h1.dialog-title');
		await expect.element(el).toBeInTheDocument();
	});

	it('can be rendered standalone', async () => {
		render(DialogTitle);
		const el = page.selector('.dialog-title');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('DialogContent', () => {
	it('renders body content in a dialog-content container', async () => {
		render(DialogTestWrapper);
		const el = page.selector('.dialog-content');
		await expect.element(el).toBeInTheDocument();
		await expect.element(el).toHaveTextContent('Dialog body content');
	});

	it('can be rendered standalone', async () => {
		render(DialogContent);
		const el = page.selector('.dialog-content');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('DialogActions', () => {
	it('applies justify-end by default', async () => {
		render(DialogTestWrapper);
		const el = page.selector('.dialog-actions');
		await expect.element(el).toHaveClass('justify-end');
	});

	it('applies justify-start when position="start"', async () => {
		render(DialogTestWrapper, { actionsPosition: 'start' });
		const el = page.selector('.dialog-actions');
		await expect.element(el).toHaveClass('justify-start');
	});

	it('applies justify-center when position="center"', async () => {
		render(DialogTestWrapper, { actionsPosition: 'center' });
		const el = page.selector('.dialog-actions');
		await expect.element(el).toHaveClass('justify-center');
	});

	it('applies the fluid class when fluid is set', async () => {
		render(DialogTestWrapper, { fluid: true });
		const el = page.selector('.dialog-actions');
		await expect.element(el).toHaveClass('fluid');
	});

	it('can be rendered standalone', async () => {
		render(DialogActions);
		const el = page.selector('.dialog-actions');
		await expect.element(el).toBeInTheDocument();
	});
});
