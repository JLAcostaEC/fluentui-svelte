<script lang="ts">
	import { Label, SegmentedControl, SegmentedControlItem } from '#lib/index.js';
	import type { SegmentedControlProps, SegmentedControlItemProps } from '../types.ts';
	let {
		selectedValue = $bindable('day'),
		external = false,
		label = 'View',
		itemProps,
		...props
	}: SegmentedControlProps & {
		external?: boolean;
		label?: string;
		itemProps?: Partial<SegmentedControlItemProps>;
	} = $props();
</script>

{#snippet control()}
	<Label {label}>
		<SegmentedControl bind:selectedValue name="view" form={external ? 'view-form' : undefined} {...props}>
			<SegmentedControlItem value="day">Day</SegmentedControlItem>
			<SegmentedControlItem value="week" {...itemProps}>Whole week</SegmentedControlItem>
		</SegmentedControl>
	</Label>
{/snippet}
<form id="view-form" aria-label="View form" onsubmit={(event) => event.preventDefault()}>
	<button type="button">Before</button>
	{#if !external}{@render control()}{/if}
	<button type="submit">Submit</button>
	<button type="reset">Reset</button>
</form>
{#if external}{@render control()}{/if}
<output aria-label="Selection">{selectedValue}</output>
