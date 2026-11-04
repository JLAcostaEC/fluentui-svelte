import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import '#css/theme.css';
import { AppSurface } from '#lib/index.js';
import NavWrapper from './AppSurfaceNavTestWrapper.svelte';

const children = createRawSnippet(() => ({ render: () => '<p>Inside</p>' }));

const surface = () => page.getByTestId('surface').element() as HTMLElement;

type Resolvable = 'backgroundColor' | 'borderTopColor' | 'borderTopLeftRadius';

/** What a declaration resolves to, so a token can be compared with what the surface ends up with. */
const resolve = (property: Resolvable, value: string) => {
	const probe = document.createElement('div');
	if (property === 'borderTopColor') probe.style.cssText = `border: 1px solid ${value}`;
	else if (property === 'borderTopLeftRadius') probe.style.borderTopLeftRadius = value;
	else probe.style.backgroundColor = value;
	document.body.appendChild(probe);
	const resolved = getComputedStyle(probe)[property];
	probe.remove();
	return resolved;
};

describe('rendering', () => {
	it('renders its content in a div with the base fs-app-surface class', async () => {
		render(AppSurface, { 'data-testid': 'surface', children });
		await expect.element(page.getByText('Inside')).toBeInTheDocument();
		await expect.element(page.getByTestId('surface')).toHaveClass('fs-app-surface');
		expect(surface().tagName).toBe('DIV');
	});

	it('forwards the class, the attributes and the ref', async () => {
		let ref: HTMLElement | undefined;
		render(AppSurface, {
			'data-testid': 'surface',
			class: 'custom',
			role: 'region',
			get ref() {
				return ref;
			},
			set ref(value) {
				ref = value;
			}
		});
		await expect.element(page.getByTestId('surface')).toHaveClass('fs-app-surface', 'custom');
		await expect.element(page.getByTestId('surface')).toHaveAttribute('role', 'region');
		expect(ref).toBe(surface());
	});

	it('takes the room its container leaves it and scrolls past it', async () => {
		const screen = await render(AppSurface, { 'data-testid': 'surface' });
		const header = document.createElement('div');
		header.style.height = '50px';
		screen.container.style.cssText = 'display: flex; flex-direction: column; height: 200px';
		screen.container.insertAdjacentElement('afterbegin', header);
		expect(surface().getBoundingClientRect().height).toBe(150);
		expect(getComputedStyle(surface()).overflow).toBe('auto');
	});
});

describe('corners', () => {
	const radius = () => resolve('borderTopLeftRadius', 'var(--fs-control-overlay-border-radius)');
	const corners = () => {
		const style = getComputedStyle(surface());
		return {
			topLeft: style.borderTopLeftRadius,
			topRight: style.borderTopRightRadius,
			bottomLeft: style.borderBottomLeftRadius,
			bottomRight: style.borderBottomRightRadius
		};
	};
	const square = { topLeft: '0px', topRight: '0px', bottomLeft: '0px', bottomRight: '0px' };

	it('is square on its own', async () => {
		render(AppSurface, { 'data-testid': 'surface' });
		expect(corners()).toEqual(square);
	});

	it('is square in a window without a SideNav', async () => {
		render(NavWrapper, { withNav: false });
		expect(corners()).toEqual(square);
	});

	it('rounds the corner that faces a SideNav on the left, and the one across from it', async () => {
		render(NavWrapper, { navProps: { position: 'left' } });
		expect(radius()).not.toBe('0px');
		await expect.poll(corners).toEqual({ ...square, topLeft: radius(), bottomRight: radius() });
	});

	it('rounds the opposite corners when the SideNav is on the right', async () => {
		const screen = await render(NavWrapper, { navProps: { position: 'left' } });
		await screen.rerender({ navProps: { position: 'right' } });
		await expect.poll(corners).toEqual({ ...square, topRight: radius(), bottomLeft: radius() });
	});

	it('swaps the rounded corners when it is written right to left', async () => {
		render(NavWrapper, { surfaceProps: { dir: 'rtl' } });
		await expect.poll(corners).toEqual({ ...square, topRight: radius(), bottomLeft: radius() });
	});
});

describe('mode', () => {
	it('is a layer by default', async () => {
		render(AppSurface, { 'data-testid': 'surface' });
		await expect.element(page.getByTestId('surface')).toHaveClass('layer');
		await expect.element(page.getByTestId('surface')).not.toHaveClass('mica');
	});

	it('is mica when asked', async () => {
		render(AppSurface, { 'data-testid': 'surface', mode: 'mica' });
		await expect.element(page.getByTestId('surface')).toHaveClass('mica');
		await expect.element(page.getByTestId('surface')).not.toHaveClass('layer');
	});
});

describe('colors', () => {
	const colors = (background: string, stroke: string) => ({
		background: resolve('backgroundColor', `var(${background})`),
		stroke: resolve('borderTopColor', `var(${stroke})`)
	});

	const painted = () => {
		const style = getComputedStyle(surface());
		return { background: style.backgroundColor, stroke: style.borderTopColor };
	};

	it('paints an active layer with the tertiary solid background and the card stroke', async () => {
		render(AppSurface, { 'data-testid': 'surface', active: true });
		expect(painted()).toEqual(colors('--fs-solid-background-tertiary', '--fs-card-stroke-default'));
	});

	it('paints an inactive layer with the layer fill, keeping the card stroke', async () => {
		render(AppSurface, { 'data-testid': 'surface' });
		expect(painted()).toEqual(colors('--fs-layer-default', '--fs-card-stroke-default'));
	});

	it('paints an active mica with the solid base and the surface stroke', async () => {
		render(AppSurface, { 'data-testid': 'surface', mode: 'mica', active: true });
		expect(painted()).toEqual(colors('--fs-solid-background-base', '--fs-control-surface-stroke-default'));
	});

	it('paints an inactive mica with the base and the surface stroke', async () => {
		render(AppSurface, { 'data-testid': 'surface', mode: 'mica' });
		expect(painted()).toEqual(colors('--fs-solid-background-base', '--fs-control-surface-stroke-default'));
	});

	it('swaps the layer color when it becomes active or inactive', async () => {
		const screen = await render(AppSurface, { 'data-testid': 'surface' });
		const inactive = painted().background;
		await screen.rerender({ active: true });
		expect(painted().background).not.toBe(inactive);
		await screen.rerender({ active: false });
		expect(painted().background).toBe(inactive);
	});

	it('swaps the colors when the mode changes', async () => {
		const screen = await render(AppSurface, { 'data-testid': 'surface', active: true });
		const layer = painted();
		await screen.rerender({ mode: 'mica' });
		expect(painted()).not.toEqual(layer);
		expect(painted()).toEqual(colors('--fs-solid-background-base', '--fs-control-surface-stroke-default'));
	});
});

describe('active', () => {
	it('is an inactive surface by default', async () => {
		render(AppSurface, { 'data-testid': 'surface' });
		await expect.element(page.getByTestId('surface')).toHaveClass('inactive');
		await expect.element(page.getByTestId('surface')).not.toHaveClass('active');
	});

	it('is an active surface when it is active', async () => {
		render(AppSurface, { 'data-testid': 'surface', active: true });
		await expect.element(page.getByTestId('surface')).toHaveClass('active');
		await expect.element(page.getByTestId('surface')).not.toHaveClass('inactive');
	});
});
