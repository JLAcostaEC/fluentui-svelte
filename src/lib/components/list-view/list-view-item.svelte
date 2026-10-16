<script lang="ts" generics="T extends 'li' | 'a' | 'button' | 'div' = 'li'">
	import { onMount } from 'svelte';
	import {
		attachTabspot,
		COMPONENT_NAME,
		getListViewContext,
		ITEM_TAG,
		LIST_VIEW_SKIP,
		setListViewItemContext
	} from './utils.ts';
	import Checkbox from '../checkbox/checkbox.svelte';
	import { invokeHandlers, isObjectEmpty } from '$internal';
	import type { ListViewItemProps, ListViewItemDOM } from './types.ts';
	import { getTabspotAttributes, type TabspotNodeOptions } from 'tabspot';

	const ID = $props.id();

	let {
		as = 'li' as T,
		ref = $bindable(),
		shape,
		disabled,
		active: _active,
		role: _role,
		checkmark,
		value = COMPONENT_NAME + '-' + ID,
		class: classes,
		onAction,
		onfocus,
		onclick,
		onkeydown,
		children,
		...attributes
	}: ListViewItemProps<T> = $props();

	/**
	 * The tag the invariant rules over. The markup renders it through here, so it is checked
	 * during SSR and on every prop update rather than only once on mount.
	 */
	const _as = $derived.by(() => {
		if (!ITEM_TAG.includes(as)) throw new Error(`Invalid tag: ${as}. Must be one of ${ITEM_TAG.join(', ')}`);
		if (as === 'button' && (checkmark || role === 'row')) {
			throw new Error('ListViewItem buttons cannot contain checkmarks or composite row controls. Use li or div.');
		}
		return as;
	});

	const CONTEXT = getListViewContext();

	if (!CONTEXT) throw new Error('ListViewItem must be used within a ListView');

	const _shape = $derived(CONTEXT.config.shape);
	const { state: _state } = CONTEXT;
	const { handleSelection, registerItem, unregisterItem, getChildrenRole } = CONTEXT.methods;
	const role = $derived(_role || getChildrenRole(as));
	const wrapped = $derived((as === 'a' || as === 'button') && CONTEXT.config.as !== 'div');
	const nativeAction = $derived(as === 'a' || as === 'button');
	const interactive = $derived(
		nativeAction || !!_role || CONTEXT.config.selectionMode !== 'none' || !!onAction || !!onclick
	);
	const tabspotDisabled = $derived(CONTEXT.config.disableTabspot);
	setListViewItemContext({
		get as() {
			return as;
		}
	});

	let active = $derived(_state.selectedItems.includes(value));
	let checkmarkRef = $state<HTMLDivElement>();

	// A grid cell contains the secondary controls, independently of the primary row action.
	const cellConfig: TabspotNodeOptions | undefined = $derived(
		role === 'row' && !tabspotDisabled
			? {
					// Checkbox inputs are transparent while their visible wrappers supply the focus ring.
					mover: {
						axis: 'horizontal',
						skip: LIST_VIEW_SKIP
					},
					grouper: { enterDirection: 'right', exitDirection: 'left' }
				}
			: undefined
	);
	const cellAttrs = $derived(cellConfig && getTabspotAttributes(cellConfig));
	const focusAttributes = $derived(
		nativeAction
			? disabled && as === 'a'
				? { tabindex: -1 }
				: {}
			: interactive && !tabspotDisabled
				? { tabindex: disabled ? -1 : 0 }
				: {}
	);

	function handleClick(e: MouseEvent) {
		const target = e.target instanceof Element ? e.target : null;
		if (target?.closest('.fs-list-view-item') !== e.currentTarget) return;
		const fromCheckmark = !!checkmarkRef?.contains(target);
		const control = target?.closest(
			'a, button, input, select, textarea, [contenteditable="true"], [role="button"], [role="link"]'
		);
		if (!fromCheckmark && control && control !== e.currentTarget) return;
		invokeHandlers(e, disabled, [
			onclick,
			(role !== 'row' || fromCheckmark) && ((event: MouseEvent) => handleSelection(event, value, fromCheckmark)),
			!fromCheckmark && ((event: MouseEvent) => onAction?.(event, value))
		]);
	}

	function handleKeydown(e: KeyboardEvent) {
		invokeHandlers(e, disabled, [onkeydown]);
		if (e.defaultPrevented || nativeAction || e.target !== e.currentTarget || !['Enter', ' '].includes(e.key)) return;
		e.preventDefault();
		(e.currentTarget as HTMLElement).dispatchEvent(
			new MouseEvent('click', {
				bubbles: true,
				ctrlKey: e.ctrlKey,
				metaKey: e.metaKey,
				shiftKey: e.shiftKey
			})
		);
	}

	onMount(() => {
		registerItem(ID, () => ({ value, disabled: !!disabled, element: ref ?? null }));
		return () => unregisterItem(ID);
	});
