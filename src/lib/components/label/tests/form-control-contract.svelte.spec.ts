import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import LabelControlsTestWrapper from './LabelControlsTestWrapper.svelte';
import LabelTestWrapper from './LabelTestWrapper.svelte';

/**
 * `proxy` marks the controls whose visible element stands in for a native field kept out of sight:
 * the label belongs to the native field, and names the visible element through `aria-labelledby`.
 * `aria` marks a control with no native field, which the label names through `aria-labelledby` alone.
 */
const controls = [
	{ control: 'TextBox', role: 'textbox', interaction: 'focus', proxy: false },
	{ control: 'NumberBox', role: 'spinbutton', interaction: 'focus', proxy: false },
	{ control: 'TextArea', role: 'textbox', interaction: 'focus', proxy: false },
	{ control: 'DropdownSelect', role: 'combobox', interaction: 'focus', proxy: false },
	{ control: 'Checkbox', role: 'checkbox', interaction: 'check', proxy: false },
	{ control: 'RadioButton', role: 'radio', interaction: 'check', proxy: false },
	{ control: 'ToggleSwitch', role: 'switch', interaction: 'check', proxy: false },
	{ control: 'Dropdown', role: 'combobox', interaction: 'listbox', proxy: true },
	{ control: 'TagPicker', role: 'combobox', interaction: 'focus', proxy: true },
	{ control: 'AutoSuggestBox', role: 'combobox', interaction: 'focus', proxy: false },
	{ control: 'DatePicker', role: 'button', interaction: 'dialog', proxy: true },
	{ control: 'TimePicker', role: 'button', interaction: 'dialog', proxy: true },
	{ control: 'CalendarDatePicker', role: 'button', interaction: 'dialog', proxy: true },
	{ control: 'Slider', role: 'slider', interaction: 'focus', proxy: false },
	{ control: 'Rating', role: 'radiogroup', interaction: 'aria', proxy: false }
] as const;

type Role = (typeof controls)[number]['role'];

const named = (role: Role, name: string) => page.getByRole(role, { name, exact: true });
const labelText = () => document.querySelector<HTMLLabelElement>('label.fs-label-text')!;

describe.each(controls)('Label with $control', ({ control, role, interaction, proxy }) => {
	it('names the control people use, and only it, and is for the id the field has of its own', async () => {
		await render(LabelControlsTestWrapper, { control, fieldId: 'own' });
		const field = named(role, 'Field label');

		await expect.poll(() => field.elements().length).toBe(1);
		expect(field.element().closest('label')).toBeNull();
		if (interaction === 'aria' || proxy) {
			expect(field.element().getAttribute('aria-labelledby')).toBe(labelText().id);
		}
		if (interaction === 'aria') {
			expect(labelText().hasAttribute('for')).toBe(false);
		} else {
			await expect.poll(() => labelText().htmlFor).toBe('own');
			const native = labelText().control as HTMLInputElement | HTMLSelectElement;
			expect(native.id).toBe('own');
			if (proxy) {
				expect(native).not.toBe(field.element());
				expect(native.willValidate).toBe(true);
				expect(native.tabIndex).toBe(-1);
			} else {
				expect(native).toBe(field.element());
			}
		}
	});
});

describe.each(controls.filter(({ interaction }) => interaction !== 'aria'))(
	'Clicking Label for $control',
	({ control, role, interaction }) => {
		it('activates the control, which takes the id of the label when it has none', async () => {
			await render(LabelControlsTestWrapper, { control });
			const field = named(role, 'Field label');

			await expect.poll(() => labelText().control?.id).toBe(`${labelText().id}-field`);
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

/** The label text, its position and its required mark are the Label's own: a native field, a proxy and a group stand for the rest. */
describe.each(controls.filter(({ control }) => ['TextBox', 'Dropdown', 'Rating'].includes(control)))(
	'Label text of $control',
	({ control, role }) => {
		it('keeps the control named when the label text and position change', async () => {
			const view = await render(LabelControlsTestWrapper, { control });
			for (const labelPosition of ['before', 'after', 'above', 'below'] as const) {
				const label = 'Field ' + labelPosition;
				await view.rerender({ control, label, labelPosition });
				await expect.element(named(role, label)).toBeInTheDocument();
			}
		});

		it('keeps the required indicator out of the control name', async () => {
			await render(LabelControlsTestWrapper, { control, required: true });
			await expect.element(named(role, 'Field label')).toBeInTheDocument();
			await expect.element(page.getByTitle('Required field')).toHaveTextContent('*');
		});
	}
);

it('is for the first field inside it only', async () => {
	await render(LabelControlsTestWrapper, { control: 'TextBox', second: true });
	const [first, second] = document.querySelectorAll('input');

	await expect.poll(() => labelText().control).toBe(first);
	expect(second.id).not.toBe(first.id);
	expect(second.labels).toHaveLength(0);
});

it.each(['TextBox', 'Dropdown'] as const)('hands its for to a %s with no id of its own', async (control) => {
	await render(LabelControlsTestWrapper, { control, labelFor: 'given' });

	expect(labelText().htmlFor).toBe('given');
	await expect.poll(() => labelText().control?.id).toBe('given');
});

it.each(['Checkbox', 'RadioButton', 'ToggleSwitch'] as const)(
	'leaves out the own text of a %s inside it',
	async (control) => {
		await render(LabelControlsTestWrapper, { control });

		expect(document.body.textContent).not.toContain('Inner text');
		expect(document.querySelectorAll('label')).toHaveLength(1);
	}
);

it('leaves out the fallback name of a Slider inside it', async () => {
	await render(LabelControlsTestWrapper, { control: 'Slider' });

	expect(document.querySelector('input[type="range"]')!.hasAttribute('aria-label')).toBe(false);
});

it('closes a labeled Dropdown when the label of another field is clicked', async () => {
	// The other field goes first: below the Dropdown, its open listbox would cover the label.
	await render(LabelTestWrapper, { field: 'Other field' });
	await render(LabelControlsTestWrapper, { control: 'Dropdown' });
	const dropdown = named('combobox', 'Field label');
	await page.getByText('Field label', { exact: true }).click();
	await expect.element(dropdown).toHaveAttribute('aria-expanded', 'true');

	await page.getByText('Other field', { exact: true }).click();
	await expect.element(page.getByRole('textbox', { name: 'Other field', exact: true })).toHaveFocus();
	await expect.element(dropdown).toHaveAttribute('aria-expanded', 'false');
});
