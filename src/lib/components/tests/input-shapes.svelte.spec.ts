import { expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import Fixture from './InputShapesTestWrapper.svelte';
import '#lib/css/theme.css';

const controlFor = (id: string) => {
	const wrapper = page.getByTestId(id).element();
	return id === 'search'
		? wrapper.querySelector('.fs-textbox')!
		: id === 'tags'
			? wrapper.querySelector('.control')!
			: wrapper;
};

const expectCircularRadius = async (control: Element) => {
	const { width, height } = control.getBoundingClientRect();
	await expect
		.poll(() => parseFloat(getComputedStyle(control).borderTopLeftRadius))
		.toBeCloseTo(Math.min(width, height) / 2, 2);
};

it('recalculates circular radii on resize and stops measuring other shapes', async () => {
	const view = await render(Fixture);
	const controls = ['search', 'choice', 'native', 'tags'].map(controlFor);

	for (const control of controls) {
		await expectCircularRadius(control);
		const radius = getComputedStyle(control).borderTopLeftRadius;
		(control as HTMLElement).style.height = `${control.getBoundingClientRect().height + 20}px`;
		await expect.poll(() => getComputedStyle(control).borderTopLeftRadius).not.toBe(radius);
		await expectCircularRadius(control);
	}

	await view.rerender({ shape: 'rounded' });
	for (const control of controls) {
		expect((control as HTMLElement).style.getPropertyValue('--input-circular-radius')).toBe('');
	}
});

it.each(['search', 'choice', 'tags', 'native'] as const)(
	'keeps %s circular radii stable when opening above and below',
	async (id) => {
		const view = await render(Fixture, { positioned: id, above: true });
		const wrapper = page.getByTestId(id).element();
		const control = controlFor(id);
		const input = wrapper.querySelector(
			'input:not([type="hidden"]), button.fs-dropdown-button, select'
		)! as HTMLElement;

		for (const above of [true, false]) {
			await view.rerender({ positioned: id, above });
			await expectCircularRadius(control);
			const radius = getComputedStyle(control).borderTopLeftRadius;
			input.focus();
			if (id === 'native') await page.selector('select[name="native"]').click();
			else await userEvent.keyboard('{ArrowDown}');
			await expect
				.poll(() => (id === 'native' ? input.matches(':open') : input.getAttribute('aria-expanded') === 'true'))
				.toBe(true);

			const flatCorner = above ? 'borderTopLeftRadius' : 'borderBottomLeftRadius';
			const roundCorner = above ? 'borderBottomLeftRadius' : 'borderTopLeftRadius';
			await expect.poll(() => getComputedStyle(control)[flatCorner]).toBe('0px');
			expect(getComputedStyle(control)[roundCorner]).toBe(radius);
			await userEvent.keyboard('{Escape}');
			await expect.poll(() => getComputedStyle(control).borderRadius).toBe(radius);
		}
	}
);
