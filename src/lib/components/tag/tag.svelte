<script lang="ts">
	import PillButtonBase from '../pill-button/pill-button-base.svelte';
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';
	import { RenderSoC } from '#internal';
	import { PREFIX } from '#constants';
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
		primaryButtonAttributes,
		dismissButtonAttributes,
		class: classes,
		ref = $bindable(null),
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

	const primaryId = $derived(primaryButtonAttributes?.id ?? `${FALLBACK_ID}-primary`);
	const dismissId = $derived(dismissButtonAttributes?.id ?? `${FALLBACK_ID}-dismiss`);

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
		<span class="fs-tag-media"><RenderSoC SoC={media} args={{ shape }} /></span>
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

<PillButtonBase
	as={tag}
	appearance={_appearance}
	size={_size}
	{shape}
	selected={_selected}
	{...attributes}
	bind:ref
	class={[
		'fs-tag',
		interactive && 'interactive',
		_dismissible && 'dismissible',
		(media || icon) && 'leading',
		secondaryText && 'with-secondary',
		classes
	]}
	type={tag === 'button' ? 'button' : undefined}
	disabled={_disabled}
	onclick={rootClick}
	onkeydown={handleKeydown}
>
	{#if interactive}
		<button
			{...primaryButtonAttributes}
			type="button"
			class={['fs-tag-primary', primaryButtonAttributes?.class]}
			id={primaryId}
			disabled={_disabled}
			aria-pressed={group ? _selected : undefined}
			onclick={handlePrimaryClick}
		>
			{@render content()}
		</button>
		{#if _dismissible}
			<button
				{...dismissButtonAttributes}
				type="button"
				class={['fs-tag-dismiss', dismissButtonAttributes?.class]}
				id={dismissId}
				disabled={_disabled}
				aria-label={dismissButtonAttributes?.['aria-label'] ?? dismissLabel}
				aria-labelledby={dismissButtonAttributes?.['aria-labelledby'] ??
					(dismissButtonAttributes?.['aria-label'] ? undefined : `${primaryId} ${dismissId}`)}
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
</PillButtonBase>

<style>
	:global {
		.fs-tag {
			/* A plain tag: a single box, a button when it is dismissible. */
			&:not(.interactive) {
				display: inline-grid;
				grid-template-areas:
					'media primary dismiss'
					'media secondary dismiss';
				align-items: center;
				padding: 0;
				padding-inline: var(--pill-spacing);
				background: var(--pill-bg);
				border: 1px solid var(--pill-border);
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
				background: var(--pill-bg);
				border: 1px solid var(--pill-border);
				cursor: pointer;
				&:hover {
					background: var(--pill-bg-hover);
				}
				&:active {
					background: var(--pill-bg-pressed);
				}
				&:focus-visible {
					position: relative;
					z-index: 1;
					outline: 0.125rem solid var(--fs-focus-stroke-outer);
					outline-offset: 0.063rem;
				}
				&:disabled {
					cursor: not-allowed;
					background: var(--pill-bg);
				}
			}
			& .fs-tag-primary {
				display: inline-grid;
				grid-template-areas:
					'media primary'
					'media secondary';
				align-items: center;
				text-align: start;
				border-radius: var(--pill-radius);
				padding-inline: var(--pill-spacing);
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
				padding-inline: var(--pill-dismiss-spacing);
				font-size: var(--pill-icon-size);
				border-inline-start-color: var(--pill-divider);
				border-start-start-radius: 0;
				border-end-start-radius: 0;
				border-start-end-radius: var(--pill-radius);
				border-end-end-radius: var(--pill-radius);
				&:hover {
					color: var(--pill-danger);
				}
				&:active {
					color: var(--pill-danger-pressed);
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
					color: var(--pill-fg);
					border-inline-start-color: var(--pill-divider);
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
				padding-inline: 1px var(--pill-media-gap);
			}
			& .fs-tag-icon {
				box-sizing: content-box;
				width: var(--pill-icon-size);
				padding-inline: var(--pill-spacing) var(--pill-icon-gap);
				font-size: var(--pill-icon-size);
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
				padding-inline: var(--pill-icon-gap) var(--pill-spacing);
				font-size: var(--pill-icon-size);
				border-start-end-radius: calc(var(--pill-radius) - 1px);
				border-end-end-radius: calc(var(--pill-radius) - 1px);
				&:hover {
					cursor: pointer;
					color: var(--pill-danger);
				}
				&:active {
					color: var(--pill-danger-pressed);
				}
			}
			&.selected .fs-tag-dismiss-icon:hover,
			&.selected .fs-tag-dismiss-icon:active {
				color: var(--pill-fg);
			}
			/* A selected tag lightens the area of the dismiss, as the dismiss button of an interactive one does. */
			&.selected:not(.disabled) .fs-tag-dismiss-icon {
				&:hover {
					background: color-mix(in srgb, var(--pill-fg) 16%, transparent);
				}
				&:active {
					background: color-mix(in srgb, var(--pill-fg) 33%, transparent);
				}
			}
			&.disabled .fs-tag-dismiss-icon {
				&:hover {
					cursor: not-allowed;
					color: inherit;
				}
			}

			& :global(svg) {
				width: var(--pill-icon-size);
				height: var(--pill-icon-size);
			}
		}
	}
</style>
