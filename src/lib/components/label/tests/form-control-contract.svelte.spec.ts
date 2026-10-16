import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import LabelControlsTestWrapper from './LabelControlsTestWrapper.svelte';
import LabelTestWrapper from './LabelTestWrapper.svelte';

const controls = [
	{ control: 'TextBox', role: 'textbox', interaction: 'focus' },
	{ control: 'NumberBox', role: 'spinbutton', interaction: 'focus' },
	{ control: 'TextArea', role: 'textbox', interaction: 'focus' },
	{ control: 'DropdownSelect', role: 'combobox', interaction: 'focus' },
	{ control: 'Checkbox', role: 'checkbox', interaction: 'check' },
	{ control: 'RadioButton', role: 'radio', interaction: 'check' },
	{ control: 'ToggleSwitch', role: 'switch', interaction: 'check' },
	{ control: 'Dropdown', role: 'combobox', interaction: 'listbox' },
	{ control: 'TagPicker', role: 'combobox', interaction: 'focus' },
	{ control: 'AutoSuggestBox', role: 'combobox', interaction: 'focus' },
	{ control: 'DatePicker', role: 'button', interaction: 'dialog' },
	{ control: 'TimePicker', role: 'button', interaction: 'dialog' },
	{ control: 'CalendarDatePicker', role: 'button', interaction: 'dialog' },
	{ control: 'CalendarView', role: 'group', interaction: 'aria' },
	{ control: 'Slider', role: 'slider', interaction: 'aria' },
	{ control: 'Rating', role: 'radiogroup', interaction: 'aria' }
] as const;

describe.each(controls)('Label with $control', ({ control, role, interaction }) => {
	it('associates its text with the control without including the field content in its name', async () => {
		await render(LabelControlsTestWrapper, { control });
		const field = page.getByRole(role, { name: 'Field label', exact: true });
		const label = page.getByText('Field label', { exact: true });

		await expect.element(field).toBeInTheDocument();
		if (interaction === 'aria') {
			await expect.element(field).toHaveAttribute('aria-labelledby', label.element().id);
		} else {
			expect((label.element() as HTMLLabelElement).control).toBe(field.element());
		}
		expect(field.element().closest('label')).toBeNull();
	});

	it('keeps the control named when the label text and position change', async () => {
		const view = await render(LabelControlsTestWrapper, { control });
		for (const labelPosition of ['before', 'after', 'above', 'below'] as const) {
			const label = 'Field ' + labelPosition;
			await view.rerender({ control, label, labelPosition });
			await expect.element(page.getByRole(role, { name: label, exact: true })).toBeInTheDocument();
		}
	});

	it('keeps the required indicator out of the control name', async () => {
		await render(LabelControlsTestWrapper, { control, required: true });
		await expect.element(page.getByRole(role, { name: 'Field label', exact: true })).toBeInTheDocument();
		await expect.element(page.getByTitle('Required field')).toHaveTextContent('*');
	});
});

describe.each(controls.filter(({ interaction }) => interaction !== 'aria'))(
	'Clicking Label for $control',
	({ control, role, interaction }) => {
		it('activates its associated control', async () => {
			await render(LabelControlsTestWrapper, { control });
			const field = page.getByRole(role, { name: 'Field label', exact: true });
			await page.getByText('Field label', { exact: true }).click();

			if (interaction === 'dialog' || interaction === 'listbox') {
				await expect.element(field).toHaveAttribute('aria-expanded', 'true');
				await expect.element(page.getByRole(interaction)).toBeVisible();
			} else {
				await expect.element(field).toHaveFocus();
				if (interaction === 'check') await expect.element(field).toBeChecked();
			}
		});
	}
);

it('closes a labeled Dropdown when the label of another field is clicked', async () => {
	await render(LabelControlsTestWrapper, { control: 'Dropdown' });
	await render(LabelTestWrapper, { field: 'Other field' });
	const dropdown = page.getByRole('combobox', { name: 'Field label', exact: true });
	await page.getByText('Field label', { exact: true }).click();
	await expect.element(dropdown).toHaveAttribute('aria-expanded', 'true');

	await page.getByText('Other field', { exact: true }).click();
	await expect.element(page.getByRole('textbox', { name: 'Other field', exact: true })).toHaveFocus();
	await expect.element(dropdown).toHaveAttribute('aria-expanded', 'false');
});
