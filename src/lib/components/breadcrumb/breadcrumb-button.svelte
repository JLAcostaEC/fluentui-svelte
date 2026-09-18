<script lang="ts" generics="T extends BreadcrumbItemGenerics = 'button'">
	import { invokeHandlers, RenderSoC } from '$internal';
	import type { BreadcrumbButtonProps, BreadcrumbItemElementDOMType, BreadcrumbItemGenerics } from './types.ts';

	let {
		as = 'button' as T,
		ref = $bindable(),
		icon,
		iconPosition = 'before',
		current = false,
		disabled,
		disabledFocusable = false,
		onclick,
		class: classes,
		children,
		...attributes
	}: BreadcrumbButtonProps<T> = $props();

	const _as = $derived.by(() => {
		if (as !== 'button' && as !== 'a') throw new Error(`Invalid tag: ${as}. Must be one of button, a`);
		return as;
	});

	const nativelyDisabled = $derived(_as === 'button' && disabled && !disabledFocusable);
</script>

<!--
	@component
	A step of a `Breadcrumb` that can be activated: an anchor when it goes somewhere, a button when
	it does something. The last step is the page itself, and `current` is what announces it.

	- Usage:
	```tsx
	<BreadcrumbButton as="a" href="/files" icon={FolderRegular}>Files</BreadcrumbButton>
	<BreadcrumbButton current>This page</BreadcrumbButton>
	```
-->
<svelte:element
	this={_as}
	bind:this={ref as BreadcrumbItemElementDOMType[T]}
	type={_as === 'button' ? 'button' : undefined}
	disabled={nativelyDisabled || undefined}
	aria-disabled={disabled || undefined}
	aria-current={current ? 'page' : undefined}
	class={['fs-breadcrumb-button', { current, disabled }, classes]}
	onclick={(e: MouseEvent) => invokeHandlers(e, disabled, [onclick])}
	{...attributes}
>
	{#if icon && iconPosition === 'before'}
		<span class="fs-breadcrumb-button-icon">
			<RenderSoC SoC={icon} />
		</span>
	{/if}
	<span class="fs-breadcrumb-button-label">
		{@render children?.()}
	</span>
	{#if icon && iconPosition === 'after'}
		<span class="fs-breadcrumb-button-icon">
			<RenderSoC SoC={icon} />
		</span>
	{/if}
</svelte:element>

<style>
	.fs-breadcrumb-button {
		display: inline-flex;
		align-items: center;
		gap: var(--fs-breadcrumb-gap, 0.25rem);
		box-sizing: border-box;
		min-width: 0;
		height: var(--fs-breadcrumb-height, 1.5rem);
		padding: 0 var(--fs-breadcrumb-padding-inline, 0.375rem);
		border: none;
		border-radius: var(--fs-control-border-radius);
		background: transparent;
		color: var(--fs-text-secondary);
		font-family: inherit;
		font-size: var(--fs-breadcrumb-font-size, var(--fs-body2-font-size));
		line-height: var(--fs-breadcrumb-line-height, var(--fs-body2-line-height));
		/* An anchor arrives underlined and in the colour of a link; a step is neither. */
		text-decoration: none;
		cursor: pointer;
		outline: none;
		transition:
			color var(--fs-fast-duration) var(--fs-point-to-point),
			background var(--fs-fast-duration) var(--fs-point-to-point);
		&:hover:not(.disabled) {
			background: var(--fs-subtle-fill-secondary);
			color: var(--fs-text-primary);
		}
		&:active:not(.disabled) {
			background: var(--fs-subtle-fill-tertiary);
			color: var(--fs-text-secondary);
		}
		&:focus-visible {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.125rem;
		}
		/* The end of the trail is where the reader already is, so it reads as text, not as a way out. */
		&.current {
			color: var(--fs-text-primary);
			font-weight: 600;
			cursor: default;
			&:hover,
			&:active {
				background: transparent;
				color: var(--fs-text-primary);
			}
		}
		&.disabled {
			color: var(--fs-text-disabled);
			cursor: not-allowed;
		}
		& .fs-breadcrumb-button-icon {
			display: flex;
			flex: 0 0 auto;
			align-items: center;
			justify-content: center;
			& :global(svg) {
				width: var(--fs-breadcrumb-icon-size, 1rem);
				height: var(--fs-breadcrumb-icon-size, 1rem);
			}
		}
		& .fs-breadcrumb-button-label {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
