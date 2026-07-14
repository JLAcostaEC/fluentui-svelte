<script lang="ts">
	import { onMount } from 'svelte';
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

	// Sometimes virtualizer remounts same component instances with new data
	if (virtualized) {
		$effect(() => {
			// Capture current values to avoid them being stale in the callback
			const _id = id;

			setOption?.({ id, index, value, text, disabled });

			return () => deleteOption?.(_id);
		});
	} else {
		onMount(() => {
			setOption?.({ id, index, value, text, disabled });

			return () => deleteOption?.(id);
		});
	}
</script>

{#if isVisible || virtualized}
	<ListViewItem
		{id}
		role="option"
		{value}
		tabindex={-1}
		class="fs-autosuggest-option {selectOnFocus ? 'no-outline' : ''} {_state.activeOption?.id === id ? 'focus' : ''}"
		onclick={handleClick}
		bind:ref
		{disabled}
		{...attributes}
	>
		{@render children?.()}
	</ListViewItem>
{/if}

<style>
	:global(.fs-autosuggest-option.no-outline) {
		outline: 0 !important;
	}
	:global(.fs-autosuggest-option.focus) {
		outline: 0.125rem var(--fs-focus-stroke-outer) solid;
		outline-offset: 0.063rem;
	}
</style>
