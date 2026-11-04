import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import '#css/theme.css';
import { SideNav } from '#lib/index.js';
import Wrapper from './SideNavTestWrapper.svelte';
import Content from './SideNavTestContent.svelte';
import StandaloneWrapper from './SideNavStandaloneTestWrapper.svelte';

const nav = () => page.getByRole('navigation', { name: 'Main navigation' });
const expand = () => page.getByRole('button', { name: 'Expand navigation', exact: true });
const collapse = () => page.getByRole('button', { name: 'Collapse navigation', exact: true });

describe('SideNav', () => {
	it('uses native navigation, lists and links without a back button', async () => {
		render(Wrapper);
		await expect.element(nav()).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '#home');
		expect(nav().element().querySelector('ul')).not.toBeNull();
		expect(page.getByRole('menu').elements()).toHaveLength(0);
		expect(page.getByRole('button', { name: 'Back', exact: true }).elements()).toHaveLength(0);
	});

	it('forwards attributes, custom labels, class and ref', async () => {
		let ref: HTMLElement | null = null;
		render(SideNav, {
			label: 'Workspace',
			class: 'custom-nav',
			'data-testid': 'nav',
			expandLabel: 'Abrir',
			collapsed: true,
			get ref() {
				return ref;
			},
			set ref(value) {
				ref = value;
			}
		});
		await expect.element(page.getByRole('navigation', { name: 'Workspace' })).toHaveClass('custom-nav');
		await expect.element(page.getByRole('button', { name: 'Abrir' })).toHaveAttribute('aria-expanded', 'false');
		expect(ref).toBe(page.getByTestId('nav').element());
	});

	it('uses Button to toggle a compact rail while links remain named and reachable', async () => {
		const onCollapsedChange = vi.fn();
		render(Wrapper, { onCollapsedChange });
		const regionId = collapse().element().getAttribute('aria-controls')!;
		await expect.element(collapse()).toHaveClass('fs-button');
		await collapse().click();
		await expect.element(expand()).toHaveAttribute('aria-expanded', 'false');
		expect(document.getElementById(regionId)).not.toBeNull();
		expect(nav().element().getBoundingClientRect().width).toBe(40);
		await expect.element(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
		await expect.element(page.getByRole('link', { name: 'Settings' })).toBeVisible();
		expect(onCollapsedChange).toHaveBeenCalledWith(expect.any(Event), true);
		await expand().click();
		expect(nav().element().getBoundingClientRect().width).toBe(200);
	});

	it('supports button items and ListView selection customization', async () => {
		render(Wrapper, { itemAs: 'button', listViewProps: { selectionMode: 'single', shape: 'square' } });
		await page.getByRole('button', { name: 'Home', exact: true }).click();
		await expect.element(page.getByRole('status', { name: 'Selected navigation' })).toHaveTextContent('home');
		await expect.element(page.getByRole('button', { name: 'Home', exact: true })).toHaveClass('square');
		await expect.element(page.getByRole('button', { name: 'Disabled', exact: true })).toBeDisabled();
	});

	it('inherits ListView arrow navigation and skips disabled items', async () => {
		render(Wrapper);
		(page.getByRole('link', { name: 'Home', exact: true }).element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(page.getByRole('button', { name: 'Projects', exact: true })).toHaveFocus();
	});

	it('keeps the footer at the bottom while the main list scrolls', async () => {
		render(Wrapper, { longList: true });
		const footer = page.getByRole('link', { name: 'Settings' }).element();
		const before = footer.getBoundingClientRect();
		const scroll = nav().element().querySelector<HTMLElement>('.fs-side-nav-items')!;
		scroll.scrollTop = scroll.scrollHeight;
		expect(scroll.scrollTop).toBeGreaterThan(0);
		expect(footer.getBoundingClientRect().top).toBe(before.top);
		expect(before.bottom).toBeLessThanOrEqual(nav().element().getBoundingClientRect().bottom);
	});

	it('expands the rail before opening a nested navigation branch', async () => {
		render(Wrapper, { collapsed: true });
		await page.getByRole('button', { name: 'Projects', exact: true }).click();
		await expect.element(collapse()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(page.getByRole('link', { name: 'Project one' })).toBeVisible();
	});

	it('supports text, snippets and components for custom regions', async () => {
		const snippet = createRawSnippet(() => ({ render: () => '<span>Snippet content</span>' }));
		render(SideNav, { header: 'Text header', topContent: Content, footerContent: snippet });
		await expect.element(page.getByText('Text header')).toBeVisible();
		await expect.element(page.getByText('Component content: open, docked')).toBeVisible();
		await expect.element(page.getByText('Snippet content')).toBeVisible();
	});

	it('lets custom renderers adapt to the compact rail while plain text is hidden', async () => {
		render(SideNav, { collapsed: true, topContent: Content, footerContent: 'Expanded footer' });
		await expect.element(page.getByText('Component content: closed, docked')).toBeVisible();
		expect(page.getByText('Expanded footer').elements()).toHaveLength(0);
	});

	it('keeps ordinary ListView item markup separate from the two custom regions', async () => {
		const itemContent = createRawSnippet(() => ({ render: () => '<strong>Home page</strong>' }));
		render(Wrapper, { itemContent, topContent: 'Before list', footerContent: 'After list' });
		await expect.element(page.getByRole('link', { name: 'Home', exact: true })).toHaveTextContent('Home page');
		const root = nav().element();
		expect(root.querySelectorAll('.fs-side-nav-content')).toHaveLength(2);
		expect(root.textContent!.indexOf('Before list')).toBeLessThan(root.textContent!.indexOf('Home page'));
		expect(root.textContent!.indexOf('After list')).toBeGreaterThan(root.textContent!.indexOf('Projects'));
	});

	it('lays direct SideNav and AppSurface children below an optional title bar', async () => {
		render(Wrapper, { withTitleBar: true });
		const window = document.querySelector('.fs-app-window')!;
		const sidebar = window.querySelector(':scope > .fs-side-nav')!;
		const surface = window.querySelector(':scope > .fs-app-surface')!;
		const title = window.querySelector(':scope > .fs-title-bar')!;
		expect(sidebar.getBoundingClientRect().top).toBe(title.getBoundingClientRect().bottom);
		expect(surface.getBoundingClientRect().top).toBe(sidebar.getBoundingClientRect().top);
		expect(surface.getBoundingClientRect().left).toBe(sidebar.getBoundingClientRect().right);
		expect(sidebar.getBoundingClientRect().height).toBeGreaterThan(300);
	});

	it('composes a real Menu in custom content', async () => {
		render(Wrapper, { withMenu: true });
		await page.getByRole('button', { name: 'Account menu' }).click();
		await expect.element(page.getByRole('menuitem', { name: 'Sign out' })).toBeVisible();
	});

	it('removes hidden custom controls from the compact rail focus order', async () => {
		render(Wrapper, { customControls: true });
		const action = page.getByRole('button', { name: 'Custom action' });
		await expect.element(action).toBeVisible();
		await collapse().click();
		expect(page.getByRole('button', { name: 'Custom action' }).elements()).toHaveLength(0);
		expect(nav().element().querySelector('[aria-label="Actions"]')).not.toHaveAttribute('tabindex');
	});
});

describe('position', () => {
	it('puts the navigation on the right and moves the surface to its left', async () => {
		render(Wrapper, { position: 'right', withTitleBar: true });
		const window = document.querySelector('.fs-app-window')!;
		const sidebar = window.querySelector(':scope > .fs-side-nav')!;
		const surface = window.querySelector(':scope > .fs-app-surface')!;
		expect(sidebar.classList).toContain('position-right');
		expect(surface.getBoundingClientRect().right).toBe(sidebar.getBoundingClientRect().left);
		expect(sidebar.getBoundingClientRect().top).toBe(surface.getBoundingClientRect().top);
		expect(surface.getBoundingClientRect().left).toBeLessThan(sidebar.getBoundingClientRect().left);
	});

	it('rounds the corners of the surface that face the navigation', async () => {
		const screen = await render(Wrapper, { position: 'left' });
		const radius = (
			corner: 'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderBottomLeftRadius' | 'borderBottomRightRadius'
		) => getComputedStyle(document.querySelector('.fs-app-surface')!)[corner];
		await expect.poll(() => radius('borderTopLeftRadius')).not.toBe('0px');
		expect(radius('borderBottomRightRadius')).not.toBe('0px');
		expect(radius('borderTopRightRadius')).toBe('0px');
		expect(radius('borderBottomLeftRadius')).toBe('0px');
		await screen.rerender({ position: 'right' });
		await expect.poll(() => radius('borderTopRightRadius')).not.toBe('0px');
		expect(radius('borderBottomLeftRadius')).not.toBe('0px');
		expect(radius('borderTopLeftRadius')).toBe('0px');
		expect(radius('borderBottomRightRadius')).toBe('0px');
	});

	it('opens a floating navigation from the right edge', async () => {
		render(Wrapper, { position: 'right', floating: true, collapsed: true, withTitleBar: true });
		const window = document.querySelector('.fs-app-window')!;
		const before = document.querySelector('.fs-app-surface')!.getBoundingClientRect();
		await expect.element(expand()).toBeVisible();
		// The 640px window is wider than the test viewport: a pointer click would scroll the page to reach the toggle.
		(expand().element() as HTMLElement).click();
		await expect.element(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
		expect(Math.round(nav().element().getBoundingClientRect().right)).toBeGreaterThanOrEqual(
			Math.round(window.getBoundingClientRect().right) - 2
		);
		expect(document.querySelector('.fs-app-surface')!.getBoundingClientRect().width).toBe(before.width);
	});
});

describe('floating navigation', () => {
	it('leaves only the hamburger when closed and overlays without moving content', async () => {
		render(Wrapper, { floating: true, collapsed: true, withTitleBar: true });
		const content = document.querySelector('.fs-app-surface')!;
		const before = content.getBoundingClientRect();
		await expect.element(expand()).toBeVisible();
		expect(page.getByRole('link', { name: 'Home', exact: true }).elements()).toHaveLength(0);
		await expand().click();
		await expect.element(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
		expect(nav().element().getBoundingClientRect().top).toBe(
			document.querySelector('.fs-title-bar')!.getBoundingClientRect().bottom
		);
		expect(content.getBoundingClientRect().left).toBe(before.left);
		expect(content.getBoundingClientRect().width).toBe(before.width);
	});

	it('closes with Escape and restores focus to the visible toggle', async () => {
		render(Wrapper, { floating: true });
		(page.getByRole('link', { name: 'Home', exact: true }).element() as HTMLElement).focus();
		await userEvent.keyboard('{Escape}');
		await expect.element(expand()).toHaveFocus();
	});

	it('lets nested disclosures handle Escape before closing the panel', async () => {
		render(Wrapper, { floating: true });
		await page.getByRole('button', { name: 'Projects', exact: true }).click();
		(page.getByRole('link', { name: 'Project one' }).element() as HTMLElement).focus();
		await userEvent.keyboard('{Escape}');
		await expect
			.element(page.getByRole('button', { name: 'Projects', exact: true }))
			.toHaveAttribute('aria-expanded', 'false');
		await expect.element(collapse()).toHaveAttribute('aria-expanded', 'true');
		await userEvent.keyboard('{Escape}');
		await expect.element(expand()).toHaveFocus();
	});

	it('dismisses on an outside press without stealing the outside control focus', async () => {
		render(Wrapper, { floating: true });
		await page.getByRole('button', { name: 'Outside navigation' }).click();
		await expect.element(expand()).toBeVisible();
		await expect.element(page.getByRole('button', { name: 'Outside navigation' })).toHaveFocus();
	});

	it('closes after activating an item and allows opting out', async () => {
		const screen = await render(Wrapper, { floating: true, itemAs: 'button' });
		await page.getByRole('button', { name: 'Home', exact: true }).click();
		await expect.element(expand()).toBeVisible();
		await screen.rerender({ collapsed: false, closeOnSelect: false });
		await page.getByRole('button', { name: 'Home', exact: true }).click();
		await expect.element(collapse()).toBeVisible();
	});

	it('restores focus before a host-driven collapse hides the focused link', async () => {
		const screen = await render(Wrapper, { floating: true });
		(page.getByRole('link', { name: 'Home', exact: true }).element() as HTMLElement).focus();
		await screen.rerender({ collapsed: true });
		await expect.element(expand()).toHaveFocus();
	});

	it('respects a consumer canceling Escape', async () => {
		render(Wrapper, { floating: true, onkeydown: (event) => event.preventDefault() });
		(page.getByRole('link', { name: 'Home', exact: true }).element() as HTMLElement).focus();
		await userEvent.keyboard('{Escape}');
		await expect.element(collapse()).toBeVisible();
	});

	it('lets a nested Menu consume Escape while the navigation stays open', async () => {
		render(Wrapper, { floating: true, withMenu: true });
		await page.getByRole('button', { name: 'Account menu' }).click();
		await expect.element(page.getByRole('menuitem', { name: 'Sign out' })).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(collapse()).toBeVisible();
	});
});

describe('global navigation button', () => {
	const press = (locator: { element: () => Element }) => (locator.element() as HTMLElement).click();
	const globalButton = () => page.getByRole('button', { name: 'Navigation menu', exact: true });
	const home = () => page.getByRole('link', { name: 'Home', exact: true });

	it('takes over the hamburger of the navigation and toggles it', async () => {
		const onCollapsedChange = vi.fn();
		render(Wrapper, { globalNav: true, onCollapsedChange });
		expect(expand().elements()).toHaveLength(0);
		expect(collapse().elements()).toHaveLength(0);
		await expect.element(globalButton()).toHaveAttribute('aria-expanded', 'true');
		press(globalButton());
		await expect.element(globalButton()).toHaveAttribute('aria-expanded', 'false');
		expect(onCollapsedChange).toHaveBeenLastCalledWith(expect.any(Event), true);
		press(globalButton());
		await expect.element(globalButton()).toHaveAttribute('aria-expanded', 'true');
		expect(onCollapsedChange).toHaveBeenLastCalledWith(expect.any(Event), false);
	});

	it('sizes the buttons of the title bar like the ones of the navigation', async () => {
		render(Wrapper, { globalNav: true, showToggle: true });
		const size = (locator: { element: () => Element }) => {
			const rect = locator.element().getBoundingClientRect();
			const icon = locator.element().querySelector('svg')!.getBoundingClientRect();
			return [rect.width, rect.height, icon.width, icon.height].map((value) => Math.round(value * 10) / 10);
		};
		await expect.element(collapse()).toBeVisible();
		const toggle = size(collapse());
		expect(size(globalButton())).toEqual(toggle);
		expect(size(page.getByRole('button', { name: 'Back', exact: true }))).toEqual(toggle);
	});

	it('drops the top padding without its own toggle, unless it floats', async () => {
		const screen = await render(Wrapper, { globalNav: true });
		const top = () => getComputedStyle(document.querySelector('.fs-side-nav')!).paddingTop;
		expect(top()).toBe('0px');
		await screen.rerender({ globalNav: true, showToggle: true });
		expect(top()).toBe('4px');
		await screen.rerender({ globalNav: true, floating: true });
		expect(top()).toBe('4px');
	});

	it('shows both buttons with showToggle', async () => {
		render(Wrapper, { globalNav: true, showToggle: true });
		await expect.element(collapse()).toBeVisible();
		press(collapse());
		await expect.element(globalButton()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(expand()).toBeVisible();
	});

	it('hides the hamburger with showToggle false even without a global button', async () => {
		render(Wrapper, { showToggle: false });
		expect(collapse().elements()).toHaveLength(0);
		await expect.element(nav()).toBeInTheDocument();
	});

	it('lets onGlobalNav keep the navigation as it is', async () => {
		render(Wrapper, { globalNav: true, onGlobalNav: (event: MouseEvent) => event.preventDefault() });
		press(globalButton());
		await expect.element(globalButton()).toHaveAttribute('aria-expanded', 'true');
	});

	it('follows a navigation that starts collapsed', async () => {
		render(Wrapper, { globalNav: true, collapsed: true });
		await expect.element(globalButton()).toHaveAttribute('aria-expanded', 'false');
	});

	it('opens and closes a floating navigation without reopening it', async () => {
		render(Wrapper, { globalNav: true, floating: true, collapsed: true });
		press(globalButton());
		await expect.element(home()).toBeVisible();
		press(globalButton());
		await expect.element(globalButton()).toHaveAttribute('aria-expanded', 'false');
		await new Promise((resolve) => setTimeout(resolve, 100));
		await expect.element(globalButton()).toHaveAttribute('aria-expanded', 'false');
	});

	it('returns the focus to the global button when a floating navigation closes', async () => {
		render(Wrapper, { globalNav: true, floating: true, collapsed: true });
		press(globalButton());
		await expect.element(home()).toBeVisible();
		home().element().focus();
		await userEvent.keyboard('{Escape}');
		await expect.element(globalButton()).toHaveAttribute('aria-expanded', 'false');
		await expect.element(globalButton()).toHaveFocus();
	});
});

describe('on its own', () => {
	it('works without an AppWindow around it', async () => {
		const onCollapsedChange = vi.fn();
		render(SideNav, { header: 'Standalone', onCollapsedChange });
		await expect.element(nav()).toBeInTheDocument();
		await collapse().click();
		await expect.element(expand()).toHaveAttribute('aria-expanded', 'false');
		expect(nav().element().getBoundingClientRect().width).toBe(40);
		expect(onCollapsedChange).toHaveBeenCalledWith(expect.any(Event), true);
	});

	it('renders its items and branches in any ListView, without a SideNav', async () => {
		const onAction = vi.fn();
		render(StandaloneWrapper, { onAction });
		await expect.element(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '#home');
		await expect.element(page.getByText('Home', { exact: true })).toBeVisible();
		await page.getByRole('link', { name: 'Home', exact: true }).click();
		expect(onAction).toHaveBeenCalledWith(expect.any(MouseEvent), 'home');
		await page.getByRole('button', { name: 'Projects', exact: true }).click();
		await expect.element(page.getByRole('link', { name: 'Project one' })).toBeVisible();
	});
});
