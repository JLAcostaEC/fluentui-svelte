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

	// Snippets compile to ($$anchor, ...args) so they report length 1, components to
	// ($$anchor, $$props) so they report 2. See https://github.com/sveltejs/svelte/issues/9774
	const isSnippet = (value: Snippet<[Args]> | Component<Args>): value is Snippet<[Args]> => value.length === 1;
</script>

{#if isSnippet(SoC)}
	{@render SoC(args)}
{:else}
	<SoC {...args} />
{/if}
