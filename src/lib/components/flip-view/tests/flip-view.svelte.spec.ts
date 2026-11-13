import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Wrapper from './FlipViewTestWrapper.svelte';
import '#lib/css/theme.css';

const viewport = () => document.querySelector<HTMLElement>('.fs-flip-view .viewport')!;
const items = () => [...viewport().children] as HTMLElement[];

describe('FlipView', () => {
	it('shows one item at a time and makes the others inert', async () => {
		render(Wrapper);
		await expect.element(page.getByRole('region', { name: 'Gallery' })).toBeInTheDocument();
		await vi.waitFor(() => expect(items().map((item) => item.inert)).toEqual([false, true, true]));
		expect(items()[0].getBoundingClientRect().width).toBe(300);
		expect(page.getByRole('button', { name: 'Previous' }).query()).toBeNull();
	});

	it('flips with the next and previous buttons', async () => {
		render(Wrapper);
		await page.getByRole('button', { name: 'Next' }).click();
		await expect.element(page.getByTestId('index')).toHaveTextContent('1');
		await vi.waitFor(() => expect(viewport().scrollLeft).toBe(300));
		await page.getByRole('button', { name: 'Previous' }).click();
		await expect.element(page.getByTestId('index')).toHaveTextContent('0');
		await vi.waitFor(() => expect(viewport().scrollLeft).toBe(0));
		await expect.element(page.getByTestId('changes')).toHaveTextContent('1,0');
	});

	it('flips with the keyboard and hides the next button on the last item', async () => {
		render(Wrapper);
		viewport().focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(page.getByTestId('index')).toHaveTextContent('1');
		await userEvent.keyboard('{End}');
		await expect.element(page.getByTestId('index')).toHaveTextContent('2');
		expect(page.getByRole('button', { name: 'Next' }).query()).toBeNull();
		await userEvent.keyboard('{Home}');
		await expect.element(page.getByTestId('index')).toHaveTextContent('0');
	});

	it('follows bind:index and the initial index', async () => {
		render(Wrapper, { initial: 1 });
		await vi.waitFor(() => expect(viewport().scrollLeft).toBe(300));
		await page.getByRole('button', { name: 'Go to last' }).click();
		await vi.waitFor(() => expect(viewport().scrollLeft).toBe(600));
		expect(items()[2].inert).toBe(false);
	});

	it('makes a replacement hidden item inert without a count change', async () => {
		render(Wrapper);
		await vi.waitFor(() => expect(items()[1].inert).toBe(true));
		const replacement = document.createElement('section');
		replacement.innerHTML = '<a href="#replacement">Replacement</a>';
		items()[1].replaceWith(replacement);
		await vi.waitFor(() => expect(replacement.inert).toBe(true));
		expect(items()[0].inert).toBe(false);
	});

	it.each([-1, 99])('clamps the initial index %s and reports the correction', async (initial) => {
		render(Wrapper, { initial });
		const expected = initial < 0 ? 0 : 2;
		await expect.element(page.getByTestId('index')).toHaveTextContent(String(expected));
		await expect.element(page.getByTestId('changes')).toHaveTextContent(String(expected));
		await vi.waitFor(() => expect(items().map((item) => item.inert)).toEqual([0, 1, 2].map((i) => i !== expected)));
	});

	it('clamps an external index update and a count reduction', async () => {
		render(Wrapper);
		await page.getByRole('button', { name: 'Go out of range' }).click();
		await expect.element(page.getByTestId('index')).toHaveTextContent('2');
		await expect.element(page.getByTestId('changes')).toHaveTextContent('2');
		items()[2].remove();
		await expect.element(page.getByTestId('index')).toHaveTextContent('1');
		await expect.element(page.getByTestId('changes')).toHaveTextContent('2,1');
		await vi.waitFor(() => expect(items().map((item) => item.inert)).toEqual([true, false]));
	});

	it('includes both navigation buttons in the Tab order', async () => {
		render(Wrapper, { initial: 1 });
		await vi.waitFor(() => expect(items()[1].inert).toBe(false));
		items()[1].querySelector('a')!.focus();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('button', { name: 'Previous' })).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('button', { name: 'Next' })).toHaveFocus();
	});

	it('settles the index after a native scroll (swipe or wheel)', async () => {
		render(Wrapper);
		viewport().scrollTo({ left: 600, behavior: 'instant' });
		await expect.element(page.getByTestId('index')).toHaveTextContent('2');
	});

	it('flips vertically', async () => {
		render(Wrapper, { orientation: 'vertical' });
		await page.getByRole('button', { name: 'Next' }).click();
		await vi.waitFor(() => expect(viewport().scrollTop).toBe(200));
		viewport().focus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(page.getByTestId('index')).toHaveTextContent('2');
		await vi.waitFor(() => expect(viewport().scrollTop).toBe(400));
	});
});
