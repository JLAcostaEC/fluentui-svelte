<script lang="ts">
	import { PREFIX } from '$constants';
	import ListViewItem from '$lib/components/list-view/list-view-item.svelte';
	import { getAutoSuggestBoxContext } from './auto-suggest-box.ts';
	import type { AutoSuggestOptionProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}-${FALLBACK_ID}`;

	let {
		disabled,
		ref = $bindable(),
		id = ID,
		value = id!,
		text,
		index,
		children,
		...attributes
	}: AutoSuggestOptionProps = $props();

	const context = getAutoSuggestBoxContext();

	if (!context) throw new Error('AutoSuggestOption must be used within an AutoSuggestBox');

	const { config, state: _state, methods } = context;
	const { selectOnFocus, virtualized } = config;
	const { setOption, deleteOption, toggleSelection } = methods;

	let isVisible = $derived(
		value.toLowerCase().includes((_state.lastTypedValue || '').toLowerCase()) ||
			text?.toLowerCase().includes((_state.lastTypedValue || '').toLowerCase())
	);

	function handleClick(e: MouseEvent) {
		if (disabled) return;

		toggleSelection?.(e, id);

		if (!config.multiselect) _state.open = false;
	}

	// An option counts only while it is on screen: that is what makes the empty
	// list detectable when a query filters everything out, and it keeps keyboard
	// navigation off options nobody can see. The effect also covers the virtualizer
	// remounting the same component instance with new data.
	$effect(() => {
		if (!isVisible && !virtualized) return;

		// Capture current values to avoid them being stale in the callback
		const _id = id;

		setOption?.({ id, index, value, text, disabled });

		return () => deleteOption?.(_id);
	});
</script>

{#if isVisible || virtualized}
	<ListViewItem
		{id}
		role="option"
		{value}
		tabindex={-1}
		data-index={index}
		class={['fs-autosuggest-option', selectOnFocus && 'no-outline']}
		onclick={handleClick}
		bind:ref
		{disabled}
		{...attributes}
	>
		{@render children?.()}
	</ListViewItem>
{/if}

<style>
	/* Tabspot marks the option under the cursor with `data-active`, which
	   ListViewItem already outlines. With selectOnFocus the text box mirrors that
	   option instead, so the outline would be noise. */
	:global(.fs-autosuggest-option.no-outline) {
		outline: 0 !important;
	}
</style>
