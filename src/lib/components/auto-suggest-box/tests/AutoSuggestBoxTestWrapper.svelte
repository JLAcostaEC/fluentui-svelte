<script lang="ts">
	import { AutoSuggestBox, AutoSuggestBoxOption, FluentUISvelte } from '$lib/index.js';

	type Option = { value: string; text: string; disabled?: boolean };

	let {
		options = [
			{ value: 'apple', text: 'Apple' },
			{ value: 'banana', text: 'Banana' },
			{ value: 'cherry', text: 'Cherry' }
		],
		value = $bindable(''),
		open = $bindable(false),
		multiselect,
		showTextualMultiselect,
		selectedOptions = $bindable([]),
		selectOnFocus,
		placeholder,
		querySubmitted,
		suggestionChosen
	}: {
		options?: Option[];
		value?: string;
		open?: boolean;
		multiselect?: boolean;
		showTextualMultiselect?: boolean;
		selectedOptions?: { id: string; value: string }[];
		selectOnFocus?: boolean;
		placeholder?: string;
		querySubmitted?: (e: Event, query: string) => void;
		suggestionChosen?: (e: Event, selection: string) => void;
	} = $props();
</script>

<FluentUISvelte>
	<AutoSuggestBox
		bind:value
		bind:open
		bind:selectedOptions
		{multiselect}
		{showTextualMultiselect}
		{selectOnFocus}
		{placeholder}
		{querySubmitted}
		{suggestionChosen}
	>
		{#each options as opt, i (opt.value)}
			<AutoSuggestBoxOption id={opt.value} value={opt.value} text={opt.text} index={i} disabled={opt.disabled}>
				{opt.text}
			</AutoSuggestBoxOption>
		{/each}
	</AutoSuggestBox>
</FluentUISvelte>
