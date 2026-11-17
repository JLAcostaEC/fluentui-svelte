<script lang="ts">
	import { getDrawerContext } from './drawer-context.svelte.ts';
	import type { DrawerFooterProps } from './types.ts';

	let { ref = $bindable(null), class: classes, children, ...attributes }: DrawerFooterProps = $props();

	if (!getDrawerContext())
		throw new Error('Drawer context is not available. Make sure this component is used within a Drawer.');
</script>

<footer {...attributes} bind:this={ref} class={['fs-drawer-footer', classes]}>
	{@render children?.()}
</footer>

<style>
	.fs-drawer-footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem;
	}
</style>
