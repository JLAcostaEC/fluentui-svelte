import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import type { AppWindowContext } from '#lib/index.js';
import '#css/theme.css';
import Wrapper from './AppWindowContextTestWrapper.svelte';
import Probe from './AppWindowContextProbe.svelte';

const state = (name = 'Window state') =>
	JSON.parse(page.getByRole('status', { name, exact: true }).element().textContent!);
const surface = () => page.getByTestId('outer-surface').element() as HTMLElement;

describe('AppWindow context', () => {
	it('shares live host state, dimensions and construction references', async () => {
		const screen = await render(Wrapper, {
			active: true,
			maximized: true,
			minimized: false,
			collapsed: true,
			floating: true
		});
		await expect
			.poll(() => state())
			.toMatchObject({
				active: true,
				maximized: true,
				minimized: false,
				width: 640,
				height: 400,
				collapsed: true,
				floating: true,
				sideNav: true,
				titleBar: true,
				appSurface: true
			});
		await expect.element(page.getByRole('button', { name: 'Restore', exact: true })).toBeInTheDocument();
		await screen.rerender({ active: false, maximized: false, minimized: true, width: 700, floating: false });
		await expect
			.poll(() => state())
			.toMatchObject({ active: false, maximized: false, minimized: true, width: 700, floating: false });
		await expect.element(page.getByRole('button', { name: 'Maximize', exact: true })).toBeInTheDocument();
	});

	it('publishes SideNav changes from the hamburger to other window descendants', async () => {
		render(Wrapper);
		await page.getByRole('button', { name: 'Collapse navigation', exact: true }).click();
		await expect.poll(() => state().collapsed).toBe(true);
		await page.getByRole('button', { name: 'Expand navigation', exact: true }).click();
		await expect.poll(() => state().collapsed).toBe(false);
	});

	it('inherits active/maximized values and honors explicit component overrides', async () => {
		const screen = await render(Wrapper, { active: true, maximized: true });
		await expect.element(page.getByTestId('outer-surface')).toHaveClass('active');
		await expect.element(page.getByRole('button', { name: 'Restore', exact: true })).toBeInTheDocument();
		await screen.rerender({ surfaceActive: false, controlsMaximized: false });
		await expect.element(page.getByTestId('outer-surface')).toHaveClass('inactive');
		await expect.element(page.getByRole('button', { name: 'Maximize', exact: true })).toBeInTheDocument();
	});

	it('removes corners only for a collapsed floating SideNav and restores them on state changes', async () => {
		const screen = await render(Wrapper, { collapsed: true, floating: true });
		await expect.poll(() => getComputedStyle(surface()).borderTopLeftRadius).toBe('0px');
		await page.getByRole('button', { name: 'Expand navigation', exact: true }).click();
		await expect.poll(() => getComputedStyle(surface()).borderTopLeftRadius).not.toBe('0px');
		await screen.rerender({ collapsed: true, floating: false });
		await expect.poll(() => getComputedStyle(surface()).borderTopLeftRadius).not.toBe('0px');
		await screen.rerender({ floating: true });
		await expect.poll(() => getComputedStyle(surface()).borderBottomRightRadius).toBe('0px');
	});

	it('keeps nested window contexts and surface corners independent', async () => {
		render(Wrapper, { active: true, maximized: true, floating: true, collapsed: true, nested: true });
		await expect.poll(() => state()).toMatchObject({ active: true, maximized: true, collapsed: true, sideNav: true });
		await expect
			.poll(() => state('Nested state'))
			.toMatchObject({ active: false, maximized: false, collapsed: false, sideNav: true });
		await expect.poll(() => getComputedStyle(surface()).borderTopLeftRadius).toBe('0px');
		expect(getComputedStyle(page.getByTestId('inner-surface').element()).borderTopLeftRadius).not.toBe('0px');
	});

	it('unregisters parts when removed without leaving stale construction state', async () => {
		let context: AppWindowContext | null = null;
		const readContext = (): AppWindowContext | null => context;
		const screen = await render(Wrapper, {
			onContext: (value) => {
				context = value;
			}
		});
		await expect.poll(() => context?.state.sideNav?.ref).toBeInstanceOf(HTMLElement);
		await screen.rerender({ showNav: false, showTitle: false, showSurface: false });
		expect(readContext()?.state.sideNav).toBeNull();
		expect(readContext()?.state.titleBar).toBeNull();
		expect(readContext()?.state.appSurface).toBeNull();
	});

	it('publishes the global navigation button of the title bar and lets it control the SideNav', async () => {
		let context: AppWindowContext | null = null;
		const readContext = (): AppWindowContext | null => context;
		const screen = await render(Wrapper, {
			globalNav: true,
			onContext: (value) => {
				context = value;
			}
		});
		await expect.poll(() => context?.state.globalNav?.enabled).toBe(true);
		expect(readContext()?.state.globalNav?.ref).toBeInstanceOf(HTMLButtonElement);
		await expect.poll(() => context?.state.sideNav?.collapsed).toBe(false);
		await screen.getByRole('button', { name: 'Navigation menu', exact: true }).click();
		await expect.poll(() => readContext()?.state.sideNav?.collapsed).toBe(true);
		await screen.rerender({ globalNav: false });
		expect(readContext()?.state.globalNav).toBeNull();
	});

	it('returns null outside an AppWindow', async () => {
		render(Probe);
		await expect.element(page.getByRole('status', { name: 'Window state', exact: true })).toHaveTextContent('null');
	});
});
