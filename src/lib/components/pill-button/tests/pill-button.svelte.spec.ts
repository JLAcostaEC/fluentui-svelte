import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Avatar, PillButton } from '#lib/index.js';
import PillButtonTestWrapper from './PillButtonTestWrapper.svelte';
import '#lib/css/theme.css';

const checkbox = () => page.getByRole('checkbox', { name: 'Unread' });
const form = () => document.querySelector<HTMLFormElement>('#pill-form')!;
const sizes = [
	['small', 24, 12],
	['medium', 32, 14],
	['large', 40, 16],
	['extra-large', 48, 18]
] as const;

describe('PillButton', () => {
	it('exposes a named native checkbox and updates its binding on click and Space', async () => {
		render(PillButtonTestWrapper);
		await expect.element(checkbox()).not.toBeChecked();
		await checkbox().click();
		await expect.element(checkbox()).toBeChecked();
		await expect.element(page.getByTestId('checked')).toHaveTextContent('true');
		await expect.element(page.selector('.fs-pill-button')).toHaveClass('selected');
		await userEvent.keyboard(' ');
		await expect.element(checkbox()).not.toBeChecked();
		await expect.element(page.getByTestId('checked')).toHaveTextContent('false');
	});

	it('calls native input and change handlers once per toggle', async () => {
		const oninput = vi.fn();
		const onchange = vi.fn();
		render(PillButtonTestWrapper, { pillProps: { oninput, onchange } });
		await checkbox().click();
		expect(oninput).toHaveBeenCalledOnce();
		expect(onchange).toHaveBeenCalledOnce();
	});

	it('submits only a checked value and never adds a submit button', async () => {
		render(PillButtonTestWrapper, { pillProps: { name: 'filter', value: 'unread' } });
		expect(new FormData(form()).getAll('filter')).toEqual([]);
		await checkbox().click();
		expect(new FormData(form()).getAll('filter')).toEqual(['unread']);
		expect(page.getByRole('button', { name: 'Unread' }).elements()).toHaveLength(0);
	});

	it('retains the native default checkbox value', async () => {
		render(PillButtonTestWrapper, { checked: true, pillProps: { name: 'filter' } });
		expect(new FormData(form()).get('filter')).toBe('on');
	});

	it('supports a form owner outside its wrapper', async () => {
		render(PillButtonTestWrapper, {
			external: true,
			checked: true,
			pillProps: { form: 'pill-form', name: 'filter', value: 'unread' }
		});
		expect(new FormData(form()).get('filter')).toBe('unread');
		await checkbox().click();
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(checkbox()).not.toBeChecked();
		await expect.element(page.getByTestId('checked')).toHaveTextContent('false');
	});

	it.each([false, true])('restores defaultChecked=%s and its binding on reset', async (defaultChecked) => {
		render(PillButtonTestWrapper, { pillProps: { defaultChecked } });
		await expect.element(checkbox()).toHaveProperty('checked', defaultChecked);
		await checkbox().click();
		await expect.element(checkbox()).toHaveProperty('checked', !defaultChecked);
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(checkbox()).toHaveProperty('checked', defaultChecked);
		await expect.element(page.getByTestId('checked')).toHaveTextContent(String(defaultChecked));
	});

	it('gives checked precedence over defaultChecked initially', async () => {
		render(PillButtonTestWrapper, { checked: false, pillProps: { defaultChecked: true } });
		await expect.element(checkbox()).not.toBeChecked();
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(checkbox()).toBeChecked();
	});

	it('participates in native required validation', async () => {
		render(PillButtonTestWrapper, { pillProps: { required: true } });
		const pill = page.selector('.fs-pill-button');
		const initialColor = getComputedStyle(pill.element()).color;
		expect(form().checkValidity()).toBe(false);
		await page.getByRole('button', { name: 'Submit' }).click();
		await expect.element(checkbox()).toBeInvalid();
		await vi.waitFor(() => {
			const style = getComputedStyle(pill.element());
			expect(style.color).not.toBe(initialColor);
			expect(style.color).toBe(style.borderTopColor);
		});
		const invalidColor = getComputedStyle(pill.element()).color;
		await checkbox().click();
		expect(form().checkValidity()).toBe(true);
		await vi.waitFor(() => expect(getComputedStyle(pill.element()).color).not.toBe(invalidColor));
	});

	it.each([false, true])('blocks interaction and submission when disabled by fieldset=%s', async (fieldsetDisabled) => {
		const onchange = vi.fn();
		render(PillButtonTestWrapper, {
			fieldsetDisabled,
			checked: true,
			pillProps: { disabled: !fieldsetDisabled, name: 'filter', value: 'unread', onchange }
		});
		await expect.element(checkbox()).toBeDisabled();
		(checkbox().element() as HTMLInputElement).click();
		expect(onchange).not.toHaveBeenCalled();
		expect(new FormData(form()).getAll('filter')).toEqual([]);
	});

	it('uses the enclosing Label and keeps its native label activation', async () => {
		render(PillButtonTestWrapper, { withLabel: true });
		const field = page.getByRole('checkbox', { name: 'Message filter' });
		await expect.element(field).toBeInTheDocument();
		await page.getByText('Message filter', { exact: true }).click();
		await expect.element(field).toBeChecked();
	});

	it('supports an icon-only accessible name', async () => {
		render(PillButton, { 'aria-label': 'Unread messages' });
		await expect.element(page.getByRole('checkbox', { name: 'Unread messages' })).toBeInTheDocument();
	});

	it.each(sizes)('renders the %s height and text size with balanced icon spacing', async (size, height, fontSize) => {
		render(PillButtonTestWrapper, { withIcon: true, pillProps: { size } });
		await expect.element(checkbox()).toBeInTheDocument();
		await expect.element(page.selector('.fs-pill-button-icon')).toHaveAttribute('aria-hidden', 'true');
		const pill = page.selector('.fs-pill-button').element();
		const box = pill.getBoundingClientRect();
		const icon = page.selector('.fs-pill-button-icon').element().getBoundingClientRect();
		expect(box.height).toBe(height);
		expect(getComputedStyle(pill).fontSize).toBe(`${fontSize}px`);
		expect(icon.left - box.left).toBe(icon.top - box.top);
	});

	it('renders decorative media without changing the checkbox name', async () => {
		render(PillButtonTestWrapper, { withAvatar: true });
		await expect.element(checkbox()).toBeInTheDocument();
		await expect.element(page.selector('.fs-pill-button-media')).toHaveAttribute('aria-hidden', 'true');
	});

	it.each(['circular', 'rounded', 'square'] as const)('passes the %s shape to the media snippet', async (shape) => {
		render(PillButtonTestWrapper, { withAvatar: true, pillProps: { shape } });
		await expect.element(page.getByTestId('avatar')).toHaveClass(shape);
	});

	it('updates the shape passed to media when the pill shape changes', async () => {
		render(PillButtonTestWrapper, { withAvatar: true, pillProps: { shape: 'rounded' } });
		await expect.element(page.getByTestId('avatar')).toHaveClass('rounded');
		await page.getByRole('button', { name: 'Use square shape' }).click();
		await expect.element(page.getByTestId('avatar')).toHaveClass('square');
	});

	it('passes shape to a media component as props', async () => {
		render(PillButton, { media: Avatar, shape: 'square', 'aria-label': 'Filter' });
		await expect.element(page.selector('.fs-pill-button-media .fs-avatar')).toHaveClass('square');
		await expect.element(page.getByRole('checkbox', { name: 'Filter' })).toBeInTheDocument();
	});

	it.each([
		['rounded', '4px'],
		['square', '0px']
	] as const)('applies the %s shape', async (shape, radius) => {
		render(PillButtonTestWrapper, { pillProps: { shape } });
		expect(getComputedStyle(page.selector('.fs-pill-button').element()).borderRadius).toBe(radius);
	});

	it.each(sizes)('fits an avatar symmetrically inside a %s pill', async (size) => {
		render(PillButtonTestWrapper, { withAvatar: true, pillProps: { size } });
		const pill = page.selector('.fs-pill-button').element().getBoundingClientRect();
		const avatar = page.getByTestId('avatar').element().getBoundingClientRect();
		expect(avatar.height).toBe(pill.height - 8);
		expect(avatar.width).toBe(avatar.height);
		expect(avatar.left - pill.left).toBe(4);
		expect(avatar.top - pill.top).toBeCloseTo(4, 1);
		expect(pill.bottom - avatar.bottom).toBeCloseTo(4, 1);
		await page.selector('.fs-pill-button').click({ position: { x: 8, y: pill.height / 2 } });
		await expect.element(checkbox()).toBeChecked();
	});

	it('forwards explicit accessible names, descriptions and input attributes', async () => {
		render(PillButtonTestWrapper, {
			pillProps: { id: 'filter', 'aria-label': 'Unread messages', 'aria-describedby': 'hint', class: 'custom-input' }
		});
		const field = page.getByRole('checkbox', { name: 'Unread messages' });
		await expect.element(field).toHaveAttribute('id', 'filter');
		await expect.element(field).toHaveAttribute('aria-describedby', 'hint');
		await expect.element(field).toHaveClass('custom-input');
	});

	it('forwards both DOM references and keeps wrapper attributes on the surface', async () => {
		render(PillButtonTestWrapper, { pillProps: { wrapperAttributes: { class: 'custom-pill' } } });
		await expect.element(page.selector('.fs-pill-button')).toHaveClass('custom-pill');
		await expect.element(page.getByTestId('wrapper-ref')).toHaveTextContent('SPAN');
		await page.getByRole('button', { name: 'Focus pill' }).click();
		await expect.element(checkbox()).toHaveFocus();
	});
});
