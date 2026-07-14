<script lang="ts">
	import { PREFIX } from '$constants';
	import type { Snippet } from 'svelte';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'menu-group';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	let { ref = $bindable(), header, children }: { ref?: HTMLDivElement; header?: string; children: Snippet } = $props();
</script>

<div class="fs-menu-group" role="group" aria-labelledby="group-name-{ID}" bind:this={ref}>
	<h3 id="group-name-{ID}" class="group-name">{header || ID}</h3>
	{@render children()}
</div>

<style>
	.fs-menu-group {
		margin: 0;
		display: flex;
		flex-direction: column;
		flex: 1;
		& .group-name {
			font-size: var(--fs-caption-font-size);
			line-height: var(--fs-caption-line-height);
			font-weight: 500;
			padding: 0.313rem 0.5rem 0.313rem;
			color: var(--fs-text-secondary);
		}
	}
</style>
