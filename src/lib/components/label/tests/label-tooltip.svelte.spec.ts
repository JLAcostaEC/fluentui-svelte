import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import LabelTooltipTestWrapper from './LabelTooltipTestWrapper.svelte';

const badge = () => page.getByRole('button', { name: 'Bank More information' });
const tooltip = () => document.querySelector<HTMLElement>('[role="tooltip"]')!;
const shown = () => !tooltip().classList.contains('tooltip-hidden');

describe('Label tooltip', () => {
	it('renders no badge without tooltipContent', async () => {
		render(LabelTooltipTestWrapper, { content: 'none' });

		expect(document.querySelector('.fs-label-info')).toBeNull();
		expect(document.querySelector('[role="tooltip"]')).toBeNull();
	});

	it('keeps the badge out of the name of the field', async () => {
		render(LabelTooltipTestWrapper);

		await expect.element(page.getByRole('textbox', { name: 'Bank', exact: true })).toBeInTheDocument();
	});

	it('names the badge after the label text, and describes it with the tooltip', async () => {
		render(LabelTooltipTestWrapper);

		await expect.element(badge()).toHaveAccessibleDescription('The bank that holds the account.');
	});

	it('shows the tooltip when the badge takes focus', async () => {
		render(LabelTooltipTestWrapper);
		expect(shown()).toBe(false);

		(badge().element() as HTMLElement).focus();
		await expect.poll(shown).toBe(true);
	});

	it('takes a tooltipBadge snippet instead of the info icon', async () => {
		render(LabelTooltipTestWrapper, { badge: 'snippet' });

		const snippet = page.getByTestId('snippet-badge').element();
		expect(badge().element().contains(snippet)).toBe(true);
		expect(badge().element().querySelector('svg')).toBeNull();
	});

	it('takes the name of the badge from tooltipButtonAttributes', async () => {
		render(LabelTooltipTestWrapper, { tooltipButtonAttributes: { 'aria-label': 'Más información' } });

		await expect.element(page.getByRole('button', { name: 'Bank Más información' })).toBeInTheDocument();
	});
});
