<script lang="ts">
	import type { BreadcrumbItemProps } from './types.ts';

	let { ref = $bindable(), class: classes, children, ...attributes }: BreadcrumbItemProps = $props();
</script>

<!--
	@component
	One step of a `Breadcrumb`: the list item the step lives in. What goes inside is usually a
	`BreadcrumbButton`, but it takes anything — a menu holding the steps that were folded away, for
	instance.

	- Usage:
	```tsx
	<BreadcrumbItem>
		<BreadcrumbButton as="a" href="/">Home</BreadcrumbButton>
	</BreadcrumbItem>
	```
-->
<li bind:this={ref} class={['fs-breadcrumb-item', classes]} {...attributes}>
	{@render children?.()}
</li>

<style>
	.fs-breadcrumb-item {
		display: flex;
		align-items: center;
		min-width: 0;
	}
</style>
