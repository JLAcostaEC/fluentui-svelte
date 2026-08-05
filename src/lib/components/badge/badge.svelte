<script lang="ts">
	import { pxToRem, RenderSoC } from '$internal';
	import { shapes } from './utils.svelte.ts';
	import type { BadgeProps } from './types.ts';

	let {
		size = 20,
		shape = 'circular',
		appearance = 'filled',
		color = 'information',
		icon: Icon,
		iconPosition = 'before',
		children,
		class: classes,
		style,
		ref = $bindable(),
		...attributes
	}: BadgeProps = $props();
</script>

<!-- 
  @component
  Fluent UI Badge: It displays an icon and/or text with various styles and colors.
  The badge can have different shapes, sizes, and appearances.
  It is used to highlight or label items with additional information.
  - Usage:
  ```tsx
  <script>
    import { Badge } from 'fluentui-svelte';
    import { HomeIcon } from 'some-icon-library';
  </script>

  <Badge size={24} shape="rounded" appearance="outline" color="success" Icon={HomeIcon}>
    Home
  </Badge>
  ```
 -->
<span
	bind:this={ref}
	class={['fs-badge', shape, appearance, color, classes]}
	style="--badge-shapes: {shapes[shape]}; --badge-size: {pxToRem(size)}; {style}"
	{...attributes}
>
	{#if iconPosition === 'after'}
		{@render children?.()}
		<RenderSoC SoC={Icon} />
	{:else}
		<RenderSoC SoC={Icon} />
		{@render children?.()}
	{/if}
</span>

<style>
	.fs-badge {
		display: inline-flex;
		justify-content: center;
		position: relative;
		align-items: center;
		padding: 0.25rem;
		gap: 0.25rem;
		user-select: none;
		border-radius: var(--badge-shapes);
		color: var(--fs-text-on-accent-primary);
		line-height: var(--fs-caption-line-height);
		font-size: calc(var(--badge-size) / 2);
		font-weight: 600;
		width: var(--badge-size);
		min-width: max-content;
		height: var(--badge-size);
		& :global(svg) {
			width: calc(var(--badge-size) / 1.5);
			& :global(path) {
				fill: var(--fs-text-on-accent-primary);
			}
		}
		&.information {
			background: var(--fs-system-neutral);
			&:not(.filled) {
				color: var(--fs-system-neutral);
				& :global(path) {
					fill: var(--fs-system-neutral);
				}
			}
			&.tint {
				background: var(--fs-system-neutral-bg);
			}
		}
		&.attention {
			background: var(--fs-system-attention);
			&:not(.filled) {
				color: var(--fs-accent-text-primary);
				& :global(path) {
					fill: var(--fs-accent-text-primary);
				}
			}
			&.tint {
				background: var(--fs-system-attention-bg);
			}
		}
		&.warning {
			background: var(--fs-system-caution);
			&:not(.filled) {
				color: var(--fs-system-caution-text);
				& :global(path) {
					fill: var(--fs-system-caution-text);
				}
			}
			&.tint {
				background: var(--fs-system-caution-bg);
			}
		}
		&.success {
			background: var(--fs-system-success);
			&:not(.filled) {
				color: var(--fs-system-success-text);
				& :global(path) {
					fill: var(--fs-system-success-text);
				}
			}
			&.tint {
				background: var(--fs-system-success-bg);
			}
		}
		&.critical {
			background: var(--fs-system-critical);
			&:not(.filled) {
				color: var(--fs-system-critical-text);
				& :global(path) {
					fill: var(--fs-system-critical-text);
				}
			}
			&.tint {
				background: var(--fs-system-critical-bg);
			}
		}
		&.outline:after,
		&.tint:after {
			content: '';
			position: absolute;
			inset: 0;
			border-radius: var(--badge-shapes);
		}
		&.outline {
			border: 1px solid currentColor;
		}
		&.tint {
			border: 1px solid color-mix(in srgb, currentColor, transparent 50%);
		}
		&:not(.filled, .tint) {
			background: transparent;
		}
		&.ghost :global(svg) {
			width: auto;
			max-width: calc(var(--badge-size) + 4px);
			position: absolute;
			top: -3px;
			left: -3px;
			& :global(path) {
				fill: var(--fs-text-on-accent-primary);
			}
		}
	}
</style>
