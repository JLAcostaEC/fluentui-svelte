import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import '$css/theme.css';
import { AppWindow } from '$lib/index.js';

const children = createRawSnippet(() => ({ render: () => '<p>Inside</p>' }));

const windowElement = () => page.getByTestId('window').element() as HTMLElement;

/** What a declaration resolves to, so a token can be compared with what an element ends up with. */
const resolve = (property: 'boxShadow' | 'backgroundColor' | 'borderTopColor', value: string) => {
	const probe = document.createElement('div');
	if (property === 'borderTopColor') probe.style.cssText = `border: 1px solid ${value}`;
	else probe.style[property] = value;
	document.body.appendChild(probe);
	const resolved = getComputedStyle(probe)[property];
	probe.remove();
	return resolved;
};

describe('rendering', () => {
	it('renders its content in a window made of a Flyout', async () => {
		render(AppWindow, { 'data-testid': 'window', children });
		await expect.element(page.getByText('Inside')).toBeInTheDocument();
		await expect.element(page.getByTestId('window')).toHaveClass('fs-flyout', 'fs-app-window');
	});

	it('forwards the class, the attributes and the ref', async () => {
		let ref: HTMLElement | undefined;
		render(AppWindow, {
			'data-testid': 'window',
			class: 'custom',
			role: 'application',
			get ref() {
				return ref;
			},
			set ref(value) {
				ref = value;
			}
		});
		await expect.element(page.getByTestId('window')).toHaveClass('fs-app-window', 'custom');
		await expect.element(page.getByTestId('window')).toHaveAttribute('role', 'application');
		expect(ref).toBe(windowElement());
	});

	it('keeps the style it is given beside its size', async () => {
		render(AppWindow, { 'data-testid': 'window', style: 'opacity: 0.5', width: 300 });
		expect(windowElement().style.opacity).toBe('0.5');
		expect(windowElement().style.width).toBe('18.75rem');
	});

	it('has no padding of its own and stacks its content', async () => {
		render(AppWindow, { 'data-testid': 'window', children });
		const style = getComputedStyle(windowElement());
		expect(style.paddingTop).toBe('0px');
		expect(style.paddingLeft).toBe('0px');
		expect(style.flexDirection).toBe('column');
	});

	it('leaves out the acrylic noise of the Flyout', async () => {
		render(AppWindow, { 'data-testid': 'window' });
		expect(getComputedStyle(windowElement(), '::before').display).toBe('none');
	});
});

describe('size', () => {
	it('takes the whole of its container by default', async () => {
		const screen = await render(AppWindow, { 'data-testid': 'window' });
		screen.container.style.cssText = 'width: 320px; height: 200px';
		const { width, height } = windowElement().getBoundingClientRect();
		expect(width).toBe(320);
		expect(height).toBe(200);
		expect(windowElement().style.width).toBe('100%');
		expect(windowElement().style.height).toBe('100%');
	});

	it('takes a number as pixels', async () => {
		render(AppWindow, { 'data-testid': 'window', width: 400, height: 240 });
		const { width, height } = windowElement().getBoundingClientRect();
		expect(width).toBe(400);
		expect(height).toBe(240);
	});

	it('takes a string as any CSS length', async () => {
		render(AppWindow, { 'data-testid': 'window', width: '25rem', height: '50vh' });
		expect(windowElement().style.width).toBe('25rem');
		expect(windowElement().style.height).toBe('50vh');
		expect(windowElement().getBoundingClientRect().width).toBe(400);
	});

	it('follows the size when it changes', async () => {
		const screen = await render(AppWindow, { 'data-testid': 'window', width: 400, height: 240 });
		await screen.rerender({ width: 200, height: '10rem' });
		const { width, height } = windowElement().getBoundingClientRect();
		expect(width).toBe(200);
		expect(height).toBe(160);
	});
});

describe('colors', () => {
	it('is painted with the Mica background and the surface stroke', async () => {
		render(AppWindow, { 'data-testid': 'window' });
		const style = getComputedStyle(windowElement());
		expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(style.backgroundColor).toBe(resolve('backgroundColor', 'var(--fs-solid-background-base)'));
		expect(style.borderTopColor).toBe(resolve('borderTopColor', 'var(--fs-control-surface-stroke-default)'));
	});
});

describe('active', () => {
	it('is an inactive window by default', async () => {
		render(AppWindow, { 'data-testid': 'window' });
		await expect.element(page.getByTestId('window')).toHaveClass('inactive');
		await expect.element(page.getByTestId('window')).not.toHaveClass('active');
		expect(getComputedStyle(windowElement()).boxShadow).toBe(resolve('boxShadow', 'var(--fs-shell-shadow-inactive)'));
	});

	it('casts the shadow of an active window when it is active', async () => {
		render(AppWindow, { 'data-testid': 'window', active: true });
		await expect.element(page.getByTestId('window')).toHaveClass('active');
		await expect.element(page.getByTestId('window')).not.toHaveClass('inactive');
		expect(getComputedStyle(windowElement()).boxShadow).toBe(resolve('boxShadow', 'var(--fs-shell-shadow-active)'));
	});

	it('swaps the shadow when it changes', async () => {
		const screen = await render(AppWindow, { 'data-testid': 'window' });
		const inactive = getComputedStyle(windowElement()).boxShadow;
		await screen.rerender({ active: true });
		expect(getComputedStyle(windowElement()).boxShadow).not.toBe(inactive);
		await screen.rerender({ active: false });
		expect(getComputedStyle(windowElement()).boxShadow).toBe(inactive);
	});
});
