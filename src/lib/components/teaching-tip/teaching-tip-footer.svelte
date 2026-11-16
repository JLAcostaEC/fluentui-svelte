<script lang="ts">
	import { RenderSoC } from '#internal';
	import { getTeachingTipContext } from './teaching-tip-context.svelte.ts';
	import type { TeachingTipFooterProps } from './types.ts';

	let { ref = $bindable(null), class: classes, action, ...attributes }: TeachingTipFooterProps = $props();

	if (!getTeachingTipContext())
		throw new Error('TeachingTip context is not available. Make sure this component is used within a TeachingTip.');
</script>

<div {...attributes} bind:this={ref} class={['fs-teaching-tip-footer', classes]}>
	{#if action}
		<RenderSoC SoC={action} />
	{/if}
</div>

<style>
	/* Each action takes half of the width, aligned to the end. */
	.fs-teaching-tip-footer {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: calc(50% - 0.25rem);
		justify-content: end;
		gap: 0.5rem;
		margin-top: 0.5rem;
		& > :global(*) {
			justify-content: center;
			width: 100%;
		}
	}
</style>
