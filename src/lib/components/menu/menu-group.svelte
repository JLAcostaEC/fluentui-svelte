<script lang="ts">
	import { PREFIX } from '#constants';
	import type { MenuGroupProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'menu-group';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	let { ref = $bindable(null), header, children }: MenuGroupProps = $props();
</script>

<div class="fs-menu-group" role="group" aria-labelledby={header ? `group-name-${ID}` : undefined} bind:this={ref}>
	{#if header}
		<!-- A menu holds only items, groups and separators, so the label is plain text that names the group. -->
		<div id="group-name-{ID}" class="group-name" role="presentation">{header}</div>
	{/if}
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
