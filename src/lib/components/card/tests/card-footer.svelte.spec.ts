import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { CardFooter } from '$lib/index.js';
import CardTestWrapper from './CardTestWrapper.svelte';

describe('rendering', () => {
	it('renders a div with the fs-card-footer class', async () => {
		render(CardTestWrapper, { part: 'footer' });
		const el = page.selector('div.fs-card-footer');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders the action', async () => {
		render(CardTestWrapper, { part: 'footer', withAction: true });
		const el = page.getByTestId('snippet-action');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders nothing when there is no action', async () => {
		render(CardTestWrapper, { part: 'footer' });
		const el = page.selector('div.fs-card-footer');
		await expect.element(el).toBeEmptyDOMElement();
	});
});

describe('attributes', () => {
	it('forwards extra attributes to the footer element', async () => {
		render(CardTestWrapper, { part: 'footer' });
		const el = page.getByTestId('card-footer');
		await expect.element(el).toHaveClass('fs-card-footer');
	});
});

describe('invalid usage', () => {
	it('throws when used outside a Card', async () => {
		await expect(render(CardFooter)).rejects.toThrow(
			'Card context is not available. Make sure this component is used within a Card.'
		);
	});

	it('throws when an action is used on a selectable card', async () => {
		await expect(render(CardTestWrapper, { part: 'footer', selectable: true, withAction: true })).rejects.toThrow(
			'Action cannot be used with selectable cards.'
		);
	});
});
