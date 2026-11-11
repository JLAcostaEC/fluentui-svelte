<script lang="ts">
	import type { PillButtonBaseProps } from './types.ts';

	let {
		as = 'span',
		appearance = 'filled',
		size = 'medium',
		shape = 'circular',
		selected = false,
		disabled = false,
		ref = $bindable(null),
		class: classes,
		children,
		...attributes
	}: PillButtonBaseProps = $props();
</script>

<svelte:element
	this={as}
	{...attributes}
	{@attach (element: HTMLElement) => {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}}
	class={['fs-pill-button-base', size, appearance, shape, { selected, disabled }, classes]}
	disabled={as === 'button' ? disabled : undefined}
>
	{@render children?.()}
</svelte:element>

<style>
	.fs-pill-button-base {
		--pill-spacing: 0.4375rem;
		--pill-icon-size: 1.25rem;
		--pill-icon-gap: 0.25rem;
		--pill-media-gap: 0.5rem;
		--pill-dismiss-spacing: 0.3125rem;
		--pill-height: 2rem;
		--pill-font-size: var(--fs-body2-font-size);
		--pill-line-height: var(--fs-body2-line-height);
		--pill-radius: var(--fs-control-border-radius);
		--pill-bg: var(--fs-control-fill-secondary);
		--pill-bg-hover: var(--fs-control-alt-fill-quaternary);
		--pill-bg-pressed: var(--fs-control-alt-fill-secondary);
		--pill-fg: var(--fs-text-primary);
		--pill-border: var(--fs-control-stroke-default);
		--pill-divider: var(--fs-control-stroke-secondary);
		--pill-danger: var(--fs-system-critical);
		--pill-danger-pressed: color-mix(in srgb, var(--fs-system-critical), black 15%);

		box-sizing: border-box;
		width: fit-content;
		height: var(--pill-height);
		margin: 0;
		color: var(--pill-fg);
		font-family: inherit;
		font-size: var(--pill-font-size);
		line-height: var(--pill-line-height);
		text-align: start;
		user-select: none;
		border-radius: var(--pill-radius);

		&.small {
			--pill-spacing: 0.3125rem;
			--pill-icon-size: 1rem;
			--pill-icon-gap: 0.125rem;
			--pill-media-gap: 0.375rem;
			--pill-dismiss-spacing: 0.1875rem;
			--pill-height: 1.5rem;
			--pill-font-size: var(--fs-caption-font-size);
			--pill-line-height: var(--fs-caption-line-height);
		}
		&.extra-small {
			--pill-spacing: 0.3125rem;
			--pill-icon-size: 0.75rem;
			--pill-icon-gap: 0.125rem;
			--pill-media-gap: 0.375rem;
			--pill-height: 1.25rem;
			--pill-font-size: var(--fs-caption-font-size);
			--pill-line-height: var(--fs-caption-line-height);
		}
		&.large {
			--pill-height: 2.5rem;
			--pill-font-size: var(--fs-body-font-size);
			--pill-line-height: var(--fs-body-line-height);
		}
		&.extra-large {
			--pill-height: 3rem;
			--pill-font-size: var(--fs-subtitle2-font-size);
			--pill-line-height: var(--fs-subtitle2-line-height);
		}
		&.circular {
			--pill-radius: 9999rem;
		}
		&.square {
			--pill-radius: 0;
		}

		&.outline {
			--pill-bg: transparent;
			--pill-bg-hover: var(--fs-subtle-fill-secondary);
			--pill-bg-pressed: var(--fs-subtle-fill-tertiary);
			--pill-border: var(--fs-control-stroke-secondary);
		}
		&.brand {
			--pill-bg: var(--fs-system-attention-bg);
			--pill-bg-hover: color-mix(in srgb, var(--fs-system-attention-bg), rgb(var(--fs-accent-base)) 10%);
			--pill-bg-pressed: color-mix(in srgb, var(--fs-system-attention-bg), rgb(var(--fs-accent-base)) 18%);
			--pill-fg: var(--fs-accent-text-primary);
			--pill-divider: color-mix(in srgb, rgb(var(--fs-accent-base)), transparent 70%);
		}
		&.selected {
			--pill-bg: var(--fs-accent-fill-default);
			--pill-bg-hover: var(--fs-accent-fill-secondary);
			--pill-bg-pressed: var(--fs-accent-fill-tertiary);
			--pill-fg: var(--fs-text-on-accent-primary);
			--pill-border: var(--fs-accent-fill-default);
			--pill-divider: var(--fs-control-stroke-on-accent-secondary);
		}
		&.disabled {
			--pill-bg: var(--fs-control-alt-fill-secondary);
			--pill-bg-hover: var(--fs-control-alt-fill-secondary);
			--pill-bg-pressed: var(--fs-control-alt-fill-secondary);
			--pill-fg: var(--fs-text-disabled);
			--pill-border: transparent;
			--pill-divider: var(--fs-control-stroke-default);
			&.outline {
				--pill-bg: transparent;
				--pill-bg-hover: transparent;
				--pill-bg-pressed: transparent;
				--pill-border: var(--fs-control-stroke-default);
			}
		}
	}
</style>
