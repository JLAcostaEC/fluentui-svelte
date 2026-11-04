<script lang="ts">
	import type { Snippet } from 'svelte';
	import ListView from '../list-view/list-view.svelte';
	import { getSideNavContext } from './side-nav.ts';

	let { children }: { children?: Snippet } = $props();

	const context = getSideNavContext();

	// Escape belongs to the enclosing panel: ListView keeps its other navigation keys.
	const MANAGED_KEYS = { Home: true, End: true, PageUp: true, PageDown: true };

	// Outside a SideNav, a branch keeps the selection of its own list.
	let ownSelectedItems = $state<string[]>([]);
</script>

<ListView
	role="list"
	selectionMode="none"
	navigationMode="items"
	manageSpecialKeys={MANAGED_KEYS}
	{...context?.config.listViewProps}
	bind:selectedItems={
		() => context?.state.selectedItems ?? ownSelectedItems,
		(value) => {
			if (context) context.state.selectedItems = value;
			else ownSelectedItems = value;
		}
	}
>
	{@render children?.()}
</ListView>
