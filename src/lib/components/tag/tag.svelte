<script lang="ts">
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';
	import { RenderSoC } from '$internal';
	import { PREFIX } from '$constants';
	import { getTagGroupContext } from './tag-group.ts';
	import type { TagProps } from './types.ts';

	const ID = $props.id();
	const FALLBACK_ID = PREFIX + '-tag-' + ID;

	let {
		appearance,
		size,
		shape = 'circular',
		disabled,
		selected = false,
		dismissible,
		interactive = false,
		value = FALLBACK_ID,
		icon,
		media,
		secondaryText,
		dismissIcon = DismissRegular,
		dismissLabel = 'Dismiss',
		onDismiss,
		onclick,
		onkeydown,
		primaryProps,
		dismissProps,
		class: classes,
		ref = $bindable(),
		children,
		...attributes
	}: TagProps = $props();

	const group = getTagGroupContext();

	const _appearance = $derived(appearance ?? group?.config.appearance ?? 'filled');
	const _size = $derived(size ?? group?.config.size ?? 'medium');
	const _dismissible = $derived(dismissible ?? group?.config.dismissible ?? false);
	const _disabled = $derived(!!(disabled || group?.config.disabled));
	const _selected = $derived(interactive && group ? group.state.selectedValues.includes(value) : selected);

	/** A plain tag is the dismiss button itself when it is dismissible. An interactive one holds its own buttons. */
	const tag = $derived(interactive ? 'div' : _dismissible ? 'button' : 'span');

	const primaryId = $derived(primaryProps?.id ?? `${FALLBACK_ID}-primary`);
	const dismissId = $derived(dismissProps?.id ?? `${FALLBACK_ID}-dismiss`);

	/** The dismiss icon names the button, unless the consumer named the tag itself. */
	const named = $derived(!!(attributes['aria-label'] || attributes['aria-labelledby']));

	const dismiss = (e: MouseEvent | KeyboardEvent) => {
		onDismiss?.(e, value);
		group?.methods.dismiss(e, value);
	};

	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		dismiss(e);
	};

	const handlePrimaryClick = (e: MouseEvent) => {
		onclick?.(e);
		group?.methods.select(e, value);
	};

	const handleKeydown = (e: KeyboardEvent) => {
		onkeydown?.(e);
		if (_dismissible && !_disabled && (e.key === 'Delete' || e.key === 'Backspace')) dismiss(e);
	};

	const rootClick = $derived(tag === 'button' ? handleClick : tag === 'span' ? onclick : undefined);
</script>

<!--
	@component
	Fluent UI Tag: A visual representation of an attribute, person or asset.
	It can be dismissible, and with `interactive` it becomes an interaction tag that has a primary action of its own.
	- Usage:
    ```tsx
		<script>
			import { Tag } from 'fluentui-svelte';
			import { CalendarMonthRegular } from 'fluentui-icons-svelte';
		</script>

		<Tag icon={CalendarMonthRegular} dismissible onDismiss={(e, value) => remove(value)}>
			Primary text
		</Tag>
		```
