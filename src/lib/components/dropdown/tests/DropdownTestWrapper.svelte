<script lang="ts">
	import { Dropdown, DropdownOption, FluentUISvelte } from '#lib/index.js';

	type Option = { value: string; text: string; disabled?: boolean };

	let {
		options = [
			{ value: 'apple', text: 'Apple' },
			{ value: 'banana', text: 'Banana' },
			{ value: 'cherry', text: 'Cherry' }
		],
		value = $bindable(),
		multiple,
		disabled,
		placeholder
	}: {
		options?: Option[];
		value?: string | string[];
		multiple?: boolean;
		disabled?: boolean;
		placeholder?: string;
	} = $props();
</script>

<!-- The provider runs Tabspot, which moves the cursor through the options. -->
<FluentUISvelte>
	{#if multiple}
		<Dropdown multiple value={value as string[]} {disabled} {placeholder}>
			{#each options as opt (opt.value)}
				<DropdownOption value={opt.value} text={opt.text} disabled={opt.disabled} />
			{/each}
		</Dropdown>
	{:else}
		<Dropdown value={value as string} {disabled} {placeholder}>
			{#each options as opt (opt.value)}
				<DropdownOption value={opt.value} text={opt.text} disabled={opt.disabled} />
			{/each}
		</Dropdown>
	{/if}
</FluentUISvelte>
