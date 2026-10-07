<script lang="ts">
	import { Tag } from '$lib/index.js';
	import InfoFilled from 'fluentui-icons-svelte/InfoFilled.svelte';
	import type { TagProps } from '$lib/components/tag/types.js';

	let {
		text = 'Tag 1',
		withIcon = false,
		withMedia = false,
		withSecondarySnippet = false,
		tagProps = {}
	}: {
		text?: string;
		withIcon?: boolean;
		withMedia?: boolean;
		withSecondarySnippet?: boolean;
		tagProps?: Partial<TagProps>;
	} = $props();
</script>

{#snippet media()}
	<span data-testid="media">M</span>
{/snippet}

{#snippet secondary()}
	<em data-testid="secondary-snippet">Snippet secondary</em>
{/snippet}

<Tag
	icon={withIcon ? InfoFilled : undefined}
	media={withMedia ? media : undefined}
	secondaryText={withSecondarySnippet ? secondary : undefined}
	{...tagProps}
>
	{text}
</Tag>
