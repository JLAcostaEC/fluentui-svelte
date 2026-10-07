<script lang="ts">
	import { FluentUISvelte, Tag, TagGroup } from '$lib/index.js';

	let { disabled = [] }: { disabled?: string[] } = $props();

	let values = $state(['one', 'two', 'three', 'four']);
</script>

<FluentUISvelte>
	<TagGroup
		aria-label="Tags"
		onDismiss={(_, { value }) => {
			values = values.filter((v) => v !== value);
		}}
	>
		{#each values as value (value)}
			<Tag interactive dismissible {value} disabled={disabled.includes(value)}>{value}</Tag>
		{/each}
	</TagGroup>
	<button>After</button>
</FluentUISvelte>
