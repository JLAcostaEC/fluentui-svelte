<script lang="ts">
	import { getTabspotAttributes } from 'tabspot';
	import { getMenuContext } from './menu.svelte.ts';

	let { children } = $props();

	const context = getMenuContext();

	let isSubMenu = $derived(context?.config.isSubMenu);
</script>

<div
	class="fs-menu-list"
	role="menu"
	{...getTabspotAttributes({
		mover: { axis: 'vertical' },
		grouper: isSubMenu
			? {
					enterDirection: 'right',
					exitDirection: 'left'
				}
			: undefined
	})}
>
	{@render children()}
</div>

<style>
	.fs-menu-list {
		display: flex;
		flex-direction: column;
		padding: 0;
		margin: 0;
		list-style: none;
		padding: 0.25rem;
		flex-grow: 1;
	}
</style>
