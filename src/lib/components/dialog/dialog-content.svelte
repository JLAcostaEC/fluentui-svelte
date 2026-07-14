<script lang="ts">
	import type { DialogContentProps } from './types.ts';

	let { children }: DialogContentProps = $props();
</script>

<div class="dialog-content">
	{@render children?.()}
</div>

<style>
	.dialog-content {
		grid-row: 2 / 2;
		padding: 1.4rem 2rem 2rem 2rem;
		overflow-y: auto;
	}
</style>
