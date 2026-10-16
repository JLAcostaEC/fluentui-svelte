<script lang="ts">
	import { DropdownSelect, DropdownSelectOption } from '$lib/index.js';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	type Option = { value: string; text: string; disabled?: boolean };

	let {
		options = [
			{ value: 'apple', text: 'Apple' },
			{ value: 'banana', text: 'Banana' },
			{ value: 'cherry', text: 'Cherry' }
		],
		multiple,
		value = $bindable(multiple ? [] : ''),
		hidePlaceholder,
		placeholder,
		wrapperAttributes,
		attributes
	}: {
		options?: Option[];
		value?: string | string[];
		multiple?: boolean;
		hidePlaceholder?: boolean;
		placeholder?: string;
		wrapperAttributes?: Record<string, unknown>;
		attributes?: HTMLSelectAttributes;
	} = $props();
</script>

<DropdownSelect {...attributes} {multiple} {hidePlaceholder} {placeholder} {wrapperAttributes} bind:value>
	{#each options as opt (opt.value)}
		<DropdownSelectOption value={opt.value} text={opt.text} disabled={opt.disabled}>
			{opt.text}
		</DropdownSelectOption>
	{/each}
</DropdownSelect>

<output data-testid="selected-value">{JSON.stringify(value)}</output>
