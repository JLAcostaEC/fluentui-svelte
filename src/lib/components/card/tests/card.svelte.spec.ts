import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { Card } from '$lib/index.js';
import CardTestWrapper from './CardTestWrapper.svelte';

describe('element type', () => {
	it('renders as a <div> by default', async () => {
		render(CardTestWrapper);
		const el = page.selector('div.fs-card');
		await expect.element(el).toBeInTheDocument();
	});

	it('exposes the card as a group', async () => {
		render(CardTestWrapper);
		const el = page.getByRole('group');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders as an <article> when as="article"', async () => {
		render(Card, { as: 'article' });
		const el = page.selector('article.fs-card');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders as a <section> when as="section"', async () => {
		render(Card, { as: 'section' });
		const el = page.selector('section.fs-card');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders as an <a> when as="a"', async () => {
		render(Card, { as: 'a', href: '#' });
		const el = page.selector('a.fs-card');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders its children', async () => {
		render(CardTestWrapper);
		const el = page.getByTestId('card-content');
		await expect.element(el).toHaveTextContent('Card content');
	});
});

describe('appearance', () => {
	it('applies the filled appearance by default', async () => {
		render(CardTestWrapper);
		const el = page.getByRole('group');
		await expect.element(el).toHaveClass('filled');
	});

	it('applies the outlined appearance', async () => {
		render(CardTestWrapper, { appearance: 'outlined' });
		const el = page.getByRole('group');
		await expect.element(el).toHaveClass('outlined');
	});

	it('applies the subtle appearance', async () => {
		render(CardTestWrapper, { appearance: 'subtle' });
		const el = page.getByRole('group');
		await expect.element(el).toHaveClass('subtle');
	});
});

describe('orientation', () => {
	it('applies the horizontal orientation by default', async () => {
		render(CardTestWrapper);
		const el = page.getByRole('group');
		await expect.element(el).toHaveClass('horizontal');
	});

	it('applies the vertical orientation', async () => {
		render(CardTestWrapper, { orientation: 'vertical' });
		const el = page.getByRole('group');
		await expect.element(el).toHaveClass('vertical');
	});
});

describe('id', () => {
	it('falls back to a generated id', async () => {
		render(CardTestWrapper);
		const el = page.selector('[id^="fs-card-"]');
		await expect.element(el).toBeInTheDocument();
	});

	it('uses the given id', async () => {
		render(CardTestWrapper, { id: 'my-card' });
		const el = page.getByRole('group');
		await expect.element(el).toHaveAttribute('id', 'my-card');
	});
});

describe('selection', () => {
	it('is not actionable when it is not selectable', async () => {
		render(CardTestWrapper);
		const el = page.getByRole('group');
		await expect.element(el).not.toHaveClass('actionable');
	});

	it('is actionable when it is selectable', async () => {
		render(CardTestWrapper, { selectable: true });
		const el = page.getByRole('group');
		await expect.element(el).toHaveClass('actionable');
	});

	it('is actionable when it renders as a link', async () => {
		render(Card, { as: 'a', href: '#' });
		const el = page.getByRole('group');
		await expect.element(el).toHaveClass('actionable');
	});

	it('selects the card when clicked', async () => {
		render(CardTestWrapper, { selectable: true });
		const el = page.getByRole('group');
		await el.click();
		await expect.element(el).toHaveClass('selected');
	});

	it('deselects the card when clicked again', async () => {
		render(CardTestWrapper, { selectable: true });
		const el = page.getByRole('group');
		await el.click();
		await el.click();
		await expect.element(el).not.toHaveClass('selected');
	});

	it('calls onSelectionChange with the id and the new selection', async () => {
		const onSelectionChange = vi.fn();
		render(CardTestWrapper, { selectable: true, id: 'my-card', onSelectionChange });
		await page.getByRole('group').click();
		expect(onSelectionChange).toHaveBeenCalledWith('my-card', true);
	});

	it('does not select the card when it is not selectable', async () => {
		const onSelectionChange = vi.fn();
		render(CardTestWrapper, { onSelectionChange });
		const el = page.getByRole('group');
		await el.click();
		await expect.element(el).not.toHaveClass('selected');
		expect(onSelectionChange).not.toHaveBeenCalled();
	});

	it('calls onclick when a selectable card is clicked', async () => {
		const onclick = vi.fn();
		render(CardTestWrapper, { selectable: true, onclick });
		await page.getByRole('group').click();
		expect(onclick).toHaveBeenCalledOnce();
	});
});

