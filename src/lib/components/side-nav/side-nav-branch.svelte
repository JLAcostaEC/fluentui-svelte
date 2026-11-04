<script lang="ts">
	import ListViewItemBranch from '../list-view/list-view-item-branch.svelte';
	import SideNavList from './side-nav-list.svelte';
	import { getSideNavContext } from './side-nav.ts';
	import type { SideNavBranchProps } from './types.ts';

	let {
		ref = $bindable(null),
		wrapperRef = $bindable(null),
		expanded = $bindable(false),
		label,
		wrapperAttributes,
		icon,
		onclick,
		children,
		...attributes
	}: SideNavBranchProps = $props();

	const context = getSideNavContext();
</script>

{#snippet initial()}<span>{label.slice(0, 1)}</span>{/snippet}

<ListViewItemBranch
	{...attributes}
	{label}
	wrapperAttributes={{ class: `fs-side-nav-branch ${wrapperAttributes?.class ?? ''}`, ...wrapperAttributes }}
	icon={icon ?? (context?.state.compact ? initial : undefined)}
	bind:ref
	bind:wrapperRef
	bind:expanded
	onclick={(event) => {
		onclick?.(event);
		// A branch cannot open inside the rail, so the rail opens first.
		if (!event.defaultPrevented) context?.methods.setCollapsed(event, false);
	}}
>
	<SideNavList>
		{@render children?.()}
	</SideNavList>
</ListViewItemBranch>