-->
{#snippet content()}
	{#if media}
		<span class="fs-tag-media"><RenderSoC SoC={media} /></span>
	{:else if icon}
		<span class="fs-tag-icon" aria-hidden="true"><RenderSoC SoC={icon} /></span>
	{/if}
	<span class="fs-tag-primary-text">{@render children?.()}</span>
	{#if secondaryText}
		<span class="fs-tag-secondary-text">
			{#if typeof secondaryText === 'string'}
				{secondaryText}
			{:else}
				{@render secondaryText()}
			{/if}
		</span>
	{/if}
{/snippet}

<svelte:element
	this={tag}
	bind:this={ref}
	class={[
		'fs-tag',
		_size,
		_appearance,
		shape,
		interactive && 'interactive',
		_selected && 'selected',
		_disabled && 'disabled',
		_dismissible && 'dismissible',
		(media || icon) && 'leading',
		secondaryText && 'with-secondary',
		classes
	]}
	type={tag === 'button' ? 'button' : undefined}
	disabled={tag === 'button' ? _disabled : undefined}
	{...attributes}
	onclick={rootClick}
	onkeydown={handleKeydown}
>
	{#if interactive}
		<button
			type="button"
			class="fs-tag-primary"
			id={primaryId}
			disabled={_disabled}
			aria-pressed={group ? _selected : undefined}
			{...primaryProps}
			onclick={handlePrimaryClick}
		>
			{@render content()}
		</button>
		{#if _dismissible}
			<button
				type="button"
				class="fs-tag-dismiss"
				id={dismissId}
				disabled={_disabled}
				aria-label={dismissLabel}
				aria-labelledby="{primaryId} {dismissId}"
				{...dismissProps}
				onclick={dismiss}
			>
				<RenderSoC SoC={dismissIcon} />
			</button>
		{/if}
	{:else}
		{@render content()}
		{#if _dismissible}
			<span
				class="fs-tag-dismiss-icon"
				role={named ? undefined : 'img'}
				aria-label={named ? undefined : dismissLabel}
				aria-hidden={named ? 'true' : undefined}
			>
				<RenderSoC SoC={dismissIcon} />
			</span>
		{/if}
	{/if}
</svelte:element>

<style>
	.fs-tag {
		--tag-spacing: 0.4375rem;
		--tag-icon-size: 1.25rem;
		--tag-icon-gap: 0.25rem;
		--tag-media-gap: 0.5rem;
		--tag-dismiss-spacing: 0.3125rem;
		--tag-height: 2rem;
		--tag-font-size: var(--fs-body2-font-size);
		--tag-line-height: var(--fs-body2-line-height);
		--tag-radius: var(--fs-control-border-radius);
		/* Changed from original --fs-control-fill-quaternary to --fs-control-fill-secondary */
		--tag-bg: var(--fs-control-fill-secondary);
		--tag-bg-hover: var(--fs-control-alt-fill-quaternary);
		--tag-bg-pressed: var(--fs-control-alt-fill-secondary);
		--tag-fg: var(--fs-text-primary);
		--tag-border: var(--fs-control-stroke-default);
		--tag-divider: var(--fs-control-stroke-secondary);
		--tag-danger: var(--fs-system-critical);
		--tag-danger-pressed: color-mix(in srgb, var(--fs-system-critical), black 15%);

		box-sizing: border-box;
		width: fit-content;
		height: var(--tag-height);
		margin: 0;
		color: var(--tag-fg);
		font-family: inherit;
		font-size: var(--tag-font-size);
		line-height: var(--tag-line-height);
		text-align: start;
		user-select: none;
		border-radius: var(--tag-radius);

		&.small {
			--tag-spacing: 0.3125rem;
			--tag-icon-size: 1rem;
			--tag-icon-gap: 0.125rem;
			--tag-media-gap: 0.375rem;
			--tag-dismiss-spacing: 0.1875rem;
			--tag-height: 1.5rem;
			--tag-font-size: var(--fs-caption-font-size);
			--tag-line-height: var(--fs-caption-line-height);
		}
		&.extra-small {
			--tag-spacing: 0.3125rem;
			--tag-icon-size: 0.75rem;
			--tag-icon-gap: 0.125rem;
			--tag-media-gap: 0.375rem;
			--tag-height: 1.25rem;
			--tag-font-size: var(--fs-caption-font-size);
			--tag-line-height: var(--fs-caption-line-height);
		}
		&.circular {
			--tag-radius: 9999rem;
		}
		&.square {
			--tag-radius: 0;
		}

		&.outline {
			--tag-bg: transparent;
			--tag-bg-hover: var(--fs-subtle-fill-secondary);
			--tag-bg-pressed: var(--fs-subtle-fill-tertiary);
			--tag-border: var(--fs-control-stroke-secondary);
		}
		&.brand {
			--tag-bg: var(--fs-system-attention-bg);
			--tag-bg-hover: color-mix(in srgb, var(--fs-system-attention-bg), rgb(var(--fs-accent-base)) 10%);
			--tag-bg-pressed: color-mix(in srgb, var(--fs-system-attention-bg), rgb(var(--fs-accent-base)) 18%);
			--tag-fg: var(--fs-accent-text-primary);
			--tag-divider: color-mix(in srgb, rgb(var(--fs-accent-base)), transparent 70%);
		}
		&.selected {
			--tag-bg: var(--fs-accent-fill-default);
			--tag-bg-hover: var(--fs-accent-fill-secondary);
			--tag-bg-pressed: var(--fs-accent-fill-tertiary);
			--tag-fg: var(--fs-text-on-accent-primary);
			--tag-border: var(--fs-accent-fill-default);
			--tag-divider: var(--fs-control-stroke-on-accent-secondary);
		}
		&.disabled {
			--tag-bg: var(--fs-control-alt-fill-secondary);
			--tag-bg-hover: var(--fs-control-alt-fill-secondary);
			--tag-bg-pressed: var(--fs-control-alt-fill-secondary);
			--tag-fg: var(--fs-text-disabled);
			--tag-border: transparent;
			--tag-divider: var(--fs-control-stroke-default);
			&.outline {
				--tag-bg: transparent;
				--tag-bg-hover: transparent;
				--tag-bg-pressed: transparent;
				--tag-border: var(--fs-control-stroke-default);
			}
		}

		/* A plain tag: a single box, a button when it is dismissible. */
		&:not(.interactive) {
			display: inline-grid;
			grid-template-areas:
				'media primary dismiss'
				'media secondary dismiss';
			align-items: center;
			padding: 0;
			padding-inline: var(--tag-spacing);
			background: var(--tag-bg);
			border: 1px solid var(--tag-border);
			&.leading {
				padding-inline-start: 0;
			}
			&.dismissible {
				padding-inline-end: 0;
			}
			&:focus-visible {
				outline: 0.125rem solid var(--fs-focus-stroke-outer);
				outline-offset: 0.063rem;
			}
		}
		&.disabled:not(.interactive) {
			cursor: not-allowed;
		}

		/* An interaction tag: a primary button, followed by the dismiss button. */
		&.interactive {
			display: inline-flex;
			align-items: center;
		}

		& .fs-tag-primary,
		& .fs-tag-dismiss {
			box-sizing: border-box;
			height: 100%;
			margin: 0;
			padding: 0;
			color: inherit;
			font: inherit;
			background: var(--tag-bg);
			border: 1px solid var(--tag-border);
			cursor: pointer;
			&:hover {
				background: var(--tag-bg-hover);
			}
			&:active {
				background: var(--tag-bg-pressed);
			}
			&:focus-visible {
				position: relative;
				z-index: 1;
				outline: 0.125rem solid var(--fs-focus-stroke-outer);
				outline-offset: 0.063rem;
			}
			&:disabled {
				cursor: not-allowed;
				background: var(--tag-bg);
			}
		}
		& .fs-tag-primary {
			display: inline-grid;
			grid-template-areas:
				'media primary'
				'media secondary';
			align-items: center;
			text-align: start;
			border-radius: var(--tag-radius);
			padding-inline: var(--tag-spacing);
		}
		&.leading .fs-tag-primary {
			padding-inline-start: 0;
		}
		&.dismissible .fs-tag-primary {
			border-inline-end: none;
			border-start-end-radius: 0;
			border-end-end-radius: 0;
		}
		& .fs-tag-dismiss {
			display: flex;
			align-items: center;
			padding-inline: var(--tag-dismiss-spacing);
			font-size: var(--tag-icon-size);
			border-inline-start-color: var(--tag-divider);
			border-start-start-radius: 0;
			border-end-start-radius: 0;
			border-start-end-radius: var(--tag-radius);
			border-end-end-radius: var(--tag-radius);
			&:hover {
				color: var(--tag-danger);
			}
			&:active {
				color: var(--tag-danger-pressed);
			}
		}
		/* The selected hover and pressed fills are translucent: drop the opaque rim so the fill is a single colour. */
		&.selected .fs-tag-primary,
		&.selected .fs-tag-dismiss {
			&:hover,
			&:active {
				border-color: transparent;
			}
		}
		&.selected .fs-tag-dismiss {
			&:hover,
			&:active {
				color: var(--tag-fg);
				border-inline-start-color: var(--tag-divider);
			}
		}
		&.disabled .fs-tag-dismiss:hover {
			color: inherit;
		}

		& .fs-tag-media,
		& .fs-tag-icon {
			grid-area: media;
			display: flex;
			align-items: center;
		}
		& .fs-tag-media {
			padding-inline: 1px var(--tag-media-gap);
		}
		& .fs-tag-icon {
			box-sizing: content-box;
			width: var(--tag-icon-size);
			padding-inline: var(--tag-spacing) var(--tag-icon-gap);
			font-size: var(--tag-icon-size);
		}
		& .fs-tag-primary-text {
			grid-area: primary;
			grid-row: 1 / 3;
			padding-inline: 0.125rem;
			white-space: nowrap;
		}
		&.with-secondary .fs-tag-primary-text {
			grid-row: 1;
			margin-block-start: -0.125rem;
			font-size: var(--fs-caption-font-size);
			line-height: var(--fs-caption-line-height);
		}
		& .fs-tag-secondary-text {
			grid-area: secondary;
			padding-inline: 0.125rem;
			font-size: var(--fs-caption2-font-size);
			line-height: var(--fs-caption2-line-height);
			white-space: nowrap;
		}
		& .fs-tag-dismiss-icon {
			grid-area: dismiss;
			display: flex;
			align-items: center;
			align-self: stretch;
			padding-inline: var(--tag-icon-gap) var(--tag-spacing);
			font-size: var(--tag-icon-size);
			border-start-end-radius: calc(var(--tag-radius) - 1px);
			border-end-end-radius: calc(var(--tag-radius) - 1px);
			&:hover {
				cursor: pointer;
				color: var(--tag-danger);
			}
			&:active {
				color: var(--tag-danger-pressed);
			}
		}
		&.selected .fs-tag-dismiss-icon:hover,
		&.selected .fs-tag-dismiss-icon:active {
			color: var(--tag-fg);
		}
		/* A selected tag lightens the area of the dismiss, as the dismiss button of an interactive one does. */
		&.selected:not(.disabled) .fs-tag-dismiss-icon {
			&:hover {
				background: color-mix(in srgb, var(--tag-fg) 16%, transparent);
			}
			&:active {
				background: color-mix(in srgb, var(--tag-fg) 33%, transparent);
			}
		}
		&.disabled .fs-tag-dismiss-icon {
			&:hover {
				cursor: not-allowed;
				color: inherit;
			}
		}

		& :global(svg) {
			width: var(--tag-icon-size);
			height: var(--tag-icon-size);
		}
	}
</style>