describe('disabled state', () => {
	it('applies the disabled class', async () => {
		render(CardTestWrapper, { disabled: true });
		const el = page.getByRole('group');
		await expect.element(el).toHaveClass('disabled');
	});

	it('is not actionable when disabled', async () => {
		render(CardTestWrapper, { selectable: true, disabled: true });
		const el = page.getByRole('group');
		await expect.element(el).not.toHaveClass('actionable');
	});

	it('does not select the card when disabled', async () => {
		const onSelectionChange = vi.fn();
		render(CardTestWrapper, { selectable: true, disabled: true, onSelectionChange });
		const el = page.getByRole('group');
		await el.click({ force: true });
		await expect.element(el).not.toHaveClass('selected');
		expect(onSelectionChange).not.toHaveBeenCalled();
	});
});

describe('floating action', () => {
	it('renders a checkbox when selectable and showFloatingAction', async () => {
		render(CardTestWrapper, { selectable: true, showFloatingAction: true });
		const el = page.getByRole('checkbox');
		await expect.element(el).toBeInTheDocument();
	});

	it('does not render a checkbox when only selectable', async () => {
		render(CardTestWrapper, { selectable: true });
		const el = page.getByRole('checkbox');
		await expect.element(el).not.toBeInTheDocument();
	});

	it('labels the checkbox by the title of the header', async () => {
		render(CardTestWrapper, { selectable: true, showFloatingAction: true, id: 'my-card', part: 'header' });
		const el = page.getByRole('checkbox');
		await expect.element(el).toHaveAttribute('aria-labelledby', 'my-card-title');
	});

	it('selects the card when the checkbox is clicked', async () => {
		render(CardTestWrapper, { selectable: true, showFloatingAction: true });
		await page.getByRole('checkbox').click();
		await expect.element(page.getByRole('group')).toHaveClass('selected');
	});

	it('reflects the selection on the checkbox', async () => {
		render(CardTestWrapper, { selectable: true, showFloatingAction: true });
		await page.getByRole('group').click();
		await expect.element(page.getByRole('checkbox')).toBeChecked();
	});
});

describe('invalid combinations', () => {
	it('throws when showFloatingAction is set on a card that is not selectable', async () => {
		await expect(render(CardTestWrapper, { showFloatingAction: true })).rejects.toThrow(
			'Floating action can only be shown if the card is selectable.'
		);
	});

	it('throws when a card that is not selectable is selected', async () => {
		await expect(render(CardTestWrapper, { selected: true })).rejects.toThrow(
			'A card cannot be selected if it is not selectable.'
		);
	});

	it('throws when a link card is selectable', async () => {
		await expect(render(Card, { as: 'a', href: '#', selectable: true })).rejects.toThrow(
			'A card cannot be both a link and selectable.'
		);
	});
});

describe('attributes', () => {
	it('forwards extra attributes to the card element', async () => {
		render(CardTestWrapper, { 'data-testid': 'my-card' });
		const el = page.getByTestId('my-card');
		await expect.element(el).toBeInTheDocument();
	});

	it('merges the given class with the generated ones', async () => {
		render(CardTestWrapper, { class: 'custom' });
		const el = page.getByRole('group');
		await expect.element(el).toHaveClass('custom');
	});
});
