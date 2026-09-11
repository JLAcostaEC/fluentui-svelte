import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { CardPreview } from '$lib/index.js';
import CardTestWrapper from './CardTestWrapper.svelte';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('rendering', () => {
	it('renders a div with the fs-card-preview class', async () => {
		render(CardTestWrapper, { part: 'preview' });
		const el = page.selector('div.fs-card-preview');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders its children', async () => {
		render(CardTestWrapper, { part: 'preview' });
		const el = page.getByAltText('Preview');
		await expect.element(el).toBeInTheDocument();
	});

	it('renders the logo from logoSrc', async () => {
		render(CardTestWrapper, { part: 'preview', logoSrc: PIXEL });
		const el = page.selector('img.fs-card-preview-logo');
		await expect.element(el).toHaveAttribute('src', PIXEL);
	});

	it('renders the logo as decorative by default', async () => {
		render(CardTestWrapper, { part: 'preview' });
		const el = page.selector('img.fs-card-preview-logo');
		await expect.element(el).toHaveAttribute('alt', '');
	});

	it('labels the logo from logoAlt', async () => {
		render(CardTestWrapper, { part: 'preview', logoAlt: 'FluentUI Svelte' });
		const el = page.selector('img.fs-card-preview-logo');
		await expect.element(el).toHaveAttribute('alt', 'FluentUI Svelte');
	});
});

describe('floating action', () => {
	it('reserves room for the floating checkbox', async () => {
		render(CardTestWrapper, { part: 'preview', selectable: true, showFloatingAction: true });
		const el = page.selector('div.fs-card-preview');
		await expect.element(el).toHaveClass('with-action');
	});

	it('does not reserve room when there is no floating checkbox', async () => {
		render(CardTestWrapper, { part: 'preview' });
		const el = page.selector('div.fs-card-preview');
		await expect.element(el).not.toHaveClass('with-action');
	});
});

describe('attributes', () => {
	it('forwards extra attributes to the preview element', async () => {
		render(CardTestWrapper, { part: 'preview' });
		const el = page.getByTestId('card-preview');
		await expect.element(el).toHaveClass('fs-card-preview');
	});
});

describe('invalid usage', () => {
	it('throws when used outside a Card', async () => {
		await expect(render(CardPreview, { logoSrc: PIXEL })).rejects.toThrow(
			'Card context is not available. Make sure this component is used within a Card.'
		);
	});
});
