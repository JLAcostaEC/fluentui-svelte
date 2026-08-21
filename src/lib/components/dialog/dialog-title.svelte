<script lang="ts" generics="T extends DialogTitleTag">
	import { PREFIX } from '$constants';
	import { getDialogContext } from './dialog.svelte.ts';
	import type { DialogTitleProps, DialogTitleTag } from './types.ts';

	let { as = 'h3' as T, ref = $bindable(), children }: DialogTitleProps<T> = $props();

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}dialog-title-${FALLBACK_ID}`;

	const context = getDialogContext();

	$effect.pre(() => {
		if (!context) return;

		context.state.titleId = ID;

		return () => {
			context.state.titleId = undefined;
		};
	});
</script>

<svelte:element this={as} id={ID} class="dialog-title" bind:this={ref}>
	{@render children?.()}
</svelte:element>

<style>
	.dialog-title {
		padding: 1.4rem 2rem 0 2rem;
		grid-row: 1 / 1;
	}
</style>
