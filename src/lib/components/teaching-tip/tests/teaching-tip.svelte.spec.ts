import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { TeachingTipHeader } from '#lib/index.js';
import TeachingTipTestWrapper from './TeachingTipTestWrapper.svelte';

describe('open state', () => {
	it('renders a dialog labelled by the header title', async () => {
		render(TeachingTipTestWrapper);
		const el = page.getByRole('dialog', { name: 'Tip title' });
		await expect.element(el).toBeVisible();
	});

	it('is hidden when closed', async () => {
		render(TeachingTipTestWrapper, { open: false });
		await expect.element(page.getByTestId('teaching-tip')).not.toBeVisible();
	});

	it('closes from the close button and calls onOpenChange', async () => {
		const onOpenChange = vi.fn();
		render(TeachingTipTestWrapper, { onOpenChange });
		await page.getByRole('button', { name: 'Close' }).click();
		await expect.element(page.getByTestId('teaching-tip')).not.toBeVisible();
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
	});

	it('closes with Escape', async () => {
		render(TeachingTipTestWrapper);
		await userEvent.keyboard('{Escape}');
		await expect.element(page.getByTestId('teaching-tip')).not.toBeVisible();
	});

	it('stays open on an Escape a child already handled', async () => {
		render(TeachingTipTestWrapper);
		const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
		event.preventDefault();
		document.dispatchEvent(event);
		await expect.element(page.getByTestId('teaching-tip')).toBeVisible();
	});

	it('moves the focus to the target when it closes with the focus inside', async () => {
		render(TeachingTipTestWrapper, { withTarget: true });
		await page.getByRole('button', { name: 'Close' }).click();
		await expect.element(page.getByTestId('target')).toHaveFocus();
	});

	it('does not submit a form from the close button', async () => {
		const onsubmit = vi.fn((e: SubmitEvent) => e.preventDefault());
		const form = document.createElement('form');
		form.addEventListener('submit', onsubmit);
		document.body.appendChild(form);
		render(TeachingTipTestWrapper, { target: form });
		form.appendChild(page.getByTestId('teaching-tip').element());
		await page.getByRole('button', { name: 'Close' }).click();
		expect(onsubmit).not.toHaveBeenCalled();
		form.remove();
	});
});

describe('light dismiss', () => {
	it('stays open on a click outside by default', async () => {
		render(TeachingTipTestWrapper);
		await page.getByTestId('outside').click();
		await expect.element(page.getByTestId('teaching-tip')).toBeVisible();
	});

	it('closes on a click outside when lightDismiss is set', async () => {
		render(TeachingTipTestWrapper, { lightDismiss: true });
		await page.getByTestId('outside').click();
		await expect.element(page.getByTestId('teaching-tip')).not.toBeVisible();
	});

	it('stays open on a click on its target', async () => {
		render(TeachingTipTestWrapper, { lightDismiss: true, withTarget: true });
		await page.getByTestId('target').click();
		await expect.element(page.getByTestId('teaching-tip')).toBeVisible();
	});
});

describe('target', () => {
	const rects = () => ({
		tip: page.getByTestId('teaching-tip').element().getBoundingClientRect(),
		target: page.getByTestId('target').element().getBoundingClientRect()
	});

	it('floats below its target and follows it', async () => {
		const screen = await render(TeachingTipTestWrapper, { withTarget: true });
		await expect.poll(() => Math.round(rects().tip.top - rects().target.bottom)).toBe(8);

		await screen.rerender({ targetOffset: 200 });
		await expect
			.poll(() =>
				Math.round(rects().tip.left + rects().tip.width / 2 - (rects().target.left + rects().target.width / 2))
			)
			.toBe(0);
	});

	it('drops the floating position when the target goes away', async () => {
		const screen = await render(TeachingTipTestWrapper, { withTarget: true });
		const tip = page.getByTestId('teaching-tip').element() as HTMLElement;
		await expect.poll(() => tip.style.transform).not.toBe('');

		await screen.rerender({ withTarget: false });
		await expect.poll(() => tip.style.transform).toBe('');
		await expect.element(page.getByTestId('teaching-tip')).toBeVisible();
	});

	it('stays in the flow without a target', async () => {
		render(TeachingTipTestWrapper);
		await expect.element(page.getByTestId('teaching-tip')).not.toHaveClass('targeted');
	});
});

describe('header', () => {
	it('hides the close button with hideCloseButton', async () => {
		render(TeachingTipTestWrapper, { headerProps: { hideCloseButton: true } });
		await expect.element(page.getByRole('button', { name: 'Close' })).not.toBeInTheDocument();
	});

	it('names the close button from closeLabel', async () => {
		render(TeachingTipTestWrapper, { headerProps: { closeLabel: 'Cerrar' } });
		await expect.element(page.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
	});

	it('shows no step counter by default', async () => {
		render(TeachingTipTestWrapper);
		await expect.element(page.getByText(/of/)).not.toBeInTheDocument();
	});

	it('shows the step counter when step and totalSteps are set', async () => {
		render(TeachingTipTestWrapper, { headerProps: { step: 1, totalSteps: 3 } });
		await expect.element(page.getByText('1 of 3')).toBeVisible();
	});

	it('formats the step counter with formatStep', async () => {
		render(TeachingTipTestWrapper, {
			headerProps: { step: 2, totalSteps: 3, formatStep: (step, total) => `${step} de ${total}` }
		});
		await expect.element(page.getByText('2 de 3')).toBeVisible();
	});

	it('throws outside of a TeachingTip', async () => {
		await expect(render(TeachingTipHeader, { title: 'Title' })).rejects.toThrow('TeachingTip context is not available');
	});
});

describe('parts', () => {
	it('renders the preview and the footer action', async () => {
		render(TeachingTipTestWrapper);
		await expect.element(page.getByTestId('preview')).toHaveTextContent('Preview');
		await expect.element(page.getByTestId('action')).toBeVisible();
	});
});
