<script lang="ts">
	import SvelteVirtualList from '@humanspeak/svelte-virtual-list';
	import { AutoSuggestBox, AutoSuggestBoxOption, FluentUISvelte } from '$lib/index.js';

	let {
		count = 60,
		disabledEvery = 0,
		value = $bindable(''),
		open = $bindable(false),
		selectOnFocus,
		multiselect,
		selectedOptions = $bindable([]),
		suggestionChosen,
		querySubmitted
	}: {
		count?: number;
		/** Disable every Nth option, the way the docs example does. */
		disabledEvery?: number;
		value?: string;
		open?: boolean;
		selectOnFocus?: boolean;
		multiselect?: boolean;
		selectedOptions?: { id: string; value: string }[];
		suggestionChosen?: (e: Event, selection: string) => void;
		querySubmitted?: (e: Event, query: string) => void;
	} = $props();

	const all = $derived(Array.from({ length: count }, (_, i) => ({ id: `item-${i}`, name: `Item ${i}`, index: i })));

	// The consumer owns the data: typing filters it, exactly like the docs example.
	let items = $derived(all);

	let listRef = $state<ReturnType<typeof SvelteVirtualList> | null>(null);
</script>

<FluentUISvelte>
	<AutoSuggestBox
		bind:value
		bind:open
		bind:selectedOptions
		{selectOnFocus}
		{multiselect}
		{suggestionChosen}
		{querySubmitted}
		placeholder="Type an item..."
		virtualizer={{
			size: items.length,
			scrollToTop: () => listRef!.scroll({ index: 0, align: 'top', smoothScroll: false }),
			scrollToBottom: () => listRef!.scroll({ index: items.length - 1, align: 'bottom', smoothScroll: false }),
			scrollToIndex: (index: number) => listRef!.scroll({ index, align: 'auto', smoothScroll: false })
		}}
		textChanged={(e, val) => {
			items = all.filter((item) => item.name.toLowerCase().includes(val.toLowerCase()));
		}}
	>
		<SvelteVirtualList {items} bind:this={listRef as any} defaultEstimatedItemHeight={30}>
			{#snippet renderItem(item: { id: string; name: string; index: number }, index: number)}
				<AutoSuggestBoxOption
					{index}
					id={item.id}
					value={item.name}
					text={item.name}
					disabled={disabledEvery > 0 && index % disabledEvery === 0}
				>
					{item.name}
				</AutoSuggestBoxOption>
			{/snippet}
		</SvelteVirtualList>
	</AutoSuggestBox>
</FluentUISvelte>
