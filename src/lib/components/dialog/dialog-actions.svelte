<script lang="ts">
	import { getTabspotAttributes } from 'tabspot';
	import type { DialogActionsProps } from './types.ts';

	let { ref = $bindable(), position = 'end', fluid, children }: DialogActionsProps = $props();

	// The bar is one tab stop holding a row of buttons: without the mover the root would
	// take the tab stop and then offer no way to reach the rest of the buttons.
	const tabspotAttributes = getTabspotAttributes({
		root: {},
		mover: { axis: 'horizontal' }
	});
</script>

<div class={['dialog-actions', `justify-${position}`, { fluid }]} bind:this={ref} {...tabspotAttributes}>
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
