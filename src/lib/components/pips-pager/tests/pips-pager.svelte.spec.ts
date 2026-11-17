import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Wrapper from './PipsPagerTestWrapper.svelte';
import '#lib/css/theme.css';

const pip = (page_: number) => page.getByRole('button', { name: `Page ${page_}`, exact: true });
const track = () => document.querySelector<HTMLElement>('.fs-pips-pager .track')!;

describe('PipsPager', () => {
	it('renders one pip per page and marks the selected one', async () => {
		render(Wrapper, { index: 2 });
		await expect.element(page.getByRole('group', { name: 'Pages' })).toBeInTheDocument();
		expect(document.querySelectorAll('.pip')).toHaveLength(8);
		await expect.element(pip(3)).toHaveAttribute('aria-current', 'page');
		await expect.element(pip(3)).toHaveAttribute('tabindex', '0');
		await expect.element(pip(1)).toHaveAttribute('tabindex', '-1');
		expect(page.getByRole('button', { name: 'Next page' }).query()).toBeNull();
	});

	it('selects a page on click', async () => {
		render(Wrapper);
		await pip(4).click();
		await expect.element(page.getByTestId('index')).toHaveTextContent('3');
		await expect.element(page.getByTestId('changes')).toHaveTextContent('3');
	});

	it('moves the focus with the arrow keys, Home and End, and selects with Enter', async () => {
		render(Wrapper);
		(pip(1).element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');
		await expect.element(pip(3)).toHaveFocus();
		await expect.element(page.getByTestId('index')).toHaveTextContent('0');
		await userEvent.keyboard('{Enter}');
		await expect.element(page.getByTestId('index')).toHaveTextContent('2');
		await userEvent.keyboard('{End}');
		await expect.element(pip(8)).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(pip(8)).toHaveFocus();
		await userEvent.keyboard('{Home}');
		await expect.element(pip(1)).toHaveFocus();
	});

	it('pages with the buttons and hides them at the edges', async () => {
		render(Wrapper, { buttonVisibility: 'visible', index: 6 });
		const next = page.getByRole('button', { name: 'Next page' });
		await next.click();
		await expect.element(page.getByTestId('index')).toHaveTextContent('7');
		await vi.waitFor(() => expect(getComputedStyle(document.querySelector('.nav.next')!).visibility).toBe('hidden'));
		await page.getByRole('button', { name: 'Previous page' }).click();
		await expect.element(page.getByTestId('index')).toHaveTextContent('6');
	});

	it('wraps from the last page to the first', async () => {
		render(Wrapper, { buttonVisibility: 'visible', wrap: true, index: 7 });
		await page.getByRole('button', { name: 'Next page' }).click();
		await expect.element(page.getByTestId('index')).toHaveTextContent('0');
		(pip(1).element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(pip(8)).toHaveFocus();
	});

	it('shows at most maxVisiblePips and scrolls the selected pip into view', async () => {
		render(Wrapper, { maxVisiblePips: 5, index: 7 });
		const window = document.querySelector<HTMLElement>('.fs-pips-pager .window')!;
		expect(window.getBoundingClientRect().width).toBe(60);
		await vi.waitFor(() => expect(getComputedStyle(track()).marginLeft).toBe('-36px'));
	});

	it('shows the page number on hover when showNumbers is set', async () => {
		render(Wrapper, { showNumbers: true });
		expect(document.querySelector('.number')).toBeNull();
		await pip(2).hover();
		await vi.waitFor(() => expect(pip(2).element().textContent).toBe('2'));
	});

	it('uses formatPage for the accessible names', async () => {
		render(Wrapper, { formatPage: (n: number) => `Slide ${n}` });
		await expect.element(page.getByRole('button', { name: 'Slide 1' })).toBeInTheDocument();
	});
});
