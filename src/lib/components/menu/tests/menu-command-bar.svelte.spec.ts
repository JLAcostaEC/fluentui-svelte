import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '#css/theme.css';
import { MenuCommandBar } from '#lib/index.js';
import Wrapper from './MenuCommandBarTestWrapper.svelte';

const open = async (props: Record<string, unknown> = {}) => {
	render(Wrapper, props);
	await page.getByRole('button', { name: 'Open menu' }).click();
	await expect.element(page.getByRole('menu').first()).toBeVisible();
};
const item = (name: string) => page.getByRole('menuitem', { name, exact: true });
const press = (key: string) => userEvent.keyboard(`{${key}}`);

describe('MenuCommandBar', () => {
	it('renders a named group of commands inside the menu', async () => {
		await open({ bar: { label: 'Clipboard' } });
		const bar = page.getByRole('group', { name: 'Clipboard' });
		await expect.element(bar).toBeVisible();
		await expect.element(bar.getByRole('menuitem', { name: 'Cut' })).toBeVisible();
		await expect.element(bar.getByRole('menuitem', { name: 'Copy' })).toBeVisible();
	});

	it('sits before the items at the top and after them at the bottom', async () => {
		await open({ position: 'top' });
		let bar = document.querySelector('.fs-menu-command-bar')!;
		expect(bar.classList).toContain('top');
		expect(bar.parentElement!.firstElementChild).toBe(bar);
		document.body.innerHTML = '';

		await open({ position: 'bottom' });
		bar = document.querySelector('.fs-menu-command-bar')!;
		expect(bar.classList).toContain('bottom');
		expect(bar.parentElement!.lastElementChild).toBe(bar);
	});

	it('runs a command and closes the menu', async () => {
		const onCommand = vi.fn();
		const onOpenChange = vi.fn();
		await open({ onCommand, onOpenChange });
		await item('Copy').click();
		expect(onCommand).toHaveBeenCalledWith('copy');
		expect(onOpenChange).toHaveBeenLastCalledWith(expect.anything(), false);
	});

	it('renders no overflow button without an overflow snippet', async () => {
		await open({ withOverflow: false });
		await expect.element(page.getByRole('menuitem', { name: 'More options' })).not.toBeInTheDocument();
	});

	it('opens the secondary commands from the overflow button', async () => {
		const onOverflowItem = vi.fn();
		await open({ onOverflowItem, bar: { overflowLabel: 'More clipboard actions' } });
		const more = item('More clipboard actions');
		await expect.element(more).toHaveAttribute('aria-haspopup', 'menu');
		await more.click();
		await expect.element(more).toHaveAttribute('aria-expanded', 'true');
		await item('Select all').click();
		expect(onOverflowItem).toHaveBeenCalledOnce();
	});

	it('moves along the bar with Left and Right, skipping disabled commands', async () => {
		await open({ position: 'top' });
		await expect.element(item('Cut')).toHaveFocus();
		await press('ArrowRight');
		await expect.element(item('Copy')).toHaveFocus();
		await press('ArrowRight');
		await expect.element(item('More options')).toHaveFocus();
		await press('ArrowLeft');
		await expect.element(item('Copy')).toHaveFocus();
	});

	it('crosses between a top bar and the items with Up and Down', async () => {
		await open({ position: 'top' });
		await press('ArrowRight');
		await press('ArrowDown');
		await expect.element(item('Alpha')).toHaveFocus();
		await press('ArrowDown');
		await expect.element(item('Beta')).toHaveFocus();
		await press('ArrowUp');
		await press('ArrowUp');
		await expect.element(item('Cut')).toHaveFocus();
	});

	it('crosses between the items and a bottom bar with Down and Up', async () => {
		await open({ position: 'bottom' });
		await expect.element(item('Alpha')).toHaveFocus();
		await press('ArrowDown');
		await press('ArrowDown');
		await expect.element(item('Cut')).toHaveFocus();
		await press('ArrowRight');
		await press('ArrowUp');
		await expect.element(item('Beta')).toHaveFocus();
	});

	it('keeps the label as the name and tooltip of a square command', async () => {
		await open();
		const cut = item('Cut');
		await expect.element(cut).toHaveAttribute('title', 'Cut');
		await expect.element(cut).not.toHaveTextContent('Cut');
		const { width, height } = cut.element().getBoundingClientRect();
		expect(width).toBe(height);
		expect(width).toBeGreaterThanOrEqual(40);
	});

	it('shows the labels below the icons when asked to', async () => {
		await open({ bar: { showLabels: true } });
		const cut = item('Cut');
		await expect.element(cut).toHaveTextContent('Cut');
		await expect.element(cut).not.toHaveAttribute('title');
		await expect.element(cut).not.toHaveAttribute('aria-label');
	});

	it('draws a divider between commands only when asked to', async () => {
		const divider = (name: string) => getComputedStyle(item(name).element(), '::before').getPropertyValue('content');
		await open();
		expect(divider('Copy')).toBe('none');
		document.body.innerHTML = '';

		await open({ bar: { showDividers: true } });
		expect(divider('Cut')).toBe('none');
		expect(divider('Copy')).not.toBe('none');
	});

	it('throws when used outside a Menu', async () => {
		await expect(render(MenuCommandBar)).rejects.toThrow('No MenuContext found for fs-menu-.');
	});
});
