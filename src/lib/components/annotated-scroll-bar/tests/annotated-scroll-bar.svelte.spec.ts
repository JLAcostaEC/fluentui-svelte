import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Wrapper from './AnnotatedScrollBarTestWrapper.svelte';

const bar = () => page.getByRole('scrollbar', { name: 'Photo timeline' });
const target = () => page.getByTestId('target').element() as HTMLDivElement;
const rail = () => page.selector('.fs-annotated-scroll-bar-rail');
const arrows = () => page.selector('.fs-annotated-scroll-bar-arrow');
const top = (selector: string) =>
	page.selector(selector).element().getBoundingClientRect().top - rail().element().getBoundingClientRect().top;

describe('AnnotatedScrollBar', () => {
	it('reads the labels from the content and follows its scrolling, size and changes', async () => {
		const view = await render(Wrapper);
		await expect.element(bar()).toHaveAttribute('aria-controls', 'photos');
		await expect.element(bar()).toHaveAttribute('aria-valuemax', '1000');
		await expect.element(bar()).toHaveAttribute('aria-valuetext', '2023');

		target().style.overflowAnchor = 'none';
		target().scrollTop = 400;
		await expect.element(bar()).toHaveAttribute('aria-valuenow', '400');
		await expect.element(bar()).toHaveAttribute('aria-valuetext', '2021');

		target().querySelectorAll('section')[1].style.height = '350px';
		await expect.element(bar()).toHaveAttribute('aria-valuetext', '2022');

		await view.rerender({ first: 'Updated', count: 7 });
		await expect.element(bar()).toHaveAttribute('aria-valuemax', '1350');
		await expect.element(rail().getByText('Updated', { exact: true })).toBeInTheDocument();

		await page.getByRole('button', { name: 'Swap target' }).click();
		await expect.element(bar()).toHaveAttribute('aria-valuemax', '400');
		await expect.element(bar()).not.toHaveAttribute('aria-valuetext');
	});

	it('reads the labels from the elements that selector matches, named after their text', async () => {
		render(Wrapper, { subgroups: true, selector: '[data-scroll-subgroup]' });
		await expect.element(rail().getByText('December', { exact: true })).toBeInTheDocument();
		await expect.element(rail().getByText('2022', { exact: true })).not.toBeInTheDocument();
	});

	it('places labels at a selector or an offset', async () => {
		const view = await render(Wrapper, {
			subgroups: true,
			labels: [
				{
					label: 'First',
					selector: 'section',
					subgroups: [{ label: 'June', selector: '[data-scroll-subgroup="June"]' }]
				},
				{ label: 'Second', offset: 200 }
			]
		});
		await expect.element(bar()).toHaveAttribute('aria-valuetext', 'First: June');

		await rail().getByText('Second', { exact: true }).click();
		expect(target().scrollTop).toBe(200);
		await expect.element(bar()).toHaveAttribute('aria-valuetext', 'Second');

		await view.rerender({ hideSubgroups: true });
		await expect.element(rail().getByText('June', { exact: true })).not.toBeInTheDocument();
	});

	it('shows subgroups side by side as one position', async () => {
		render(Wrapper, { subgroups: true, style: 'height:600px' });
		const june = rail().getByText('June', { exact: true });
		const july = rail().getByText('July', { exact: true });
		await expect.element(july).toBeVisible();
		expect(june.element().getBoundingClientRect().bottom).toBeLessThanOrEqual(
			july.element().getBoundingClientRect().top
		);

		await userEvent.hover(june);
		await expect.element(page.getByRole('tooltip')).toHaveTextContent('2023: June, July');

		await rail().getByText('December', { exact: true }).click();
		expect(target().scrollTop).toBe(80);
	});

	it('scrolls with the keyboard', async () => {
		render(Wrapper);
		(bar().element() as HTMLElement).focus();
		const steps = { ArrowDown: 40, PageDown: 240, End: 1000, ArrowUp: 960, PageUp: 760, Home: 0 };
		for (const [key, offset] of Object.entries(steps)) {
			await userEvent.keyboard(`{${key}}`);
			expect(target().scrollTop).toBe(offset);
		}
	});

	it('puts the indicator under a press on the rail and keeps the focus on the bar', async () => {
		const onScrolling = vi.fn();
		render(Wrapper, { hideArrows: true, style: 'height:303px', onScrolling });
		// Between the labels of 2020 (150px) and 2019 (200px).
		await bar().click({ position: { x: 20, y: 185 } });
		expect(target().scrollTop).toBe(640);
		expect(onScrolling.mock.calls[0]).toEqual([expect.closeTo(640, 1), 'click']);
		expect(top('.fs-annotated-scroll-bar-indicator')).toBeCloseTo(185, 1);
		await expect.element(bar()).toHaveFocus();
	});

	it('maps a press inside a scaled ancestor', async () => {
		render(Wrapper, { hideArrows: true, style: 'height:303px; transform:scale(0.5); transform-origin:top left' });
		vi.spyOn(rail().element(), 'setPointerCapture').mockImplementation(() => {});
		const clientY = rail().element().getBoundingClientRect().top + 75;
		rail()
			.element()
			.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, isPrimary: true, clientY }));
		expect(target().scrollTop).toBe(500);
	});

	it('drags on from the label it pressed', async () => {
		render(Wrapper, { hideArrows: true, style: 'height:303px' });
		const label = rail().getByText('2021', { exact: true }).element() as HTMLElement;
		vi.spyOn(rail().element(), 'setPointerCapture').mockImplementation(() => {});
		const y = label.getBoundingClientRect().top;
		const pointer = { bubbles: true, button: 0, isPrimary: true, pointerId: 1 };

		label.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, clientY: y }));
		expect(target().scrollTop).toBe(400);
		rail()
			.element()
			.dispatchEvent(new PointerEvent('pointermove', { ...pointer, clientY: y + 30 }));
		expect(target().scrollTop).toBeCloseTo(520, 0);
		rail()
			.element()
			.dispatchEvent(new PointerEvent('pointerup', { ...pointer, clientY: y + 30 }));
		await expect.element(bar()).not.toHaveClass('fs-annotated-scroll-bar-dragging');
	});

	it('steps with the arrows and stops at the ends', async () => {
		const view = await render(Wrapper);
		await expect.element(arrows().first()).toBeDisabled();
		await arrows().nth(1).click();
		expect(target().scrollTop).toBe(40);
		await arrows().first().click();
		expect(target().scrollTop).toBe(0);

		await view.rerender({ hideArrows: true });
		expect(arrows().elements()).toHaveLength(0);
	});

	it('cancels a scroll when onScrolling returns false', async () => {
		const onScrolling = vi.fn(() => false);
		render(Wrapper, { onScrolling });
		(bar().element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(onScrolling).toHaveBeenCalledWith(40, 'keyboard');
		expect(target().scrollTop).toBe(0);
	});

	it('scrolls with the wheel and leaves zoom gestures to the page', async () => {
		render(Wrapper);
		await expect.element(bar()).toHaveAttribute('aria-valuemax', '1000');
		const wheel = (init: WheelEventInit) => {
			const event = new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true, ...init });
			bar().element().dispatchEvent(event);
			return event.defaultPrevented;
		};
		expect(wheel({ ctrlKey: true })).toBe(false);
		expect(target().scrollTop).toBe(0);
		expect(wheel({})).toBe(true);
		expect(target().scrollTop).toBe(120);
	});

	it('previews a position without scrolling and closes with Escape', async () => {
		render(Wrapper, { customDetail: true });
		await userEvent.hover(rail());
		await expect.element(page.getByRole('tooltip')).toHaveTextContent('Preview 600');
		expect(target().scrollTop).toBe(0);
		await userEvent.keyboard('{Escape}');
		await expect.element(page.getByRole('tooltip')).not.toBeInTheDocument();
	});

	it('describes the bar with the detail while it has the focus', async () => {
		render(Wrapper, { customDetail: true });
		(bar().element() as HTMLElement).focus();
		const tooltip = page.getByRole('tooltip');
		await expect.element(tooltip).toHaveTextContent('Preview 0');
		expect(bar().element().getAttribute('aria-describedby')).toBe(tooltip.element().id);

		await userEvent.keyboard('{ArrowDown}');
		await expect.element(tooltip).toHaveTextContent('Preview 80');
		await userEvent.keyboard('{Escape}');
		await expect.element(tooltip).not.toBeInTheDocument();
		await expect.element(bar()).not.toHaveAttribute('aria-describedby');
	});

	it('is inert when disabled or when the content fits, and still follows the content', async () => {
		const view = await render(Wrapper, { disabled: true });
		await expect.element(bar()).toHaveAttribute('aria-disabled', 'true');
		await expect.element(bar()).toHaveAttribute('tabindex', '-1');
		target().scrollTop = 400;
		await expect.element(bar()).toHaveAttribute('aria-valuenow', '400');
		(bar().element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(target().scrollTop).toBe(400);

		await view.rerender({ disabled: false, count: 1 });
		await expect.element(bar()).toHaveAttribute('aria-disabled', 'true');
		await view.rerender({ count: 2 });
		await expect.element(bar()).not.toHaveAttribute('aria-disabled');
	});

	it('hides labels that collide and keeps the first and last', async () => {
		render(Wrapper, { count: 40, style: 'height:150px' });
		await expect.element(bar()).toHaveAttribute('aria-valuemax', '7800');
		const shown = page
			.selector('.fs-annotated-scroll-bar-label:not(.fs-annotated-scroll-bar-strut)')
			.elements()
			.filter((label) => getComputedStyle(label).visibility === 'visible');
		expect(shown.length).toBeGreaterThan(1);
		expect(shown.length).toBeLessThan(40);
		expect(shown[0].textContent).toBe('2023');
		expect(shown.at(-1)!.textContent).toBe('1984');
		const boxes = shown.map((label) => label.getBoundingClientRect()).sort((a, b) => a.top - b.top);
		for (let index = 1; index < boxes.length; index++)
			expect(boxes[index].top).toBeGreaterThanOrEqual(boxes[index - 1].bottom);
	});
});
