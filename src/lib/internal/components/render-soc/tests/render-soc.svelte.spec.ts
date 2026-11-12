import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import RenderSoCTestWrapper from './RenderSoCTestWrapper.svelte';

// RenderSoC tells a snippet from a component by its `prototype`: Svelte compiles snippets to
// arrow functions and components to `function` declarations. That is an implementation
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

	// The tests run the dev build, where every snippet takes one parameter. In production, a snippet
	// with a destructured parameter takes two, which once rendered it as a component.
	it('renders a snippet that takes two parameters, as production compiles a destructured one', async () => {
		render(RenderSoCTestWrapper, { as: 'snippet-two-params' });

		await expect.element(page.getByTestId('two-params')).toHaveClass('from-args');
	});
});
