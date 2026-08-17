<script lang="ts">
	import { DropdownSelect, DropdownSelectOption } from '$lib/index.js';

	type Option = { value: string; text: string; disabled?: boolean };

	let {
		options = [
			{ value: 'apple', text: 'Apple' },
			{ value: 'banana', text: 'Banana' },
			{ value: 'cherry', text: 'Cherry' }
		],
		value = $bindable(),
		multiple,
		hidePlaceholder,
		placeholder,
		wrapperProps
	}: {
		options?: Option[];
		value?: string | string[];
		multiple?: boolean;
		hidePlaceholder?: boolean;
		placeholder?: string;
		wrapperProps?: Record<string, unknown>;
	} = $props();
</script>

<DropdownSelect {multiple} {hidePlaceholder} {placeholder} {wrapperProps} {value}>
	{#each options as opt (opt.value)}
		<DropdownSelectOption value={opt.value} text={opt.text} disabled={opt.disabled}>
			{opt.text}
		</DropdownSelectOption>
	{/each}
</DropdownSelect>
