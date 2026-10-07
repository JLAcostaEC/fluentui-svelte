<script lang="ts">
	import type { DialogContentProps } from './types.ts';

	let { ref = $bindable(), class: classes, children, ...attributes }: DialogContentProps = $props();
</script>

<div class={['dialog-content', classes]} bind:this={ref} {...attributes}>
	{@render children?.()}
</div>

<style>
	.dialog-content {
		grid-row: 2 / 2;
		padding: 1.4rem 2rem 2rem 2rem;
		overflow-y: auto;
	}
</style>
