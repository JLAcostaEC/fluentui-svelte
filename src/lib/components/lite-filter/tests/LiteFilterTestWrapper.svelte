<script lang="ts">
	import { LiteFilter, LiteFilterItem } from '#lib/index.js';
	import type { LiteFilterProps } from '#lib/components/lite-filter/types.js';

	let {
		selectedValue = $bindable(),
		width = 'auto',
		...props
	}: Partial<LiteFilterProps> & { width?: string } = $props();
	const items = ['All', 'Apps', 'Documents', 'Web', 'People', 'Pictures', 'Videos'];
	let changes: string[] = $state([]);
</script>

<form data-testid="form" style="width: {width}">
	<LiteFilter
		aria-label="Filters"
		name="filter"
		bind:selectedValue
		onSelectionChange={(_, value) => changes.push(String(value))}
		{...props}
	>
		{#each items as item (item)}
			<LiteFilterItem value={item.toLowerCase()} disabled={item === 'Web'}>{item}</LiteFilterItem>
		{/each}
	</LiteFilter>
</form>
<output data-testid="value">{String(selectedValue)}</output>
<output data-testid="changes">{changes.join('|')}</output>
