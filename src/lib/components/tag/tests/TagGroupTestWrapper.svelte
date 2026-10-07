<script lang="ts">
	import { FluentUISvelte, Tag, TagGroup } from '$lib/index.js';
	import type { TagGroupProps, TagProps } from '$lib/components/tag/types.js';

	type Item = { value: string; text: string; props?: Partial<TagProps> };

	let {
		groupProps = {},
		items = [
			{ value: 'one', text: 'Tag 1' },
			{ value: 'two', text: 'Tag 2' },
			{ value: 'three', text: 'Tag 3' }
		],
		selectedValues = $bindable([])
	}: {
		groupProps?: Partial<TagGroupProps>;
		items?: Item[];
		selectedValues?: string[];
	} = $props();
</script>

<FluentUISvelte>
	<TagGroup aria-label="Tags" bind:selectedValues {...groupProps}>
		{#each items as item (item.value)}
			<Tag value={item.value} {...item.props}>{item.text}</Tag>
		{/each}
	</TagGroup>
	<p data-testid="selected">{selectedValues.join(',')}</p>
</FluentUISvelte>
