<script lang="ts">
	import FluentUISvelte from '$lib/providers/fluentui-svelte/fluentui-svelte.svelte';
	import ListView from '../list-view.svelte';
	import ListViewItem from '../list-view-item.svelte';
	let {
		onAction,
		onSecondaryAction,
		onSelectionChange,
		disableTabspot = false,
		listAs = 'ul'
	}: {
		onAction?: (event: MouseEvent, value: string) => void;
		onSecondaryAction?: (event: MouseEvent) => void;
		onSelectionChange?: (event: Event, selected: string[]) => void;
		disableTabspot?: boolean;
		listAs?: 'ul' | 'div';
	} = $props();
	let selected = $state<string[]>([]);
</script>

<FluentUISvelte>
	<button>Before grid</button>
	<ListView
		as={listAs}
		aria-label="Cards"
		navigationMode="composite"
		selectionMode="multiselect"
		{disableTabspot}
		bind:selectedItems={selected}
		{onSelectionChange}
	>
		<ListViewItem
			as={listAs === 'div' ? 'div' : 'li'}
			value="first"
			checkmark={{ 'aria-label': 'Select first' }}
			{onAction}
		>
			<span>First card</span>
			<button hidden>Hidden action</button>
			<span aria-hidden="true"><button tabindex={-1}>Unavailable action</button></span>
			<span inert><button>Inert action</button></span>
			<button onclick={onSecondaryAction}>Edit first</button>
			<button onclick={onSecondaryAction}>Delete first</button>
		</ListViewItem>
		<ListViewItem as={listAs === 'div' ? 'div' : 'li'} value="disabled" disabled>Disabled card</ListViewItem>
		<ListViewItem as={listAs === 'div' ? 'div' : 'li'} value="second" {onAction}>Second card</ListViewItem>
	</ListView>
	<button>After grid</button>
	<output aria-label="Grid selection">{selected.join(',')}</output>
</FluentUISvelte>
