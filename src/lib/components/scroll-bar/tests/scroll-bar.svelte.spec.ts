import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import ScrollBar from '../scroll-bar.svelte';
import TargetWrapper from './ScrollBarTargetWrapper.svelte';
import '#lib/css/theme.css';

const tall = createRawSnippet(() => ({ render: () => '<div style="height: 600px; width: 600px;">Content</div>' }));
const style = 'width: 200px; height: 100px;';

describe('ScrollBar', () => {
	it('stays expanded for collapseDelay after the pointer leaves', async () => {
		render(ScrollBar, { props: { children: tall, style, autoHide: 'never', collapseDelay: 600 } });
		await vi.waitFor(() => expect(document.querySelector('.fs-scroll-bar-arrow')).not.toBeNull());
		const bar = document.querySelector<HTMLElement>('.os-scrollbar-vertical')!;
		const width = () => bar.querySelector('.os-scrollbar-handle')!.getBoundingClientRect().width;
		await userEvent.hover(bar.querySelector<HTMLElement>('.os-scrollbar-track')!);
		await vi.waitFor(() => expect(width()).toBe(6));
		await userEvent.unhover(bar.querySelector<HTMLElement>('.os-scrollbar-track')!);
		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(width()).toBe(6);
		await vi.waitFor(() => expect(width()).toBe(2), { timeout: 2000 });
	});

	it('expands fully after a single quick pass of the pointer', async () => {
		render(ScrollBar, { props: { children: tall, style, autoHide: 'never' } });
		await vi.waitFor(() => expect(document.querySelector('.fs-scroll-bar-arrow')).not.toBeNull());
		const bar = document.querySelector<HTMLElement>('.os-scrollbar-vertical')!;
		const width = () => bar.querySelector('.os-scrollbar-handle')!.getBoundingClientRect().width;
		await vi.waitFor(() => expect(width()).toBe(2));
		bar.dispatchEvent(new PointerEvent('pointerenter'));
		bar.dispatchEvent(new PointerEvent('pointerleave'));
		await vi.waitFor(() => expect(width()).toBe(6));
	});

	it('renders the content inside a focusable, nameable viewport', async () => {
		render(ScrollBar, { props: { children: tall, style, viewportAttributes: { 'aria-label': 'Rows' } } });
		const viewport = page.getByLabelText('Rows');
		await expect.element(viewport).toHaveAttribute('tabindex', '0');
		await expect.element(viewport).toHaveTextContent('Content');
	});

	it('initializes OverlayScrollbars with the Fluent theme and exposes the instance', async () => {
		const initialized = vi.fn();
		render(ScrollBar, { props: { children: tall, style, events: { initialized } } });
		await vi.waitFor(() => expect(initialized).toHaveBeenCalledOnce());
		expect(document.querySelectorAll('.os-scrollbar.os-theme-fluent').length).toBe(2);
		expect(document.querySelectorAll('.fs-scroll-bar-arrow').length).toBe(4);
	});

	it('scrolls the viewport when an arrow is pressed', async () => {
		render(ScrollBar, { props: { children: tall, style, arrowStep: 40 } });
		await vi.waitFor(() => expect(document.querySelector('.fs-scroll-bar-arrow.down')).not.toBeNull());
		const viewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-contents]')!;
		const down = document.querySelector<HTMLElement>('.fs-scroll-bar-arrow.down')!;
		down.dispatchEvent(new PointerEvent('pointerdown', { button: 0, bubbles: true }));
		window.dispatchEvent(new PointerEvent('pointerup'));
		await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0));
	});

	it.each([
		[false, 'none'],
		[true, 'solid']
	])('shows the keyboard focus outline only with showFocusOutline (%s)', async (showFocusOutline, outline) => {
		render(ScrollBar, {
			props: { children: tall, style, showFocusOutline, viewportAttributes: { 'aria-label': 'Rows' } }
		});
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByLabelText('Rows')).toHaveFocus();
		expect(getComputedStyle(page.getByLabelText('Rows').element()).outlineStyle).toBe(outline);
	});

	it.each([
		[false, 'rgb(252, 252, 252)'],
		[true, 'rgba(0, 0, 0, 0)']
	])('paints the expanded track unless hideTrack is %s', async (hideTrack, background) => {
		render(ScrollBar, { props: { children: tall, style, expanded: true, hideTrack } });
		await vi.waitFor(() => expect(document.querySelector('.os-scrollbar-vertical')).not.toBeNull());
		const bar = document.querySelector('.os-scrollbar-vertical')!;
		await vi.waitFor(() => expect(getComputedStyle(bar).backgroundColor).toBe(background));
		expect(bar.querySelector('.os-scrollbar-handle')!.getBoundingClientRect().width).toBe(6);
	});

	it('hides the arrow buttons with hideArrows', async () => {
		render(ScrollBar, { props: { children: tall, style, hideArrows: true } });
		await vi.waitFor(() => expect(document.querySelector('.fs-scroll-bar-arrow')).not.toBeNull());
		expect(document.querySelector('.fs-scroll-bar')!.classList.contains('fs-scroll-bar-arrows')).toBe(false);
		expect(getComputedStyle(document.querySelector('.fs-scroll-bar-arrow')!).display).toBe('none');
	});

	it('keeps the track, the 6px thumb and the arrows visible when expanded', async () => {
		render(ScrollBar, { props: { children: tall, style, expanded: true } });
		await vi.waitFor(() => expect(document.querySelector('.fs-scroll-bar-arrow')).not.toBeNull());
		const handle = document.querySelector<HTMLElement>('.os-scrollbar-vertical .os-scrollbar-handle')!;
		await vi.waitFor(() => expect(handle.getBoundingClientRect().width).toBe(6));
		const bar = document.querySelector('.os-scrollbar-vertical')!.getBoundingClientRect();
		await vi.waitFor(() => expect(bar.right - handle.getBoundingClientRect().right).toBe(3));
		expect(getComputedStyle(document.querySelector('.fs-scroll-bar-arrow.up')!).opacity).toBe('1');
	});

	it('anchors the 2px resting thumb to the outer edge', async () => {
		render(ScrollBar, { props: { children: tall, style } });
		await vi.waitFor(() =>
			expect(document.querySelector('.os-scrollbar-vertical .os-scrollbar-handle')).not.toBeNull()
		);
		const handle = () => document.querySelector('.os-scrollbar-vertical .os-scrollbar-handle')!.getBoundingClientRect();
		await vi.waitFor(() => expect(handle().width).toBe(2));
		const bar = document.querySelector('.os-scrollbar-vertical')!.getBoundingClientRect();
		expect(bar.right - handle().right).toBe(1);
	});

	it('paints the scroll bars on an external element passed as scrollRef', async () => {
		render(TargetWrapper);
		const target = document.querySelector<HTMLElement>('[data-testid="target"]')!;
		await vi.waitFor(() => expect(target.querySelector('.os-scrollbar')).not.toBeNull());
		expect(document.querySelectorAll('.fs-scroll-bar')).toHaveLength(1);
		expect(target.classList).toContain('fs-scroll-bar');
		expect(target.classList).toContain('fs-scroll-bar-expanded');
		expect(target.querySelectorAll('.fs-scroll-bar-arrow')).toHaveLength(4);
		await expect.element(page.getByLabelText('External')).toHaveAttribute('tabindex', '0');
		await expect.element(page.getByLabelText('External')).toHaveTextContent('Target content');
	});
});
