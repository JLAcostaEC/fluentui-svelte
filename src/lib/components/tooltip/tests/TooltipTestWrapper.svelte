<script lang="ts">
	import { Tooltip } from '$lib/index.js';
	import type { TooltipProps } from '$lib/components/tooltip/types.js';

	let {
		open = $bindable(false),
		label = 'Hover over me',
		...props
	}: Partial<TooltipProps> & { label?: string } = $props();
</script>

<Tooltip bind:open {...props}>
	{#snippet children(attrs, trigger)}
		<button type="button" data-testid="trigger" {...attrs} {@attach trigger}>{label}</button>
	{/snippet}
</Tooltip>
