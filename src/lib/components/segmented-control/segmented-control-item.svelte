<script lang="ts">
	import { invokeHandlers, RenderSoC } from '#internal';
	import { requireSegmentedControlContext } from './segmented-control.svelte.ts';
	import type { SegmentedControlItemProps } from './types.ts';
	import { untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	const ID = $props.id();

	let {
		ref = $bindable(null),
		value,
		id = `fs-segmented-control-item-${ID}`,
		icon,
		disabled = false,
		onchange,
		class: classes,
		style,
		children,
		...attributes
	}: SegmentedControlItemProps = $props();

	const context = requireSegmentedControlContext();
	const selected = $derived(context.state.selectedValue === value);
	const _disabled = $derived(disabled || context.config.disabled);
	const initialChecked = untrack(() => selected);

	const attachInput: Attachment<HTMLInputElement> = (element) => {
		element.setCustomValidity(
			context.config.required && !context.state.selectedValue ? context.config.validationMessage : ''
		);
		return () => {
			element.setCustomValidity('');
		};
	};
</script>

<!-- @component A selectable segment. Use a unique value and label text or aria-label. -->
<span
	class={[
		'fs-segmented-control-item',
		{ selected, disabled: _disabled, 'show-indicator': !context.config.hideIndicator },
		classes
	]}
	{style}
>
	<input
		{...attributes}
		bind:this={ref}
		{@attach attachInput}
		type="radio"
		{id}
		{value}
		name={context.config.name}
		form={context.config.form}
		required={context.config.required || attributes.required}
		disabled={_disabled}
		defaultChecked={initialChecked}
		checked={selected}
		onchange={(event) => invokeHandlers(event, _disabled, [() => context.methods.selectItem(event, value), onchange])}
	/>
	<label for={id}>
		{#if icon}
			<span class="fs-segmented-control-item-icon" aria-hidden="true"><RenderSoC SoC={icon} /></span>
		{/if}
		{@render children?.()}
	</label>
</span>

<style>
	.fs-segmented-control-item {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		box-sizing: border-box;
		padding: var(--fs-segmented-control-item-padding) calc(var(--fs-segmented-control-item-padding) * 3);
		border: 0;
		border-radius: calc(var(--fs-control-border-radius) - 1px);
		background: transparent;
		color: var(--fs-segmented-control-text-color, var(--fs-text-secondary));
		font-family: inherit;
		font-size: var(--fs-segmented-control-font-size);
		line-height: var(--fs-segmented-control-line-height);
		font-weight: 400;
		white-space: nowrap;
		cursor: pointer;
		user-select: none;
		transition:
			background var(--fs-fast-duration) var(--fs-point-to-point),
			color var(--fs-fast-duration) var(--fs-point-to-point);
		&:hover:not(.disabled) {
			background: var(--fs-subtle-fill-secondary);
			color: var(--fs-segmented-control-text-color, var(--fs-text-primary));
		}
		&:active:not(.disabled) {
			background: var(--fs-subtle-fill-tertiary);
			color: var(--fs-segmented-control-text-color, var(--fs-text-tertiary));
		}
		&.selected {
			background: var(--fs-control-fill-default);
			color: var(--fs-segmented-control-text-color, var(--fs-text-primary));
			&:hover:not(.disabled) {
				background: var(--fs-control-fill-secondary);
			}
			&:active:not(.disabled) {
				background: var(--fs-control-fill-tertiary);
			}
			&::after {
				content: '';
				position: absolute;
				inset: 0;
				border-radius: inherit;
				padding: 1px;
				background: var(--fs-elevation-control-border);
				mask:
					linear-gradient(#000 0 0) content-box,
					linear-gradient(#000 0 0);
				mask-composite: exclude;
				pointer-events: none;
			}
			&.show-indicator::before {
				content: '';
				position: absolute;
				bottom: 1px;
				width: 1rem;
				height: 0.1875rem;
				border-radius: var(--fs-control-border-radius);
				background: var(--fs-accent-fill-default);
			}
			&:active::after,
			&.disabled::after {
				background: var(--fs-control-stroke-default);
			}
			&.disabled {
				background: var(--fs-control-fill-disabled);
				&::before {
					background: var(--fs-accent-fill-disabled);
				}
			}
		}
		&:has(input:focus-visible) {
			outline: 2px solid var(--fs-focus-stroke-outer);
			outline-offset: 1px;
			z-index: 1;
		}
		&.disabled {
			color: var(--fs-text-disabled);
			cursor: not-allowed;
		}
	}
	input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		z-index: 1;
		cursor: inherit;
	}
	label {
		display: contents;
	}
	.fs-segmented-control-item-icon {
		display: flex;
		flex: 0 0 auto;
		& :global(svg) {
			width: 1rem;
			height: 1rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fs-segmented-control-item {
			transition: none;
		}
	}
</style>
