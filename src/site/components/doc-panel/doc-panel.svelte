<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Badge } from '#lib/index.js';

	let { label, children }: { label: string; children: Snippet } = $props();
</script>

<!--
	@component
	Frames a part of a guide that readers can skip. The dashed outline and the label set it apart from the required
	steps around it. Keep the heading outside: the table of contents only reads the headings that are direct children
	of the page.
-->
<div class="doc-panel">
	<Badge appearance="tint" color="attention" class="doc-panel-label">{label}</Badge>
	{@render children()}
</div>

<style>
	.doc-panel {
		align-self: stretch;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.25rem 1.5rem 1.5rem;
		border: 1px dashed var(--fs-control-surface-stroke-default);
		border-radius: var(--fs-control-overlay-border-radius);
		background: var(--fs-card-background-secondary);
		& > :global(*) {
			max-width: 100%;
		}
		& :global(p),
		& :global(li) {
			font-size: var(--fs-body-font-size);
			line-height: var(--fs-body-line-height);
		}
		& :global(pre) {
			align-self: stretch;
		}
	}

	@media (max-width: 480px) {
		.doc-panel {
			padding: 1rem;
		}
	}
</style>
