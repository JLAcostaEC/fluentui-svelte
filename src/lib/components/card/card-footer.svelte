<script lang="ts">
	import type { CardFooterProps } from './types.ts';
	import { RenderSoC } from '$internal';
	import { getCardContext } from './card-context.svelte.ts';

	let { ref = $bindable(), class: classes, action, ...attributes }: CardFooterProps = $props();

	const context = getCardContext();

	if (!context) throw new Error('Card context is not available. Make sure this component is used within a Card.');

	const { config } = context;

	const showFloatingAction = $derived(config.showFloatingAction);
	const selectable = $derived(config.selectable);

	// Rendered through `_action`, so the invariant is enforced during SSR and on every prop update.
	const _action = $derived.by(() => {
		if (action && selectable) throw new Error('Action cannot be used with selectable cards.');
		return action;
	});
</script>

<div bind:this={ref} class={['fs-card-footer', showFloatingAction && 'with-action', classes]} {...attributes}>
	{#if _action}
		<RenderSoC SoC={_action} />
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
