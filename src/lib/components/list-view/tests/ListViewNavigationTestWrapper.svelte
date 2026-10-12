<script lang="ts">
	import FluentUISvelte from '$lib/providers/fluentui-svelte/fluentui-svelte.svelte';
	import ListView from '../list-view.svelte';
	import ListViewItem from '../list-view-item.svelte';
	import type { NavigationMode, SelectionMode } from '../types.ts';

	let {
		navigationMode = 'items',
		selectionMode = 'none',
		disableTabspot = false,
		lateMount = false,
		lateSublist = false,
		hideNested = false,
		branchAs = 'li',
		onParentAction,
		onParentFocus,
		onParentSelection,
		onChildSelection,
		onGrandchildSelection
	}: {
		navigationMode?: NavigationMode;
		selectionMode?: SelectionMode;
		disableTabspot?: boolean;
		lateMount?: boolean;
		lateSublist?: boolean;
		hideNested?: boolean;
		branchAs?: 'li' | 'a' | 'button';
		onParentAction?: (event: MouseEvent, value: string) => void;
		onParentFocus?: (event: Event, value: string) => void;
		onParentSelection?: (event: Event, selected: string[]) => void;
		onChildSelection?: (event: Event, selected: string[]) => void;
		onGrandchildSelection?: (event: Event, selected: string[]) => void;
	} = $props();

	let mounted = $state(false);
	let nestedMounted = $state(false);
	const listRole = $derived(selectionMode === 'none' ? undefined : 'list');
	let parentSelected = $state<string[]>([]);
	let childSelected = $state<string[]>([]);
	let grandchildSelected = $state<string[]>([]);
</script>

<FluentUISvelte>
	<button onclick={() => (mounted = true)}>Before lists</button>
	{#if !lateMount || mounted}
		<ListView
			role={listRole}
			aria-label="Navigation"
			{navigationMode}
			{selectionMode}
			{disableTabspot}
			bind:selectedItems={parentSelected}
			onSelectionChange={onParentSelection}
		>
			<ListViewItem
				as={branchAs}
				value="projects"
				onAction={selectionMode === 'none' ? undefined : onParentAction}
				onfocus={onParentFocus}
			>
				{#if selectionMode === 'none'}
					<button
						type="button"
						aria-expanded={lateSublist ? nestedMounted : undefined}
						onclick={(event) => {
							nestedMounted = true;
							onParentAction?.(event, 'projects');
						}}>Projects</button
					>
				{:else}
					<span>Projects</span>
				{/if}
				{#if !lateSublist || nestedMounted}
					<ListView
						role={listRole}
						aria-label="Projects"
						{selectionMode}
						hidden={hideNested}
						bind:selectedItems={childSelected}
						onSelectionChange={onChildSelection}
					>
						<ListViewItem as="a" href="#inbox" value="inbox" onclick={(event) => event.preventDefault()}
							>Inbox</ListViewItem
						>
						<ListViewItem as="a" href="#archive" value="archive" disabled onclick={(event) => event.preventDefault()}
							>Archive</ListViewItem
						>
						<ListViewItem value="settings">
							{#if selectionMode === 'none'}
								<button type="button">Settings</button>
							{:else}
								<span>Settings</span>
							{/if}
							<ListView
								role={listRole}
								aria-label="Settings"
								{selectionMode}
								bind:selectedItems={grandchildSelected}
								onSelectionChange={onGrandchildSelection}
							>
								<ListViewItem as="a" href="#users" value="users" onclick={(event) => event.preventDefault()}
									>Users</ListViewItem
								>
								<ListViewItem as="a" href="#permissions" value="permissions" onclick={(event) => event.preventDefault()}
									>Permissions</ListViewItem
								>
							</ListView>
						</ListViewItem>
					</ListView>
				{/if}
			</ListViewItem>
			<ListViewItem as="button" value="reports">Reports</ListViewItem>
		</ListView>
	{/if}
	<button>After lists</button>
	<output aria-label="Parent selection">{parentSelected.join(',')}</output>
	<output aria-label="Child selection">{childSelected.join(',')}</output>
	<output aria-label="Grandchild selection">{grandchildSelected.join(',')}</output>
</FluentUISvelte>
