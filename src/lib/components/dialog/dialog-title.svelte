<script lang="ts" generics="T extends DialogTitleTag">
	import type { DialogTitleProps, DialogTitleTag } from './types.ts';

	let { as = 'h3' as T, ref = $bindable(), children }: DialogTitleProps<T> = $props();
</script>

<svelte:element this={as} class="dialog-title" bind:this={ref}>
	{@render children?.()}
</svelte:element>

<style>
	.dialog-title {
		padding: 1.4rem 2rem 0 2rem;
		grid-row: 1 / 1;
	}
</style>
