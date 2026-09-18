<script lang="ts">
	import { getTabspotAttributes } from 'tabspot';
	import type { BreadcrumbProps } from './types.ts';

	/** The steps a mover lands on when the trail takes a single tab stop. */
	const TABSPOT_ITEMS = '.fs-breadcrumb-button';

	let {
		ref = $bindable(),
		listRef = $bindable(),
		listProps,
		size = 'medium',
		focusMode = 'tab',
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		class: classes,
		children,
		...attributes
	}: BreadcrumbProps = $props();

	const tabspotAttributes = $derived(
		focusMode === 'arrow' &&
			getTabspotAttributes({
				root: { manageSpecialKeys: { Home: true, End: true } },
				mover: { axis: 'horizontal', items: TABSPOT_ITEMS }
			})
	);
</script>

<!--
	@component
	A breadcrumb shows where a page sits in the hierarchy above it, and gives the reader a way back
	up. It renders a landmark of its own, so a screen reader can jump straight to it.

	- Usage:
	```tsx
	<script>
		import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider } from 'fluentui-svelte';
	</script>

	<Breadcrumb>
		<BreadcrumbItem>
			<BreadcrumbButton as="a" href="/">Home</BreadcrumbButton>
		</BreadcrumbItem>
		<BreadcrumbDivider />
		<BreadcrumbItem>
			<BreadcrumbButton current>This page</BreadcrumbButton>
		</BreadcrumbItem>
	</Breadcrumb>
	```
-->
<nav
	bind:this={ref}
	aria-label={ariaLabelledby ? undefined : (ariaLabel ?? 'Breadcrumb')}
	aria-labelledby={ariaLabelledby}
	class={['fs-breadcrumb', size, classes]}
	{...attributes}
>
	<ol bind:this={listRef} class="fs-breadcrumb-list" {...tabspotAttributes} {...listProps}>
		{@render children?.()}
	</ol>
</nav>

<style>
	.fs-breadcrumb {
		font-family: var(--fs-font-family-base);
		color: var(--fs-text-primary);
		/* Read by every step and divider */
		--fs-breadcrumb-font-size: var(--fs-body2-font-size);
		--fs-breadcrumb-line-height: var(--fs-body2-line-height);
		--fs-breadcrumb-height: 1.5rem;
		--fs-breadcrumb-padding-inline: 0.375rem;
		--fs-breadcrumb-gap: 0.25rem;
		--fs-breadcrumb-icon-size: 1rem;
		--fs-breadcrumb-divider-size: 1rem;
		&.small {
			--fs-breadcrumb-font-size: var(--fs-caption-font-size);
			--fs-breadcrumb-line-height: var(--fs-caption-line-height);
			--fs-breadcrumb-height: 1.25rem;
			--fs-breadcrumb-padding-inline: 0.25rem;
			--fs-breadcrumb-icon-size: 0.875rem;
			--fs-breadcrumb-divider-size: 0.625rem;
		}
		&.large {
			--fs-breadcrumb-font-size: var(--fs-body-font-size);
			--fs-breadcrumb-line-height: var(--fs-body-line-height);
			--fs-breadcrumb-height: 2rem;
			--fs-breadcrumb-padding-inline: 0.5rem;
			--fs-breadcrumb-icon-size: 1.25rem;
			--fs-breadcrumb-divider-size: 1.25rem;
		}
		& .fs-breadcrumb-list {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin: 0;
			padding: 0;
			list-style: none;
		}
	}
</style>
