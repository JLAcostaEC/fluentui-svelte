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
