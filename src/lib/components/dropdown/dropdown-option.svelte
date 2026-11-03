<script lang="ts">
	import { onMount } from 'svelte';
	import { ListViewItem } from '#lib/index.js';
	import { PREFIX } from '#constants';
	import { getDropdownContext } from './dropdown-context.ts';
	import type { DropdownOptionProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}-dropdown-option-${FALLBACK_ID}`;

	let { value, text, disabled, id = ID, ref = $bindable(null), children }: DropdownOptionProps = $props();

	const context = getDropdownContext();

	if (!context) throw new Error('DropdownOption must be used within a Dropdown');

	/** The rendered content, which stands in for a missing `text` once there is a page to read it from. */
	let rendered = $state<string>();

	// Report the option's label and the trigger can show text instead of the raw value. It is reported
	// as the option is created, ahead of the trigger, so the server writes it too.
	const withdraw = context.methods?.registerOption({
		get value() {
			return value;
		},
		get text() {
			return text ?? rendered;
		}
	});

	onMount(() => {
		rendered = ref?.textContent?.trim() || undefined;
		return withdraw;
	});
</script>

<ListViewItem role="option" {value} {id} bind:ref {disabled}>
	{#if children}
		{@render children?.()}
	{:else}
		{text}
	{/if}
</ListViewItem>
