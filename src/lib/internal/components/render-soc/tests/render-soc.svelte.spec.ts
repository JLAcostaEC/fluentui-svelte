import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import RenderSoCTestWrapper from './RenderSoCTestWrapper.svelte';

// RenderSoC tells a snippet from a component by arity: Svelte compiles snippets to
// ($$anchor, ...args) and components to ($$anchor, $$props). That is an implementation
// detail of the compiler, so these tests pin it — if a Svelte upgrade changes the shape,
// they fail here instead of silently rendering the wrong branch.
describe('discriminating a snippet from a component', () => {
	it('renders a snippet, handing args to it as its single argument', async () => {
		render(RenderSoCTestWrapper, { as: 'snippet' });

		const snippet = page.getByTestId('snippet');
		await expect.element(snippet).toBeInTheDocument();
		await expect.element(snippet).toHaveClass('from-args');
	});

	it('renders a component, spreading args as its props', async () => {
		render(RenderSoCTestWrapper, { as: 'component' });

		const component = page.getByTestId('component');
		await expect.element(component).toBeInTheDocument();
		await expect.element(component).toHaveClass('from-args');
	});

	it('renders a snippet that takes no arguments, defaulting args to an empty object', async () => {
		render(RenderSoCTestWrapper, { as: 'snippet-no-args' });

		await expect.element(page.getByTestId('bare')).toBeInTheDocument();
	});
});
