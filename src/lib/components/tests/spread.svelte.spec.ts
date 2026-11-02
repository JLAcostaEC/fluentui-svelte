import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SpreadTestWrapper from './SpreadTestWrapper.svelte';

// When a parent's spread changes, Svelte recomputes every `$bindable` prop the parent doesn't bind, and one
// without a default loses what the control stored in it: the typed value, the check, the element of `bind:this`
// (sveltejs/svelte#15379). A `null` default keeps it.
describe('a spread that changes', () => {
	it('keeps what the controls hold', async () => {
		const view = await render(SpreadTestWrapper);
		await page.getByRole('textbox', { name: 'Name' }).fill('Ada');
		await page.getByRole('checkbox').click();

		await view.rerender({ attributes: { 'aria-invalid': true } });

		await expect.element(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
		await expect.element(page.getByRole('checkbox')).toBeChecked();
		await page.getByRole('combobox').click();
		await expect
			.element(page.selector('.fs-tagpicker-flyout').getByRole('option', { name: 'Apple' }))
			.toBeInTheDocument();
	});
});
