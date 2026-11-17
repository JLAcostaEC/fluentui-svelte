<script lang="ts">
	import { getTeachingTipContext } from './teaching-tip-context.svelte.ts';
	import type { TeachingTipPreviewProps } from './types.ts';

	let { ref = $bindable(null), class: classes, children, ...attributes }: TeachingTipPreviewProps = $props();

	if (!getTeachingTipContext())
		throw new Error('TeachingTip context is not available. Make sure this component is used within a TeachingTip.');
</script>

<div {...attributes} bind:this={ref} class={['fs-teaching-tip-preview', classes]}>
	{@render children?.()}
</div>

<style>
	/* The preview spans the padding of the teaching tip, up to the edge it sits against, and follows its corners. */
	.fs-teaching-tip-preview {
		display: flex;
		flex-direction: column;
		margin-inline: -0.75rem;
		overflow: hidden;
		--fs-teaching-tip-radius: calc(var(--fs-control-overlay-border-radius) - 1px);
		&:first-of-type {
			margin-top: -0.75rem;
			margin-bottom: 0.75rem;
			border-radius: var(--fs-teaching-tip-radius) var(--fs-teaching-tip-radius) 0 0;
		}
		&:last-of-type {
			margin-top: 0.75rem;
			margin-bottom: -0.75rem;
			border-radius: 0 0 var(--fs-teaching-tip-radius) var(--fs-teaching-tip-radius);
		}
		& > :global(img),
		& > :global(video) {
			display: block;
			width: 100%;
			height: auto;
			object-fit: cover;
		}
	}
</style>
