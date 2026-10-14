import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import { AppsRegular } from 'fluentui-icons-svelte';
import { TitleBar, TitleBarLeftControls, TitleBarRightControls } from '$lib/index.js';
import type { TitleBarLeftControlsProps, TitleBarRightControlsProps } from '$lib/index.js';
import TitleBarTestWrapper from './TitleBarTestWrapper.svelte';

const raw = (html: string) => createRawSnippet(() => ({ render: () => html }));

const bar = () => page.getByRole('banner');

const renderLeft = (props: TitleBarLeftControlsProps = {}) => render(TitleBarTestWrapper, { left: props });
const renderRight = (props: TitleBarRightControlsProps = {}) => render(TitleBarTestWrapper, { right: props });

describe('TitleBar', () => {
	it('renders a banner with the base fs-title-bar class', async () => {
		render(TitleBarTestWrapper);
		await expect.element(bar()).toHaveClass('fs-title-bar');
	});

	it('uses the standard height and no search by default', async () => {
		render(TitleBarTestWrapper);
		await expect.element(bar()).not.toHaveClass('tall');
		await expect.element(bar()).not.toHaveClass('has-search');
		expect(document.querySelector('.fs-title-bar-search')).toBeNull();
	});

	it('renders the search and goes tall when a search is provided', async () => {
		render(TitleBarTestWrapper, { withSearch: true });
		await expect.element(page.getByRole('searchbox', { name: 'Find' })).toBeInTheDocument();
		await expect.element(bar()).toHaveClass('has-search');
		await expect.element(bar()).toHaveClass('tall');
	});

	it('lets `tall` override the height the search would pick', async () => {
		render(TitleBarTestWrapper, { withSearch: true, tall: false });
		await expect.element(bar()).not.toHaveClass('tall');
	});

	it('can be tall without a search', async () => {
		render(TitleBarTestWrapper, { tall: true });
		await expect.element(bar()).toHaveClass('tall');
	});

	it('hands the search its width limits, a number in pixels and a string as is', async () => {
		render(TitleBarTestWrapper, { withSearch: true });
		const style = (bar().element() as HTMLElement).style;
		expect(style.getPropertyValue('--fs-title-bar-search-min')).toBe('12.50rem');
		expect(style.getPropertyValue('--fs-title-bar-search-max')).toBe('30.00rem');
	});

	it('takes the width limits of the search as any CSS length', async () => {
		render(TitleBarTestWrapper, { withSearch: true, searchMinWidth: '10ch', searchMaxWidth: '50%' });
		const style = (bar().element() as HTMLElement).style;
		expect(style.getPropertyValue('--fs-title-bar-search-min')).toBe('10ch');
		expect(style.getPropertyValue('--fs-title-bar-search-max')).toBe('50%');
	});

	it('renders the left and right controls', async () => {
		render(TitleBarTestWrapper, { left: { appName: 'FluentUI App' }, right: { hideMinimize: true } });
		await expect.element(page.getByText('FluentUI App')).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Close' })).toBeInTheDocument();
	});

	it('forwards the class, the attributes and the ref', async () => {
		let ref: HTMLElement | undefined;
		render(TitleBar, {
			class: 'custom',
			'data-testid': 'bar',
			get ref() {
				return ref;
			},
			set ref(value) {
				ref = value;
			}
		});
		await expect.element(page.getByTestId('bar')).toHaveClass('fs-title-bar', 'custom');
		expect(ref).toBe(page.getByTestId('bar').element());
	});
});

