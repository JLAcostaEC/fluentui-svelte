<script lang="ts" generics="Args extends Record<string, unknown>">
	import type { Component, Snippet } from 'svelte';

	let {
		SoC,
		args = {} as Args
	}: {
		/** A snippet or a component. Both receive `args`: the snippet as its single
		 * argument, the component as its props. */
		SoC: Snippet<[Args]> | Component<Args>;
		args?: Args;
	} = $props();

	// Snippets are arrow functions, compiled or from `createRawSnippet`, and arrows have no `prototype`.
	// Components are `function` declarations, also under HMR. The number of parameters does not tell them apart:
	// in production a snippet with a destructured parameter, like `{ shape }`, takes two.
	// See https://github.com/sveltejs/svelte/issues/9774
	const isSnippet = (value: Snippet<[Args]> | Component<Args>): value is Snippet<[Args]> => !('prototype' in value);
</script>

{#if isSnippet(SoC)}
	{@render SoC(args)}
{:else}
	<SoC {...args} />
{/if}
