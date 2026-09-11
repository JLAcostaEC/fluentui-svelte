import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { CardHeader } from '$lib/index.js';
import CardTestWrapper from './CardTestWrapper.svelte';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('rendering', () => {
	it('renders a div with the fs-card-header class', async () => {
		render(CardTestWrapper, { part: 'header' });
		const el = page.selector('div.fs-card-header');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders a string title', async () => {
		render(CardTestWrapper, { part: 'header', title: 'My title' });
		const el = page.getByText('My title');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders a snippet title', async () => {
		render(CardTestWrapper, { part: 'header', snippetTitle: true, id: 'my-card' });
		const el = page.getByTestId('snippet-title');
		await expect.element(el).toHaveTextContent('Snippet title');
	});

	it('renders a string image as an <img>', async () => {
		render(CardTestWrapper, { part: 'header', image: PIXEL });
		const el = page.selector('.fs-card-header img');
		await expect.element(el).toHaveAttribute('src', PIXEL);
	});

	it('renders the description below the title', async () => {
		render(CardTestWrapper, { part: 'header', description: 'A description' });
		const el = page.selector('.fs-card-header-content p.caption');
		await expect.element(el).toHaveTextContent('A description');
	});

	it('wraps the title and the description together', async () => {
		render(CardTestWrapper, { part: 'header', title: 'My title', description: 'A description' });
		const el = page.selector('.fs-card-header-content h4.body');
		await expect.element(el).toHaveTextContent('My title');
	});

	it('gives the string title the id the floating checkbox is labelled by', async () => {
		render(CardTestWrapper, { part: 'header', title: 'My title', description: 'A description', id: 'my-card' });
		const el = page.selector('.fs-card-header-content h4.body');
		await expect.element(el).toHaveAttribute('id', 'my-card-title');
	});

	it('renders the action', async () => {
		render(CardTestWrapper, { part: 'header', withAction: true });
		const el = page.getByTestId('snippet-action');
		await expect.element(el).toBeInTheDocument();
	});
});

describe('floating action', () => {
	it('reserves room for the floating checkbox', async () => {
		render(CardTestWrapper, { part: 'header', selectable: true, showFloatingAction: true });
		const el = page.selector('div.fs-card-header');
		await expect.element(el).toHaveClass('with-action');
	});

	it('does not reserve room when there is no floating checkbox', async () => {
		render(CardTestWrapper, { part: 'header' });
		const el = page.selector('div.fs-card-header');
		await expect.element(el).not.toHaveClass('with-action');
	});
});

describe('attributes', () => {
	it('forwards extra attributes to the header element', async () => {
		render(CardTestWrapper, { part: 'header' });
		const el = page.getByTestId('card-header');
		await expect.element(el).toHaveClass('fs-card-header');
	});
});

describe('invalid usage', () => {
	it('throws when used outside a Card', async () => {
		await expect(render(CardHeader, { title: 'My title' })).rejects.toThrow(
			'Card context is not available. Make sure this component is used within a Card.'
		);
	});

	it('throws when an action is used on a selectable card', async () => {
		await expect(render(CardTestWrapper, { part: 'header', selectable: true, withAction: true })).rejects.toThrow(
			'Action cannot be used with selectable cards.'
		);
	});
});
