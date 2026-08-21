<script lang="ts">
	// A copy of the virtualized example in docs.svx, down to the UUID ids and the
	// every-tenth-disabled rule, so the tests exercise what the docs site runs.
	import SvelteVirtualList from '@humanspeak/svelte-virtual-list';
	import { AutoSuggestBox, AutoSuggestBoxOption, FluentUISvelte } from '$lib/index.js';
	import { fake } from '$constants';

	let {
		suggestionChosen,
		querySubmitted
	}: {
		suggestionChosen?: (e: Event, selection: string) => void;
		querySubmitted?: (e: Event, query: string) => void;
	} = $props();

	const people = fake.map((person, i) => ({ ...person, disabled: i % 10 === 0 }));

	let items = $state(people);
	let listRef = $state<ReturnType<typeof SvelteVirtualList> | null>(null);
	let selection = $state<{ id: string; value: string }[]>([]);
</script>

<FluentUISvelte>
	<AutoSuggestBox
		multiselect
		showTextualMultiselect
		bind:selectedOptions={selection}
		placeholder="Type a name..."
		virtualizer={{
			size: items?.length,
			scrollToTop: () => listRef!.scroll({ index: 0, align: 'top', smoothScroll: false }),
			scrollToBottom: () => listRef!.scroll({ index: items.length - 1, align: 'bottom', smoothScroll: false }),
			scrollToIndex: (index: number) => listRef!.scroll({ index, align: 'auto', smoothScroll: false })
		}}
		textChanged={(e, val) => {
			items = people.filter((item) => item.name.toLowerCase().includes(val.toLowerCase()));
		}}
		{suggestionChosen}
		{querySubmitted}
	>
		<SvelteVirtualList {items} bind:this={listRef as any} defaultEstimatedItemHeight={30}>
			{#snippet renderItem(item: { id: string; name: string; disabled: boolean }, index: number)}
				<AutoSuggestBoxOption {index} id={item.id} value={item.name} text={item.name} disabled={item.disabled}>
					{item.name}
				</AutoSuggestBoxOption>
			{/snippet}
		</SvelteVirtualList>
	</AutoSuggestBox>
</FluentUISvelte>
