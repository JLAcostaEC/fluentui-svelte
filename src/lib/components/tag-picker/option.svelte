<script lang="ts">
	import { PREFIX } from '$constants';
	import ListViewItem from '$lib/components/list-view/list-view-item.svelte';
	import { getTagPickerContext } from './tag-picker.ts';
	import type { TagPickerOptionProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}-${FALLBACK_ID}`;

	let {
		disabled,
		ref = $bindable(),
		id = ID,
		value,
		text,
		class: classes,
		onclick,
		children,
		...attributes
	}: TagPickerOptionProps = $props();

	const context = getTagPickerContext();

	if (!context) throw new Error('TagPickerOption must be used within a TagPicker');

	const { state: _state, methods } = context;
	const label = $derived(text ?? value);

	// A chosen option is not offered again, and a typed query leaves only the options that contain it.
	const isVisible = $derived(
		!_state.selectedOptions.includes(value) && label.toLowerCase().includes(_state.query.toLowerCase())
	);

	function handleClick(e: Parameters<NonNullable<typeof onclick>>[0]) {
		onclick?.(e);

		if (!disabled) methods.chooseOption(e, id);
	}

	// The tag of the option keeps its text even when the option itself is not on screen.
	$effect(() => methods.setLabel(value, label));

	// An option counts only while it is on screen: that is what makes the empty list detectable
	// and keeps keyboard navigation off options nobody can see.
	$effect(() => {
		if (!isVisible || !_state.open) return;

		// Capture current values to avoid them being stale in the callback
		const _id = id;

		methods.setOption({ id, value, disabled });

		return () => methods.deleteOption(_id);
	});
</script>

{#if isVisible}
	<ListViewItem
		{id}
		role="option"
		{value}
		tabindex={-1}
		class={['fs-tagpicker-option', classes]}
		bind:ref
		{disabled}
		{...attributes}
		onclick={handleClick}
	>
		{@render children?.()}
	</ListViewItem>
{/if}