</script>

{#snippet content()}
	{#if checkmark}
		<Checkbox
			{...!isObjectEmpty(checkmark) ? checkmark : {}}
			{disabled}
			bind:checked={active}
			bind:wrapperRef={checkmarkRef}
			tabindex={tabspotDisabled ? undefined : -1}
			aria-label={checkmark?.['aria-label'] ?? attributes['aria-label'] ?? value}
		/>
	{/if}
	{@render children?.()}
{/snippet}

{#snippet item()}
	<svelte:element
		this={_as}
		{...attributes}
		role={wrapped || (nativeAction && role === 'listitem') ? undefined : role}
		type={as === 'button' ? 'button' : undefined}
		disabled={as === 'button' ? disabled : undefined}
		data-value={value}
		data-list-view-interactive={interactive || undefined}
		aria-selected={!wrapped && (role === 'option' || role === 'row') ? active : undefined}
		aria-current={role !== 'option' && role !== 'row' && (_active || active) ? 'true' : undefined}
		aria-disabled={disabled || undefined}
		bind:this={ref as ListViewItemDOM[T]}
		class={[
			'fs-list-view-item',
			shape ? shape : _shape,
			classes,
			{ disabled },
			role !== 'row' && 'indicator',
			(_active || active) && 'active',
			!disabled && interactive && 'interactive'
		]}
		{...focusAttributes}
		onfocus={(e: FocusEvent) => {
			if (e.target === e.currentTarget) invokeHandlers(e, disabled, [() => onfocus?.(e, value)]);
		}}
		onclick={handleClick}
		onkeydown={handleKeydown}
	>
		{#if role === 'row'}
			<div role="gridcell" {...cellAttrs} {@attach attachTabspot(cellConfig)}>
				{@render content()}
			</div>
		{:else}
			{@render content()}
		{/if}
	</svelte:element>
{/snippet}

{#if wrapped}
	<li {role} aria-selected={role === 'option' || role === 'row' ? active : undefined} class="fs-list-view-item-wrapper">
		{@render item()}
	</li>
{:else}
	{@render item()}
{/if}

<style>
	.fs-list-view-item-wrapper {
		list-style: none;
		& > :global(.fs-list-view-item) {
			width: 100%;
			box-sizing: border-box;
			text-align: start;
		}
	}
	.fs-list-view-item-wrapper,
	.fs-list-view-item:has(> :global(.fs-list-view)) {
		& > :global(.fs-list-view) {
			padding-inline-start: 1rem;
			box-sizing: border-box;
		}
	}
	.fs-list-view-item:has(> :global(.fs-list-view)) {
		display: block;
	}
	[role='gridcell'] {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		width: 100%;
	}
	.fs-list-view-item {
		border-radius: var(--fs-control-border-radius);
		font-size: var(--fs-body2-font-size);
		color: var(--fs-text-primary);
		border: none;
		background: var(--fs-subtle-fill-transparent);
		padding: 0.275rem 0.713rem 0.4rem 0.713rem;
		position: relative;
		outline: none;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		text-decoration: none;
		user-select: none;
		&[disabled],
		&[aria-disabled='true'] {
			cursor: not-allowed;
			background: var(--fs-subtle-fill-transparent) !important;
			color: var(--fs-text-disabled) !important;
		}

		&.interactive {
			cursor: pointer;
			&:focus-visible,
			&[data-active='true'] {
				outline: 0.125rem var(--fs-focus-stroke-outer) solid;
				outline-offset: 0.063rem;
			}
			&.indicator {
				&:hover {
					background: var(--fs-subtle-fill-secondary);
				}
				&:active {
					color: var(--fs-text-tertiary);
					background: var(--fs-subtle-fill-tertiary);
				}
				&::after {
					content: '';
					position: absolute;
					top: 50%;
					left: 0;
					width: 3px;
					height: 0;
					transform: translateY(-50%);
					background-color: var(--fs-accent-fill-default);
					border-radius: var(--fs-control-border-radius);
					pointer-events: none;
				}
				&.active {
					background: var(--fs-subtle-fill-tertiary);
					&::after {
						transition: height var(--fs-normal-duration) var(--fs-fast-dismiss);
						height: 50%;
					}
				}
			}
		}
		&.disabled {
			cursor: not-allowed;
			color: var(--fs-text-disabled) !important;
		}
		&.rounded,
		&.rounded:after {
			border-radius: var(--fs-control-border-radius);
		}
		&.circular,
		&.circular:after {
			border-radius: 50vw;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fs-list-view-item.interactive.indicator.active::after {
			transition: none;
		}
	}
</style>
