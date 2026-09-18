<script lang="ts">
	import ChevronRightRegular from 'fluentui-icons-svelte/ChevronRightRegular.svelte';
	import type { BreadcrumbDividerProps } from './types.ts';

	let { ref = $bindable(), class: classes, children, ...attributes }: BreadcrumbDividerProps = $props();
</script>

<!--
	@component
	The mark between two steps of a `Breadcrumb`. It is decoration, so it is held out of the
	accessibility tree: a reader counting the steps of the trail should not be read a chevron
	between each one, nor be told the list is twice as long as it is.

	- Usage:
	```tsx
	<BreadcrumbDivider />
	```
-->
<li bind:this={ref} aria-hidden="true" class={['fs-breadcrumb-divider', classes]} {...attributes}>
	{#if children}
		{@render children()}
	{:else}
		<ChevronRightRegular />
	{/if}
</li>

<style>
	.fs-breadcrumb-divider {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		color: var(--fs-text-secondary);
		& :global(svg) {
			width: var(--fs-breadcrumb-divider-size, 0.75rem);
			height: var(--fs-breadcrumb-divider-size, 0.75rem);
		}
	}
</style>
