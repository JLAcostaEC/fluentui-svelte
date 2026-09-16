<script lang="ts">
	import { RenderSoC } from '$internal';
	import type { TableCellLayoutProps } from './types.ts';

	let {
		ref = $bindable(),
		media: Media,
		description,
		appearance,
		truncate = false,
		class: classes,
		children,
		...attributes
	}: TableCellLayoutProps = $props();
</script>

<!--
	@component
	Lays a cell out as media, main content and an optional description.

	- Usage:
	```tsx
	<TableCell>
		<TableCellLayout media={DocumentRegular} description="7h ago">Meeting notes</TableCellLayout>
	</TableCell>
	```
-->
<div bind:this={ref} class={['fs-table-cell-layout', appearance, { truncate }, classes]} {...attributes}>
	{#if Media}
		<span class="media">
			<RenderSoC SoC={Media} args={{ class: 'fs-table-cell-media' }} />
		</span>
	{/if}
	<span class="content">
		<span class="main">{@render children?.()}</span>
		{#if description}
			<small class="description">{description}</small>
		{/if}
	</span>
</div>

<style>
	.fs-table-cell-layout {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
		& .media {
			display: inline-flex;
			align-items: center;
			flex-shrink: 0;
			color: var(--fs-text-secondary);
			& :global(svg) {
				width: 1.25rem;
				height: 1.25rem;
				fill: currentColor;
			}
		}
		& .content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			min-width: 0;
		}
		& .description {
			font-size: var(--fs-caption2-font-size);
			line-height: var(--fs-caption2-line-height);
			color: var(--fs-text-secondary);
		}
		&.primary {
			& .main {
				font-weight: 600;
			}
			& .media :global(svg) {
				width: 1.5rem;
				height: 1.5rem;
			}
		}
		&.truncate {
			& .main,
			& .description {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>
