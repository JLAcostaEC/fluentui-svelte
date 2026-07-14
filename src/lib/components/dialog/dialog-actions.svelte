<script lang="ts">
	import { getTabspotAttributes } from 'tabspot';
	import type { DialogActionsProps } from './types.ts';

	let { ref = $bindable(), position = 'end', fluid, children }: DialogActionsProps = $props();

	const tabspotAttributes = getTabspotAttributes({
		root: {}
	});
</script>

<div class="dialog-actions justify-{position}" class:fluid bind:this={ref}>
	{@render children?.()}
</div>

<style>
	.dialog-actions {
		grid-row: 3 / 3;
		display: flex;
		padding: 1.4rem 2rem;
		gap: 0.5rem;
		border-top: 1px solid var(--fs-card-stroke-default);
		background: var(--fs-solid-background-base);
		&.justify-start {
			justify-content: flex-start;
		}
		&.justify-center {
			justify-content: center;
		}
		&.justify-end {
			justify-content: flex-end;
		}
	}
</style>
