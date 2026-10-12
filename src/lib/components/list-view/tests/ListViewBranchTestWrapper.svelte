<script lang="ts">
	import FluentUISvelte from '$lib/providers/fluentui-svelte/fluentui-svelte.svelte';
	import ListView from '../list-view.svelte';
	import ListViewItem from '../list-view-item.svelte';
	import ListViewItemBranch from '../list-view-item-branch.svelte';
	import type { ListViewProps, ListViewItemBranchProps } from '../types.ts';

	let {
		listProps = {},
		branchProps = {},
		expanded = $bindable(false),
		nestedExpanded = $bindable(false),
		includeBeforeLeaf = true,
		lateBranch = false,
		onSelectionChange,
		onChildSelectionChange,
		onGrandchildSelectionChange
	}: {
		listProps?: Partial<ListViewProps<'ul'>>;
		branchProps?: Partial<Omit<ListViewItemBranchProps, 'children' | 'expanded' | 'ref'>>;
		expanded?: boolean;
		nestedExpanded?: boolean;
		includeBeforeLeaf?: boolean;
		lateBranch?: boolean;
		onSelectionChange?: (event: Event, selected: string[]) => void;
		onChildSelectionChange?: (event: Event, selected: string[]) => void;
		onGrandchildSelectionChange?: (event: Event, selected: string[]) => void;
	} = $props();
	let mounted = $state(false);
	let selected = $state<string[]>([]);
	let childSelected = $state<string[]>([]);
	let grandchildSelected = $state<string[]>([]);
	let triggerRef = $state<HTMLButtonElement | null>();
</script>

<FluentUISvelte>
	<button onclick={() => (mounted = true)}>Before list</button>
	<ListView aria-label="Navigation" {...listProps} bind:selectedItems={selected} {onSelectionChange}>
		{#if includeBeforeLeaf}<ListViewItem as="button" value="before">Before leaf</ListViewItem>{/if}
		{#if !lateBranch || mounted}
			<ListViewItemBranch label="Projects" {...branchProps} bind:expanded bind:ref={triggerRef}>
				<ListView
					role="list"
					selectionMode="single"
					aria-label="Projects links"
					bind:selectedItems={childSelected}
					onSelectionChange={onChildSelectionChange}
				>
					<ListViewItem as="a" href="#inbox" value="inbox" onclick={(event) => event.preventDefault()}
						>Inbox</ListViewItem
					>
					<ListViewItemBranch label="Settings" bind:expanded={nestedExpanded}>
						<ListView
							role="list"
							selectionMode="single"
							aria-label="Settings links"
							bind:selectedItems={grandchildSelected}
							onSelectionChange={onGrandchildSelectionChange}
						>
							<ListViewItem as="a" href="#users" value="users" onclick={(event) => event.preventDefault()}
								>Users</ListViewItem
							>
						</ListView>
					</ListViewItemBranch>
				</ListView>
			</ListViewItemBranch>
		{/if}
		<ListViewItem as="button" value="after">After leaf</ListViewItem>
	</ListView>
	<button>After list</button>
	<output aria-label="Selection">{selected.join(',')}</output>
	<output aria-label="Child selection">{childSelected.join(',')}</output>
	<output aria-label="Grandchild selection">{grandchildSelected.join(',')}</output>
	<output aria-label="Expanded">{String(expanded)}</output>
	<output aria-label="Trigger tag">{triggerRef?.tagName}</output>
</FluentUISvelte>
