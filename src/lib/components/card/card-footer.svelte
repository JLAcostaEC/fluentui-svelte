<script lang="ts">
	import type { CardFooterProps } from './types.ts';
	import { RenderSoC } from '$internal';
	import { getCardContext } from './card-context.svelte.ts';

	let { ref = $bindable(), class: classes, action }: CardFooterProps = $props();

	const context = getCardContext();

	if (!context) throw new Error('Card context is not available. Make sure this component is used within a Card.');

	const { config, state } = context;

	const { showFloatingAction, selectable } = config;

	$effect.pre(() => {
		if (action && selectable) throw new Error('Action cannot be used with selectable cards.');
	});
</script>

<div bind:this={ref} class={['fs-card-footer', showFloatingAction && 'with-action', classes]}>
	{#if action}
		<RenderSoC SoC={action} />
	{/if}
</div>

<style>
	.fs-card-footer {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		justify-content: space-between;
	}
</style>
