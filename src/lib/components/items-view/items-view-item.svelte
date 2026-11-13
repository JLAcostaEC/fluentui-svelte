<script lang="ts">
	import { onMount } from 'svelte';
	import { invokeHandlers } from '#internal';
	import Checkbox from '../checkbox/checkbox.svelte';
	import { COMPONENT_NAME, getItemsViewContext } from './utils.ts';
	import type { ItemsViewItemProps } from './types.ts';

	const ID = $props.id();

	let {
		value = `${COMPONENT_NAME}-${ID}`,
		disabled = false,
		ref = $bindable(null),
		onclick,
		ondblclick,
		onkeydown,
		children,
		class: classes,
		...attributes
	}: ItemsViewItemProps = $props();

	const CONTEXT = getItemsViewContext();

	if (!CONTEXT) throw new Error('ItemsViewItem must be used within an ItemsView');

	const { config, state: _state } = CONTEXT;
	const { select, invoke, registerItem, unregisterItem, claimTabStop } = CONTEXT.methods;

	const selectable = $derived(config.selectionMode !== 'none');
	const interactive = $derived(selectable || config.invokable);
	const selected = $derived(selectable && _state.selectedItems.includes(value));

	// A roving view has one tab stop. Tabspot sets it on mount, so the server HTML gives it to the first item, as Tabspot will.
	// svelte-ignore state_referenced_locally
	const holdsTabStop = !config.roving || (interactive && !disabled && claimTabStop(ID));

	function handleClick(e: MouseEvent) {
		invokeHandlers(e, disabled, [
			onclick,
			(event: MouseEvent) => (selectable ? select(event, value) : invoke(event, value))
		]);
	}

	function handleDblclick(e: MouseEvent) {
		invokeHandlers(e, disabled, [ondblclick, selectable && ((event: MouseEvent) => invoke(event, value))]);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (disabled) return;
		invokeHandlers(e, false, [onkeydown]);
		if (e.defaultPrevented || e.target !== e.currentTarget || !['Enter', ' '].includes(e.key)) return;
		e.preventDefault();
		if (e.key === 'Enter' && config.invokable) invoke(e, value);
		else select(e, value);
	}

	onMount(() => {
		registerItem(ID, () => ({ value, disabled, element: ref }));
		return () => unregisterItem(ID);
	});
</script>

<!-- An invokable item of a plain list is a focusable listitem. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	{...attributes}
	bind:this={ref}
	class={[`${COMPONENT_NAME}-item`, classes]}
	role={selectable ? 'option' : 'listitem'}
	aria-selected={selectable ? selected : undefined}
	aria-disabled={disabled || undefined}
	data-value={value}
	data-items-view-interactive={interactive || undefined}
	tabindex={interactive ? (disabled || !holdsTabStop ? -1 : 0) : undefined}
	onclick={handleClick}
	ondblclick={handleDblclick}
	onkeydown={handleKeydown}
>
	{@render children?.()}
	{#if selectable && config.showCheckboxes}
		<!-- A visual cue only: the option reports its state, and an empty name keeps it out of form data. -->
		<Checkbox
			checked={selected}
			{disabled}
			name=""
			tabindex={-1}
			wrapperAttributes={{ class: `${COMPONENT_NAME}-item-checkbox`, inert: true }}
		/>
	{/if}
</div>

<style>
	.fs-items-view-item {
		position: relative;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		min-inline-size: 0;
		border-radius: var(--fs-control-border-radius);
		color: var(--fs-text-primary);
		font-size: var(--fs-body2-font-size);
		outline: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;

		/* Hover, pressed and selected strokes sit inside the item, above its media. */
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			z-index: 1;
			border: 1px solid transparent;
			border-radius: inherit;
			pointer-events: none;
			transition:
				border-color var(--fs-fast-duration) var(--fs-fast-dismiss),
				background-color var(--fs-fast-duration) var(--fs-fast-dismiss);
		}

		& > :global(img),
		& > :global(video) {
			display: block;
			inline-size: 100%;
			block-size: 100%;
			object-fit: cover;
			border-radius: inherit;
		}

		&[data-items-view-interactive] {
			cursor: pointer;
			&:hover::after {
				border-color: var(--fs-control-strong-stroke-default);
			}
			&:active::after {
				border-color: var(--fs-control-strong-stroke-disabled);
				background-color: var(--fs-subtle-fill-tertiary);
			}
			&:focus-visible {
				outline: 2px solid var(--fs-focus-stroke-outer);
				outline-offset: 1px;
			}
		}

		&[aria-selected='true']::after {
			border: 2px solid var(--fs-accent-fill-default);
			box-shadow: inset 0 0 0 1px var(--fs-focus-stroke-inner);
		}
		&[aria-selected='true']:hover::after {
			border-color: var(--fs-accent-fill-secondary);
		}
		&[aria-selected='true']:active::after {
			border-color: var(--fs-accent-fill-tertiary);
		}

		&[aria-disabled='true'] {
			cursor: not-allowed;
			opacity: 0.4;
			&::after {
				border-color: transparent !important;
				background-color: transparent !important;
			}
		}

		& :global(.fs-items-view-item-checkbox) {
			position: absolute;
			inset-block-start: 0.375rem;
			inset-inline-end: 0.375rem;
			z-index: 2;
		}
		/* The unchecked box sits on the item media. */
		& :global(.fs-items-view-item-checkbox input:not(:checked) + div) {
			background-color: var(--fs-control-on-image-fill-default);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.fs-items-view-item::after {
			transition: none;
		}
	}
</style>
