<script lang="ts">
	import { FluentUISvelte, SegmentedControl, SegmentedControlItem } from '#lib/index.js';
	import { CalendarRegular } from 'fluentui-icons-svelte';
	import type { SegmentedControlProps } from '../types.ts';
	let {
		selectedValue = $bindable('day'),
		itemDisabled = false,
		late = false,
		...props
	}: SegmentedControlProps & { itemDisabled?: boolean; late?: boolean } = $props();
	let visible = $state(false);
</script>

<FluentUISvelte>
	<button onclick={() => (visible = true)}>Show</button>
	{#if !late || visible}
		<SegmentedControl bind:selectedValue aria-label="View" {...props}>
			<SegmentedControlItem value="day">Day</SegmentedControlItem>
			<SegmentedControlItem value="week" disabled={itemDisabled}>Whole week</SegmentedControlItem>
			<SegmentedControlItem value="month" icon={CalendarRegular} aria-label="Month" />
		</SegmentedControl>
	{/if}
	<output aria-label="Selection">{selectedValue}</output>
</FluentUISvelte>
