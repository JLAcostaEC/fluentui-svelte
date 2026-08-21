import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Persona } from '$lib/index.js';

const persona = () => page.selector('.persona');

describe('rendering', () => {
	it('renders the name', async () => {
		render(Persona, { name: 'Ada Lovelace' });
		await expect.element(page.getByText('Ada Lovelace')).toBeInTheDocument();
	});

	it('renders an avatar beside the name', async () => {
		render(Persona, { name: 'Ada Lovelace' });
		await expect.element(page.selector('.persona .fs-avatar')).toBeInTheDocument();
	});

	it('leaves out the text lines it was not given', async () => {
		render(Persona, { name: 'Ada Lovelace' });
		const lines = document.querySelectorAll('.persona-data p');
		expect(lines).toHaveLength(1);
	});

	it('stacks the three text lines under the name', async () => {
		render(Persona, {
			name: 'Ada Lovelace',
			primaryText: 'Mathematician',
			secondaryText: 'Analytical Engine',
			tertiaryText: 'London'
		});

		await expect.element(page.getByText('Mathematician')).toBeInTheDocument();
		await expect.element(page.getByText('Analytical Engine')).toBeInTheDocument();
		await expect.element(page.getByText('London')).toBeInTheDocument();
	});
});

describe('size and layout', () => {
	it('is 42px across by default', async () => {
		render(Persona, { name: 'Ada Lovelace' });
		await expect.element(persona()).toBeInTheDocument();

		const el = document.querySelector<HTMLElement>('.persona')!;
		expect(el.style.getPropertyValue('--p-size')).toBe('42px');
	});

	it('takes the size it is given', async () => {
		render(Persona, { name: 'Ada Lovelace', size: 72 });
		await expect.element(persona()).toBeInTheDocument();

		const el = document.querySelector<HTMLElement>('.persona')!;
		expect(el.style.getPropertyValue('--p-size')).toBe('72px');
	});

	it('takes the text alignment it is given', async () => {
		render(Persona, { name: 'Ada Lovelace', textAlign: 'center' });
		await expect.element(persona()).toBeInTheDocument();

		const el = document.querySelector<HTMLElement>('.persona')!;
		expect(el.style.textAlign).toBe('center');
	});
});

describe('presence', () => {
	it('renders the badge on the avatar', async () => {
		render(Persona, { name: 'Ada Lovelace', presence: { status: 'available' } });
		await expect.element(page.selector('.persona .fs-badge-icon')).toBeInTheDocument();
	});

	it('drops the avatar and keeps the badge when presenceOnly is set', async () => {
		render(Persona, { name: 'Ada Lovelace', presence: { status: 'busy' }, presenceOnly: true });
		await expect.element(page.selector('.persona .fs-badge-icon')).toBeInTheDocument();
		await expect.element(page.selector('.persona .fs-avatar')).not.toBeInTheDocument();
	});
});
