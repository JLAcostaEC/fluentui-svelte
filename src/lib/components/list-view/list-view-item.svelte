<script lang="ts" generics="T extends 'li' | 'a' | 'div' = 'li'">
	import { onMount } from 'svelte';
	import { COMPONENT_NAME, getListViewContext, ITEM_TAG } from './utils.ts';
	import Checkbox from '../checkbox/checkbox.svelte';
	import { invokeHandlers, isObjectEmpty } from '$internal';
	import type { ListViewItemProps, ListViewItemDOM } from './types.ts';
	import { getTabspotAttributes } from 'tabspot';

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
		children,
		...attributes
	}: ListViewItemProps<T> = $props();

	// svelte-ignore state_referenced_locally
	if (!ITEM_TAG.includes(as)) throw new Error(`Invalid tag: ${as}. Must be one of ${ITEM_TAG.join(', ')}`);

	const CONTEXT = getListViewContext();

	if (!CONTEXT) throw new Error('ListViewItem must be used within a ListView');

	const { shape: _shape } = CONTEXT.config;
	const { state: _state } = CONTEXT;
	const { handleSelection, registerItem, unregisterItem, getChildrenRole } = CONTEXT.methods;
	const role = $derived(_role || getChildrenRole(as));

	let active = $derived(_state.selectedItems.includes(value));

	// A row is a level of its own: right enters the cells, left comes back out. Anything
	// that is not a row navigates as a plain item of the list above it.
	const tabspotAttrs = $derived(
		(role === 'row'
			? getTabspotAttributes({
					mover: {
						axis: 'vertical'
					},
					grouper: { enterDirection: 'right', exitDirection: 'left' }
				})
			: null) ?? {}
	);

	onMount(() => {
		registerItem?.(ID, value as string, !!disabled);
		return () => unregisterItem?.(ID);
	});
</script>

<svelte:element
	this={as}
	{role}
	data-value={value}
	aria-disabled={disabled || undefined}
	bind:this={ref as ListViewItemDOM[T]}
	class={[
		'fs-list-view-item',
		shape ? shape : _shape,
		classes,
		{ disabled },
		role !== 'row' && 'indicator',
		(_active || active) && 'active',
		!disabled && role && 'interactive'
	]}
	{...tabspotAttrs}
	onfocus={(e: FocusEvent) => invokeHandlers(e, disabled, [(event: FocusEvent) => onfocus?.(event, value || '')])}
	onclick={(e: MouseEvent) => {
		invokeHandlers(
			e,
			disabled,
			role !== 'row'
				? [
						(event: MouseEvent) => handleSelection?.(event, value),
						(event: MouseEvent) => onAction?.(event, value || '')
					]
				: [(event: MouseEvent) => onAction?.(event, value || '')]
		);
	}}
	{...attributes}
>
	{#if checkmark}
		<Checkbox {disabled} bind:checked={active} tabindex={-1} {...!isObjectEmpty(checkmark) ? checkmark : {}} />
	{/if}
	{@render children?.()}
</svelte:element>

<style>
	.fs-list-view-item {
		border-radius: var(--fs-control-border-radius);
		font-size: var(--fs-body2-font-size);
		color: var(--fs-text-primary);
		border: none;
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
</style>