describe('the collapsed search', () => {
	it('stands in for the search with a button', async () => {
		render(TitleBarTestWrapper, { withSearch: true, searchCollapsed: true });
		await expect.element(bar()).toHaveClass('collapsed');
		expect(page.getByRole('searchbox').elements()).toHaveLength(0);
		const button = page.getByRole('button', { name: 'Search' });
		await expect.element(button).toBeInTheDocument();
		await expect.element(button).toHaveAttribute('aria-expanded', 'false');
	});

	it('names the button after searchLabel', async () => {
		render(TitleBarTestWrapper, { withSearch: true, searchCollapsed: true, searchLabel: 'Buscar' });
		await expect.element(page.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
	});

	it('expands the search and moves the focus into it when the button is pressed', async () => {
		render(TitleBarTestWrapper, { withSearch: true, searchCollapsed: true });
		await page.getByRole('button', { name: 'Search' }).click();
		await expect.element(page.getByRole('searchbox', { name: 'Find' })).toHaveFocus();
		await expect.element(bar()).not.toHaveClass('collapsed');
		expect(page.getByRole('button', { name: 'Search' }).elements()).toHaveLength(0);
	});

	it('has nothing to collapse without a search', async () => {
		render(TitleBarTestWrapper, { searchCollapsed: true });
		await expect.element(bar()).not.toHaveClass('collapsed');
		expect(page.getByRole('button', { name: 'Search' }).elements()).toHaveLength(0);
	});
});

describe('the layout of the search', () => {
	const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();

	it('grows up to its maximum and sits centered between the controls', async () => {
		render(TitleBarTestWrapper, {
			withSearch: true,
			style: 'inline-size: 1000px',
			left: { appName: 'FluentUI App' },
			right: {}
		});
		const search = rect('.fs-title-bar-search');
		expect(search.width).toBeCloseTo(480, 0);
		const before = search.left - rect('.fs-title-bar-left').right;
		const after = rect('.fs-title-bar-right').left - search.right;
		expect(Math.abs(before - after)).toBeLessThan(1.5);
	});

	it('is the only one to shrink when the bar narrows, down to its minimum', async () => {
		const screen = await render(TitleBarTestWrapper, {
			withSearch: true,
			style: 'inline-size: 1000px',
			left: { appName: 'FluentUI App' },
			right: {}
		});
		const left = rect('.fs-title-bar-left').width;
		const right = rect('.fs-title-bar-right').width;
		await screen.rerender({ style: 'inline-size: 320px' });
		expect(rect('.fs-title-bar-search').width).toBeCloseTo(200, 0);
		expect(rect('.fs-title-bar-left').width).toBeCloseTo(left, 0);
		expect(rect('.fs-title-bar-right').width).toBeCloseTo(right, 0);
	});

	it('follows the limits it is given', async () => {
		render(TitleBarTestWrapper, {
			withSearch: true,
			style: 'inline-size: 1000px',
			searchMinWidth: 100,
			searchMaxWidth: '25%'
		});
		// A percentage is of the room inside the bar, which is 8 pixels short of it for the start padding.
		expect(rect('.fs-title-bar-search').width).toBeCloseTo(248, 0);
	});

	it('leaves the right controls at the end of a bar without a search', async () => {
		render(TitleBarTestWrapper, { style: 'inline-size: 1000px', right: {} });
		const bar = rect('.fs-title-bar');
		expect(rect('.fs-title-bar-right').right).toBeCloseTo(bar.right, 0);
	});

	it('puts the button of a collapsed search beside the right controls', async () => {
		render(TitleBarTestWrapper, {
			withSearch: true,
			searchCollapsed: true,
			style: 'inline-size: 1000px',
			right: {}
		});
		expect(rect('.fs-title-bar-search').right).toBeCloseTo(rect('.fs-title-bar-right').left - 8, 0);
	});
});

describe('the tab order', () => {
	const buttons = () => Array.from(document.querySelectorAll<HTMLButtonElement>('header button'));
	const everyButton = {
		withSearch: true,
		searchCollapsed: true,
		left: { back: true, globalNav: true },
		right: { personPic: { name: 'Ada Lovelace' }, onPersonPicClick: () => {} }
	};

	it('keeps every button of the bar out of it by default', async () => {
		render(TitleBarTestWrapper, everyButton);
		// Back, navigation, search, person picture, minimize, maximize and close.
		expect(buttons()).toHaveLength(7);
		for (const button of buttons()) expect(button).toHaveAttribute('tabindex', '-1');
	});

	it('lets the Tab key walk past the bar', async () => {
		render(TitleBarTestWrapper, everyButton);
		await userEvent.tab();
		expect(document.querySelector('header')!.contains(document.activeElement)).toBe(false);
	});

	it('still takes the pointer', async () => {
		const onClose = vi.fn();
		render(TitleBarTestWrapper, { right: { onClose } });
		await page.getByRole('button', { name: 'Close' }).click();
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('brings the buttons into it when tabbable', async () => {
		render(TitleBarTestWrapper, { ...everyButton, tabbable: true });
		for (const button of buttons()) expect(button).not.toHaveAttribute('tabindex');
		await userEvent.tab();
		await expect.element(page.getByRole('button', { name: 'Back' })).toHaveFocus();
	});
});

describe('the drag region', () => {
	it('reaches the bar and its start and end areas', async () => {
		render(TitleBarTestWrapper, {
			dragRegionProps: { 'data-tauri-drag-region': true },
			left: { appName: 'FluentUI App' },
			right: { personPic: { name: 'Ada Lovelace' } }
		});
		const regions = ['.fs-title-bar', '.fs-title-bar-left', '.fs-title-bar-right'];
		for (const region of regions) {
			expect(document.querySelector(region), region).toHaveAttribute('data-tauri-drag-region');
		}
	});

	it('is absent unless asked for', async () => {
		render(TitleBarTestWrapper, { left: { appName: 'FluentUI App' }, right: {} });
		expect(document.querySelector('[data-tauri-drag-region]')).toBeNull();
	});
});

describe('the controls outside a TitleBar', () => {
	it('fail loudly instead of rendering without the context', async () => {
		await expect(render(TitleBarLeftControls)).rejects.toThrow('No TitleBarContext found for fs-title-bar.');
		await expect(render(TitleBarRightControls)).rejects.toThrow('No TitleBarContext found for fs-title-bar.');
	});
});

describe('TitleBarLeftControls', () => {
	it('renders only its container by default', async () => {
		renderLeft();
		expect(document.querySelector('.fs-title-bar-left-controls')).not.toBeNull();
		expect(page.getByRole('button').elements()).toHaveLength(0);
		expect(document.querySelector('.fs-title-bar-identity')).toBeNull();
	});

	describe('back', () => {
		it('shows a button named Back', async () => {
			renderLeft({ back: true });
			await expect.element(page.getByRole('button', { name: 'Back' })).toBeInTheDocument();
		});

		it('reports the press', async () => {
			const onBack = vi.fn();
			renderLeft({ back: true, onBack });
			await page.getByRole('button', { name: 'Back' }).click();
			expect(onBack).toHaveBeenCalledOnce();
		});

		it('can be disabled', async () => {
			const onBack = vi.fn();
			renderLeft({ back: true, backDisabled: true, onBack });
			await expect.element(page.getByRole('button', { name: 'Back' })).toBeDisabled();
			expect(onBack).not.toHaveBeenCalled();
		});

		it('takes a custom label', async () => {
			renderLeft({ back: true, backLabel: 'Atrás' });
			await expect.element(page.getByRole('button', { name: 'Atrás' })).toBeInTheDocument();
		});
	});

	describe('global navigation', () => {
		it('shows a button named Navigation menu', async () => {
			renderLeft({ globalNav: true });
			await expect.element(page.getByRole('button', { name: 'Navigation menu' })).toBeInTheDocument();
		});

		it('reports the press', async () => {
			const onGlobalNav = vi.fn();
			renderLeft({ globalNav: true, onGlobalNav });
			await page.getByRole('button', { name: 'Navigation menu' }).click();
			expect(onGlobalNav).toHaveBeenCalledOnce();
		});

		it('reflects whether the navigation is expanded', async () => {
			const screen = await renderLeft({ globalNav: true });
			const button = page.getByRole('button', { name: 'Navigation menu' });
			await expect.element(button).toHaveAttribute('aria-expanded', 'false');
			await screen.rerender({ left: { globalNav: true, globalNavExpanded: true } });
			await expect.element(button).toHaveAttribute('aria-expanded', 'true');
		});

		it('takes a custom label', async () => {
			renderLeft({ globalNav: true, globalNavLabel: 'Menú' });
			await expect.element(page.getByRole('button', { name: 'Menú' })).toBeInTheDocument();
		});

		it('is replaced by a snippet', async () => {
			renderLeft({ globalNav: raw('<button type="button">Custom nav</button>') });
			await expect.element(page.getByRole('button', { name: 'Custom nav' })).toBeInTheDocument();
			expect(page.getByRole('button', { name: 'Navigation menu' }).elements()).toHaveLength(0);
		});
	});

	describe('identity', () => {
		it('renders the name of the app', async () => {
			renderLeft({ appName: 'FluentUI App' });
			await expect.element(page.getByText('FluentUI App')).toHaveClass('fs-title-bar-app-name');
		});

		it('draws an image from the URL of an icon, which is decorative', async () => {
			renderLeft({ appIcon: '/logo.png', appName: 'FluentUI App' });
			const img = document.querySelector<HTMLImageElement>('.fs-title-bar-app-icon img');
			expect(img).toHaveAttribute('src', '/logo.png');
			expect(img).toHaveAttribute('alt', '');
			expect(document.querySelector('.fs-title-bar-app-icon')).toHaveAttribute('aria-hidden', 'true');
		});

		it('draws an icon component', async () => {
			renderLeft({ appIcon: AppsRegular });
			expect(document.querySelector('.fs-title-bar-app-icon svg')).not.toBeNull();
		});

		it('draws an icon snippet', async () => {
			renderLeft({ appIcon: raw('<svg data-testid="custom" viewBox="0 0 1 1"></svg>') });
			expect(document.querySelector('.fs-title-bar-app-icon [data-testid="custom"]')).not.toBeNull();
		});

		it('renders the release tag as a badge', async () => {
			renderLeft({ appName: 'FluentUI App', releaseTag: 'PREVIEW' });
			await expect.element(page.getByText('PREVIEW')).toHaveClass('fs-badge', 'fs-title-bar-release-tag');
		});

		it('renders a snippet as the release tag', async () => {
			renderLeft({ releaseTag: raw('<em>Nightly</em>') });
			await expect.element(page.getByText('Nightly')).toBeInTheDocument();
		});

		it('renders the children after the identity', async () => {
			renderLeft({ appName: 'FluentUI App', children: raw('<span>Subtitle</span>') });
			await expect.element(page.getByText('Subtitle')).toBeInTheDocument();
		});

		it('renders every control of the set in order', async () => {
			render(TitleBarTestWrapper, {
				left: { back: true, globalNav: true, appIcon: AppsRegular, appName: 'FluentUI App', releaseTag: 'BETA' }
			});
			const order = Array.from(
				document.querySelectorAll('.fs-title-bar-left-controls > *, .fs-title-bar-identity > *')
			).map((el) => el.getAttribute('aria-label') ?? el.className.split(' ')[0]);
			expect(order).toEqual([
				'Back',
				'Navigation menu',
				'fs-title-bar-identity',
				'fs-title-bar-app-icon',
				'fs-title-bar-app-name',
				'fs-badge'
			]);
		});
	});
});

describe('TitleBarRightControls', () => {
	it('shows the three window buttons by default', async () => {
		renderRight();
		await expect.element(page.getByRole('button', { name: 'Minimize' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Maximize' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Close' })).toBeInTheDocument();
	});

	it('hides the minimize button', async () => {
		renderRight({ hideMinimize: true });
		expect(page.getByRole('button', { name: 'Minimize' }).elements()).toHaveLength(0);
		expect(page.getByRole('button').elements()).toHaveLength(2);
	});

	it('hides the maximize and restore button', async () => {
		renderRight({ hideWindowToggle: true });
		expect(page.getByRole('button', { name: 'Maximize' }).elements()).toHaveLength(0);
		expect(page.getByRole('button').elements()).toHaveLength(2);
	});

	it('hides the close button', async () => {
		renderRight({ hideClose: true });
		expect(page.getByRole('button', { name: 'Close' }).elements()).toHaveLength(0);
		expect(page.getByRole('button').elements()).toHaveLength(2);
	});

	it('renders no window buttons at all when every one is hidden', async () => {
		renderRight({ hideMinimize: true, hideWindowToggle: true, hideClose: true });
		expect(page.getByRole('button').elements()).toHaveLength(0);
		expect(document.querySelector('.fs-title-bar-caption-buttons')).toBeNull();
	});

	it('turns the maximize button into a restore button while maximized', async () => {
		const screen = await renderRight();
		await expect.element(page.getByRole('button', { name: 'Maximize' })).toBeInTheDocument();
		await screen.rerender({ right: { maximized: true } });
		await expect.element(page.getByRole('button', { name: 'Restore' })).toBeInTheDocument();
		expect(page.getByRole('button', { name: 'Maximize' }).elements()).toHaveLength(0);
	});

	it('reports the press of each window button', async () => {
		const onMinimize = vi.fn();
		const onWindowToggle = vi.fn();
		const onClose = vi.fn();
		renderRight({ onMinimize, onWindowToggle, onClose });
		await page.getByRole('button', { name: 'Minimize' }).click();
		await page.getByRole('button', { name: 'Maximize' }).click();
		await page.getByRole('button', { name: 'Close' }).click();
		expect(onMinimize).toHaveBeenCalledOnce();
		expect(onWindowToggle).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('takes custom labels', async () => {
		renderRight({
			minimizeLabel: 'Minimizar',
			maximizeLabel: 'Maximizar',
			closeLabel: 'Cerrar'
		});
		await expect.element(page.getByRole('button', { name: 'Minimizar' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Maximizar' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
	});

	it('takes a custom restore label', async () => {
		renderRight({ maximized: true, restoreLabel: 'Restaurar' });
		await expect.element(page.getByRole('button', { name: 'Restaurar' })).toBeInTheDocument();
	});

	describe('the person picture', () => {
		it('renders an avatar for the person', async () => {
			renderRight({ personPic: { name: 'Ada Lovelace' } });
			const avatar = page.getByRole('img', { name: 'Ada Lovelace' });
			await expect.element(avatar).toHaveClass('fs-avatar');
			await expect.element(avatar).toHaveTextContent('AL');
		});

		it('sizes the avatar to 24 unless told otherwise', async () => {
			const screen = await renderRight({ personPic: { name: 'Ada Lovelace' } });
			const avatar = page.getByRole('img', { name: 'Ada Lovelace' });
			expect((avatar.element() as HTMLElement).style.getPropertyValue('--av-size')).toBe('1.50rem');
			await screen.rerender({ right: { personPic: { name: 'Ada Lovelace', size: 32 } } });
			expect((avatar.element() as HTMLElement).style.getPropertyValue('--av-size')).toBe('2.00rem');
		});

		it('is not a button unless it has somewhere to go', async () => {
			renderRight({
				personPic: { name: 'Ada Lovelace' },
				hideMinimize: true,
				hideWindowToggle: true,
				hideClose: true
			});
			expect(page.getByRole('button').elements()).toHaveLength(0);
		});

		it('becomes a button named after the person when it is pressed', async () => {
			const onPersonPicClick = vi.fn();
			renderRight({ personPic: { name: 'Ada Lovelace' }, onPersonPicClick });
			await page.getByRole('button', { name: 'Ada Lovelace' }).click();
			expect(onPersonPicClick).toHaveBeenCalledOnce();
		});

		it('renders nothing without a person', async () => {
			renderRight({ onPersonPicClick: vi.fn() });
			expect(document.querySelector('.fs-avatar')).toBeNull();
			expect(document.querySelector('.fs-title-bar-actions')).toBeNull();
		});
	});

	describe('the custom menu', () => {
		it('renders before the person picture', async () => {
			renderRight({
				customMenu: raw('<button type="button">Settings</button>'),
				personPic: { name: 'Ada Lovelace' }
			});
			const actions = document.querySelector('.fs-title-bar-actions')!;
			expect(actions.firstElementChild).toHaveTextContent('Settings');
			expect(actions.lastElementChild).toHaveClass('fs-avatar');
		});

		it('opens a Menu from the icon of its trigger', async () => {
			render(TitleBarTestWrapper, { withMenu: true, right: {} });
			const icon = page.getByRole('button', { name: 'Preferences menu' }).element().querySelector('svg')!;
			await userEvent.click(icon);
			await expect.element(page.getByRole('menuitem', { name: 'Keyboard shortcuts' })).toBeInTheDocument();
		});

		it('renders in a composed title bar', async () => {
			render(TitleBarTestWrapper, { withSnippets: true, left: {}, right: {} });
			await expect.element(page.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
			await expect.element(page.getByRole('button', { name: 'Custom nav' })).toBeInTheDocument();
			await expect.element(page.getByText('Nightly')).toBeInTheDocument();
			await expect.element(page.getByText('Subtitle')).toBeInTheDocument();
		});
	});
});
