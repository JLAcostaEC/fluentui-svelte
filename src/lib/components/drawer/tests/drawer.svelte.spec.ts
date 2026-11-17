import { page, userEvent } from 'vitest/browser';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { DrawerBody } from '#lib/index.js';
import Wrapper from './DrawerTestWrapper.svelte';
import '#lib/css/theme.css';

const drawer = () => document.querySelector<HTMLElement>('[data-testid="drawer"]')!;

describe('Drawer', () => {
	// No slide: the pointer would otherwise chase a moving drawer.
	beforeAll(() => {
		document.documentElement.dataset.fsReducedMotion = 'true';
	});

	it('opens as a modal dialog named by its title and closes with the close button', async () => {
		render(Wrapper);
		await page.getByTestId('opener').click();
		const dialog = page.getByRole('dialog', { name: 'Settings' });
		await expect.element(dialog).toBeVisible();
		expect(drawer().matches(':modal')).toBe(true);
		await page.getByRole('button', { name: 'Close' }).click();
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(false));
		await expect.element(page.getByTestId('changes')).toHaveTextContent('false');
		await expect.element(page.getByTestId('opener')).toHaveFocus();
	});

	it('closes on Escape and on a click on the backdrop', async () => {
		render(Wrapper, { open: true });
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(true));
		await userEvent.keyboard('{Escape}');
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(false));

		await page.getByTestId('opener').click();
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(true));
		await userEvent.click(document.body, { position: { x: window.innerWidth - 20, y: 20 } });
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(false));
		await expect.element(page.getByTestId('changes')).toHaveTextContent('false,false');
	});

	it('keeps an alert open on Escape and on a click outside', async () => {
		render(Wrapper, { open: true, type: 'alert' });
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(true));
		await userEvent.keyboard('{Escape}');
		await userEvent.click(document.body, { position: { x: window.innerWidth - 20, y: 20 } });
		expect((drawer() as HTMLDialogElement).open).toBe(true);
		await page.getByTestId('save').click();
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(false));
	});

	it('leaves the page interactive when non-modal', async () => {
		render(Wrapper, { open: true, type: 'non-modal', position: 'end' });
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(true));
		expect(drawer().matches(':modal')).toBe(false);
		await page.getByTestId('outside').click();
		await expect.element(page.getByTestId('outside')).toHaveTextContent('Outside 1');
		(page.getByRole('button', { name: 'Close' }).element() as HTMLElement).focus();
		await userEvent.keyboard('{Escape}');
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(false));
	});

	it('renders inline as a region that hides when closed', async () => {
		render(Wrapper, { type: 'inline' });
		expect(drawer().tagName).toBe('DIV');
		expect(drawer().hidden).toBe(true);
		await page.getByTestId('opener').click();
		await expect.element(page.getByRole('region', { name: 'Settings' })).toBeVisible();
		await page.getByRole('button', { name: 'Close' }).click();
		await vi.waitFor(() => expect(drawer().hidden).toBe(true));
		await expect.element(page.getByTestId('opener')).toHaveFocus();
	});

	it('floats away from the end edge', async () => {
		render(Wrapper, { open: true, position: 'end', floating: true });
		await vi.waitFor(() => {
			const rect = drawer().getBoundingClientRect();
			expect(window.innerWidth - rect.right).toBeCloseTo(8, 0);
			expect(rect.top).toBeCloseTo(8, 0);
			expect(rect.width).toBeCloseTo(320, 0);
		});
	});

	it('lets onBeforeClose keep the drawer open', async () => {
		const reasons: string[] = [];
		render(Wrapper, { open: true, onBeforeClose: (reason: string) => (reasons.push(reason), reason !== 'escape') });
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(true));
		await userEvent.keyboard('{Escape}');
		expect((drawer() as HTMLDialogElement).open).toBe(true);
		await page.getByRole('button', { name: 'Close' }).click();
		await vi.waitFor(() => expect((drawer() as HTMLDialogElement).open).toBe(false));
		expect(reasons).toEqual(['escape', 'close-button']);
	});

	it('takes a CSS length as size and hides the backdrop', async () => {
		render(Wrapper, { open: true, size: '25rem', hideBackdrop: true });
		await vi.waitFor(() => expect(drawer().getBoundingClientRect().width).toBe(400));
		expect(getComputedStyle(drawer(), '::backdrop').backgroundColor).toBe('rgba(0, 0, 0, 0)');
	});

	it('resizes with the arrow keys on the handle', async () => {
		render(Wrapper, { open: true, resizable: true });
		const handle = page.getByRole('separator', { name: 'Resize' });
		(handle.element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');
		await expect.element(page.getByTestId('size')).toHaveTextContent('352px');
		await vi.waitFor(() => expect(drawer().getBoundingClientRect().width).toBe(352));
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(page.getByTestId('size')).toHaveTextContent('336px');
	});

	it('closes only the nested drawer on Escape, and the nested one with its parent', async () => {
		render(Wrapper, { open: true, withNested: true });
		const nested = () => document.querySelector<HTMLDialogElement>('[data-testid="nested"]')!;
		await page.getByTestId('open-nested').click();
		await vi.waitFor(() => expect(nested().open).toBe(true));
		expect(nested().dataset.level).toBe('1');
		await userEvent.keyboard('{Escape}');
		await vi.waitFor(() => expect(nested().open).toBe(false));
		expect((drawer() as HTMLDialogElement).open).toBe(true);

		await page.getByTestId('open-nested').click();
		await vi.waitFor(() => expect(nested().open).toBe(true));
		(page.getByTestId('save').element() as HTMLElement).click();
		await vi.waitFor(() => expect(nested().open).toBe(false));
	});

	it('throws when a part is used outside a Drawer', async () => {
		await expect(async () => render(DrawerBody)).rejects.toThrow('Drawer context is not available');
	});
});
