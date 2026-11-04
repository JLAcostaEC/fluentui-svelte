<script lang="ts">
	import { getTabspotAttributes, setTabspotAttributes, unsetTabspotSection } from 'tabspot';
	import type { Attachment } from 'svelte/attachments';
	import { getMenuContext } from './menu.svelte.ts';

	let { children } = $props();

	const context = getMenuContext();

	let isSubMenu = $derived(context?.config.isSubMenu);

	// The list mounts when the menu opens, after Tabspot has scanned the page, so the root menu
	// registers itself to get arrow key navigation. A submenu is a grouper inside it instead.
	const registerRoot: Attachment<HTMLElement> = (element) => {
		setTabspotAttributes({ element, config: { root: {} }, merge: true });
		return () => unsetTabspotSection(element, 'root');
	};
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
	{@attach isSubMenu ? undefined : registerRoot}
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
