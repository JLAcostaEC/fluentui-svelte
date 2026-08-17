<script lang="ts">
	import { AutoSuggestBox, AutoSuggestBoxOption } from '$lib/index.js';

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
		selectOnFocus,
		placeholder
	}: {
		options?: Option[];
		value?: string;
		open?: boolean;
		multiselect?: boolean;
		selectOnFocus?: boolean;
		placeholder?: string;
	} = $props();
</script>

<AutoSuggestBox bind:value bind:open {multiselect} {selectOnFocus} {placeholder}>
	{#each options as opt, i (opt.value)}
		<AutoSuggestBoxOption value={opt.value} text={opt.text} index={i} disabled={opt.disabled}>
			{opt.text}
		</AutoSuggestBoxOption>
	{/each}
</AutoSuggestBox>
