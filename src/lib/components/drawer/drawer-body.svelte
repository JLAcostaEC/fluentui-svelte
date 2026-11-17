<script lang="ts">
	import { getDrawerContext } from './drawer-context.svelte.ts';
	import type { DrawerBodyProps } from './types.ts';

	let { ref = $bindable(null), class: classes, children, ...attributes }: DrawerBodyProps = $props();

	if (!getDrawerContext())
		throw new Error('Drawer context is not available. Make sure this component is used within a Drawer.');
</script>

<div {...attributes} bind:this={ref} class={['fs-drawer-body', classes]}>
	{@render children?.()}
</div>

<style>
	/* Takes the free height and scrolls on its own; the header and the footer stay put. */
	.fs-drawer-body {
		flex: 1 1 auto;
		min-block-size: 0;
		padding: 0 1.5rem;
		overflow: auto;
		overscroll-behavior: contain;
		&:first-child {
			padding-block-start: 1.5rem;
		}
		&:last-child {
			padding-block-end: 1.5rem;
		}
	}
</style>
