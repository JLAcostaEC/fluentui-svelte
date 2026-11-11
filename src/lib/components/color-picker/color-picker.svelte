<script lang="ts">
	import { untrack } from 'svelte';
	import { HueyRoot } from '@hueycolor/svelte';
	import { claimLabel } from '../label/label-context.ts';
	import ColorPickerControl from './color-picker-control.svelte';
	import { parseColor } from './color.ts';
	import type { ColorPickerProps } from './types.ts';

	const uid = $props.id();
	// Claim the surrounding Label before the nested channel editors can claim it.
	const context = claimLabel(() => id);

	let {
		value = $bindable(),
		defaultValue = '#ffffff',
		ref = $bindable(null),
		wrapperRef = $bindable(null),
		id = context?.fieldId ?? `fs-color-picker-${uid}`,
		name = id,
		...props
	}: ColorPickerProps = $props();

	if (value === undefined) value = untrack(() => defaultValue);
</script>

<HueyRoot color={value && parseColor(value) ? value : '#ffffff'}>
	<ColorPickerControl
		{...props}
		{id}
		{name}
		{defaultValue}
		labelId={context?.labelId}
		bind:value
		bind:ref
		bind:wrapperRef
	/>
</HueyRoot>
