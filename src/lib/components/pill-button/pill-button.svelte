<script lang="ts">
	import { untrack } from 'svelte';
	import { RenderSoC } from '#internal';
	import { PREFIX } from '#constants';
	import { claimLabel } from '../label/label-context.ts';
	import PillButtonBase from './pill-button-base.svelte';
	import type { PillButtonProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}pill-button-${FALLBACK_ID}`;
	const labelContext = claimLabel(() => id);

	let {
		ref = $bindable(null),
		wrapperRef = $bindable(null),
		defaultChecked = false,
		checked = $bindable(undefined),
		id = labelContext?.fieldId ?? ID,
		appearance = 'filled',
		size = 'medium',
		shape = 'circular',
		disabled,
		wrapperAttributes,
		icon,
		media,
		children,
		'aria-labelledby': labelledby,
		'aria-label': label,
		...attributes
	}: PillButtonProps = $props();

	// Initialize without a prop fallback so an initially undefined binding is supported.
	if (checked == null) checked = untrack(() => defaultChecked ?? false);
</script>

<PillButtonBase
	{...wrapperAttributes}
	bind:ref={wrapperRef}
	{appearance}
	{size}
	{shape}
	selected={checked ?? defaultChecked ?? false}
	{disabled}
	class={['fs-pill-button', wrapperAttributes?.class]}
>
	<input
		{...attributes}
		{id}
		type="checkbox"
		{disabled}
		{defaultChecked}
		aria-label={label}
		aria-labelledby={labelledby ??
			(label ? undefined : (labelContext?.labelId ?? (children ? `${id}-label` : undefined)))}
		bind:checked
		bind:this={ref}
	/>
	{#if media}
		<span class="fs-pill-button-media" aria-hidden="true"><RenderSoC SoC={media} args={{ shape }} /></span>
	{:else if icon}
		<span class="fs-pill-button-icon" aria-hidden="true"><RenderSoC SoC={icon} /></span>
	{/if}
	{#if children}
		<span class="fs-pill-button-text" id={`${id}-label`}>{@render children()}</span>
	{/if}
</PillButtonBase>

<style>
	:global {
		.fs-pill-button {
			--pill-action-icon-size: 1rem;
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 0.375rem;
			padding-inline: 0.875rem;
			background: var(--pill-bg);
			border: 1px solid var(--pill-border);
			cursor: pointer;
			transition:
				background-color var(--fs-fast-duration, 167ms),
				color var(--fs-fast-duration, 167ms);

			&::after {
				content: '';
				position: absolute;
				inset: -1px;
				padding: 1px;
				border-radius: inherit;
				background: var(--fs-elevation-control-border);
				mask:
					linear-gradient(#fff 0 0) content-box,
					linear-gradient(#fff 0 0);
				mask-composite: exclude;
				pointer-events: none;
			}
			&.selected::after {
				background: var(--fs-elevation-accent-control-border);
			}
			&.outline::after,
			&.brand::after,
			&:has(input:active)::after,
			&:has(input:disabled)::after,
			&:has(input:user-invalid)::after,
			&:has(input[aria-invalid='true'])::after {
				background: none;
			}

			&.filled:not(.selected):not(.disabled) {
				--pill-bg: var(--fs-control-fill-default);
				--pill-bg-hover: var(--fs-control-fill-secondary);
				--pill-bg-pressed: var(--fs-control-fill-tertiary);
			}
			&.small {
				padding-inline: 0.625rem;
			}
			&.large {
				--pill-action-icon-size: 1.25rem;
				padding-inline: 1rem;
			}
			&.extra-large {
				--pill-action-icon-size: 1.5rem;
				padding-inline: 1.25rem;
			}
			&:has(> .fs-pill-button-icon) {
				padding-inline-start: calc((var(--pill-height) - var(--pill-action-icon-size)) / 2 - 1px);
			}
			&:has(> .fs-pill-button-icon):not(:has(> .fs-pill-button-text)) {
				width: var(--pill-height);
				padding: 0;
			}
			&:has(> .fs-pill-button-media) {
				--pill-avatar-size: calc(var(--pill-height) - 0.5rem);
				padding-inline-start: 0.1875rem;
			}
			& > .fs-pill-button-text {
				display: inline-flex;
				align-items: center;
				gap: inherit;
			}
			& > .fs-pill-button-media {
				display: inline-flex;
				align-items: center;
				flex: none;
				width: var(--pill-avatar-size);
				height: var(--pill-avatar-size);
				& > * {
					width: 100%;
					height: 100%;
				}
				& > .fs-avatar {
					flex: none;
					width: var(--pill-avatar-size);
					height: var(--pill-avatar-size);
					font-size: calc(var(--pill-avatar-size) / 2.4);
					& img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
			}
			&:not(.disabled):not(:has(input:disabled)):hover {
				background: var(--pill-bg-hover);
			}
			&:has(input:active):not(.disabled):not(:has(input:disabled)) {
				background: var(--pill-bg-pressed);
			}
			&:has(input:focus-visible) {
				outline: 0.125rem solid var(--fs-focus-stroke-outer);
				outline-offset: 0.125rem;
			}
			&:has(input:user-invalid),
			&:has(input[aria-invalid='true']) {
				border-color: var(--fs-system-critical);
				color: var(--fs-system-critical);
			}
			&.disabled,
			&:has(input:disabled) {
				color: var(--fs-text-disabled);
				background: var(--fs-control-fill-disabled);
				border-color: var(--fs-control-stroke-default);
				cursor: not-allowed;
			}
			&.selected:is(.disabled, :has(input:disabled)) {
				background: var(--fs-accent-fill-disabled);
				color: var(--fs-text-on-accent-disabled);
			}
			& > input {
				position: absolute;
				z-index: 1;
				inset: 0;
				width: 100%;
				height: 100%;
				margin: 0;
				opacity: 0;
				cursor: inherit;
			}
			& > .fs-pill-button-icon {
				display: inline-flex;
				flex: none;
				font-size: var(--pill-action-icon-size);
				& :global(svg) {
					width: var(--pill-action-icon-size);
					height: var(--pill-action-icon-size);
				}
			}
		}
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.fs-pill-button) {
			transition: none;
		}
	}
</style>
