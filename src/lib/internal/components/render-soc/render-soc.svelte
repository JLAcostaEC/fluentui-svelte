<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" generics="T extends Snippet<unknown[]> | Component<any>">
	import type { Component, Snippet } from 'svelte';

	// Read more about this here: https://github.com/sveltejs/svelte/issues/9774#issuecomment-2266700153
	const isSnippet = <T extends unknown[]>(value: Snippet<T> | Component): value is Snippet<T> => value.length === 1;

	const isComponent = <T extends Record<string, any>>(value: Component<T> | Snippet): value is Component<T> =>
		value.length === 2;

	type SOCProps<G> =
		G extends Snippet<infer A> ? { SoC: T; args: A } : G extends Component<infer P> ? { SoC: T } & P : never;

	let { SoC, args, ...props }: SOCProps<T> = $props();
</script>

{#if SoC}
	{#if isSnippet(SoC)}
		{#if args && Array.isArray(args)}
			{/* @ts-expect-error - [any[]] no assignable to never */ null}
			{@render SoC(args)}
		{:else}
			{/* @ts-expect-error - [] is not assignable to never */ null}
			{@render SoC()}
		{/if}
	{:else if isComponent(SoC)}
		<SoC {...props} />
	{/if}
{/if}
