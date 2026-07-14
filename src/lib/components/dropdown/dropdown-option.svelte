<script lang="ts">
	import { onMount } from 'svelte';
	import { ListViewItem } from '$lib/index.js';
	import { PREFIX } from '$constants';
	import { getDropdownContext } from './dropdown-context.ts';
	import type { DropdownOptionProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}-dropdown-option-${FALLBACK_ID}`;

	let { value, text, disabled, id = ID, ref = $bindable(), children }: DropdownOptionProps = $props();

	const context = getDropdownContext();

	if (!context) throw new Error('DropdownOption must be used within a Dropdown');

	// Report the option's label so the trigger can show text instead of the raw value.
	onMount(() => {
		if (value == null) return;
		const label = text ?? (ref?.textContent?.trim() || String(value));
		context.methods?.registerOption(String(value), label);
	});
</script>

<ListViewItem role="option" {value} {id} bind:ref {disabled}>
	{#if children}
		{@render children?.()}
	{:else}
		{text}
	{/if}
</ListViewItem>
