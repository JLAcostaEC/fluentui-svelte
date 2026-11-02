<script lang="ts">
	import { FluentUISvelte, Label, TextBox } from '$lib/index.js';
	import type { LabelProps } from '../types.ts';

	let {
		content = 'text',
		badge = 'default',
		tooltipButtonAttributes
	}: {
		content?: 'none' | 'text';
		badge?: 'default' | 'snippet';
		tooltipButtonAttributes?: LabelProps['tooltipButtonAttributes'];
	} = $props();
</script>

{#snippet badgeSnippet()}
	<span data-testid="snippet-badge">?</span>
{/snippet}

<FluentUISvelte>
	<Label
		label="Bank"
		labelPosition="above"
		required={{ message: 'Required field' }}
		tooltipContent={content === 'text' ? 'The bank that holds the account.' : undefined}
		tooltipBadge={badge === 'snippet' ? badgeSnippet : undefined}
		{tooltipButtonAttributes}
	>
		<TextBox />
	</Label>
</FluentUISvelte>
