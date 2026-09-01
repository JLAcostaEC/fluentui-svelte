<script lang="ts">
	import { onClickOutside } from 'runed';
	import ChevronDownFilled from 'fluentui-icons-svelte/ChevronDownFilled.svelte';
	import { Flyout, ListView, ListViewItem } from '$lib/index.js';
	import type { DropdownProps } from './types.ts';
	import { tick } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { setTabspotAttributes, unsetTabspotSection } from 'tabspot';
	import { PREFIX } from '../../internal/constants.ts';
	import { getGlobalFSContext } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { setDropdownContext } from './dropdown-context.ts';

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}-dropdown-${FALLBACK_ID}`;

	let {
		id = ID,
		name = id,
		placeholder = 'Select an option',
		multiple,
		value = $bindable(multiple ? [] : ''),
		disabled,
		flyoutMaxHeight,
		ref = $bindable(),
		wrapperProps,
		buttonRef = $bindable(),
		buttonProps,
		flyoutRef = $bindable(),
		flyoutProps,
		listboxRef = $bindable(),
		listboxProps,
		onclick,
		children
	}: DropdownProps = $props();

	let open = $state(false);

	let roundClass = $state('bottom');

	const globalFSContext = getGlobalFSContext();

	const OPEN_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' '];

	// Options only mount while the flyout is open, so we cache the last-known text
	// for every value here to keep rendering the selection once the list is closed.
	const optionLabels = new SvelteMap<string, string>();

	setDropdownContext({
		config: null,
		state: null,
		events: null,
		methods: {
			registerOption: (optionValue: string, text: string) => optionLabels.set(optionValue, text)
		}
	});

	const selectedValues = $derived(multiple ? (Array.isArray(value) ? value : []) : value ? [value as string] : []);

	const hasValue = $derived(selectedValues.length > 0);

	const displayLabel = $derived(
		hasValue ? selectedValues.map((v) => optionLabels.get(v) ?? v).join(', ') : placeholder
	);

	onClickOutside(
		() => ref,
		() => closeDropdown()
	);

	function handlePlacementChange(newPlacement: string) {
		roundClass = newPlacement.includes('-') ? newPlacement.split('-')[0] : newPlacement;
	}

	async function openDropdown() {
		if (disabled || open) return;
		open = true;
		await tick();
		globalFSContext?.state?.tabspotInstance?.rebuild(ref);
	}

	function closeDropdown() {
		if (!open) return;
		open = false;
		globalFSContext?.state?.tabspotInstance?.update({});
	}

	async function handleKeyDown(e: KeyboardEvent) {
		if (disabled) return;

		const { key } = e;

		if (OPEN_KEYS.includes(key)) {
			e.preventDefault();
			await openDropdown();
			return;
		}

		if (key === 'Escape' && open) {
			e.preventDefault();
			closeDropdown();
		}
	}

	async function handleClick(e: MouseEvent) {
		if (open) closeDropdown();
		else await openDropdown();
		onclick?.(e);
	}

	// Force rebuild of tabspot handling tree
	$effect(() => {
		if (!ref) return;

		if (!open) {
			unsetTabspotSection(ref, 'root');
			return;
		}

		setTabspotAttributes({
			config: {
				root: {
					manageSpecialKeys: true
				},
				mover: {
					axis: 'vertical',
					items: '.fs-list-view-item',
					activation: {
						controller: `#${id}-button`,
						mode: 'activedescendant',
						mark: {
							attribute: 'data-active'
						}
					}
				}
			},
			element: ref,
			merge: true
		});
	});
</script>

<div class={['fs-dropdown', `square-${roundClass}`, { open, disabled }]} bind:this={ref} {...wrapperProps}>
	<ChevronDownFilled class="indicator" />
	<button
		bind:this={buttonRef}
		type="button"
		role="combobox"
		onclick={handleClick}
		onkeydown={handleKeyDown}
		aria-controls={`${id}-listbox`}
		aria-expanded={open}
		id={`${id}-button`}
		aria-haspopup="listbox"
		{disabled}
		class={['fs-dropdown-button', hasValue && 'has-value']}
		{...buttonProps}
	>
		{displayLabel}
	</button>

	<input type="hidden" {name} {value} {id} {disabled} />

	{#if open}
		<Flyout
			style={flyoutMaxHeight ? `max-height: ${flyoutMaxHeight};` : ''}
			offset={0}
			bind:ref={flyoutRef}
			{...flyoutProps}
			floating
			roundCorners="bottom"
			reference={ref}
			id={`${id}-flyout`}
			onPlacementChange={(place) => handlePlacementChange(place)}
			placementConfig={{ allowedPlacements: ['bottom', 'top'] }}
			class="fs-dropdown-flyout {roundClass === 'top' ? 'top-shadow' : ''} {flyoutProps?.class}"
		>
			<ListView
				bind:ref={listboxRef}
				bind:selectedItems={
					() => {
						if (multiple) {
							return (value as string[]) || [];
						} else {
							return value ? [value as string] : [];
						}
					},
					(v) => {
						if (multiple) {
							value = v || [];
						} else {
							value = v?.[0] || '';
						}
					}
				}
				selectionMode={multiple ? 'multiselect' : 'single'}
				onSelectionChange={() => {
					if (!multiple) closeDropdown();
				}}
				navigationMode="items"
				id={`${id}-listbox`}
				role="listbox"
				disableTabspot
				{...listboxProps}
			>
				{#if !children}
					<ListViewItem disabled>No options available</ListViewItem>
				{:else}
					{@render children?.()}
				{/if}
			</ListView>
		</Flyout>
	{/if}
</div>

<style>
	.fs-dropdown {
		display: flex;
		align-items: center;
		position: relative;
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-control-fill-default);
		min-width: 10rem;
		cursor: pointer;
		&:before {
			content: '';
			pointer-events: none;
			width: calc(100% + 0.1rem);
			height: calc(100% + 0.1rem);
			position: absolute;
			top: -0.05rem;
			left: -0.05rem;
			padding: 0.05rem;
			border-radius: 0.313rem;
			mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			mask-composite: exclude;
			background: var(--fs-elevation-text-border);
			z-index: 1;
		}
		&:after {
			content: '';
			pointer-events: none;
			width: 0;
			height: 10px;
			border-radius: 0px 0px 5px 5px;
			position: absolute;
			bottom: -0.063rem;
			left: calc(50% - 0.063rem);
			clip-path: polygon(0 75%, 100% 75%, 100% 100%, 0% 100%);
			background: transparent;
			transition:
				width var(--fs-normal-duration) var(--fs-point-to-point),
				left var(--fs-normal-duration) var(--fs-point-to-point);
			z-index: 2;
		}
		& .fs-dropdown-button {
			all: unset;
			width: 100%;
			padding: 0.275rem 2.2rem 0.4rem 0.713rem;
			border-radius: var(--fs-control-border-radius);
			font-size: var(--fs-body-font-size);
			color: var(--fs-text-primary);
			display: flex;
			align-items: center;
			gap: 0.5rem;
			color: var(--fs-text-secondary);
		}
		&.open.square-top {
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			&::after,
			&::before {
				border-top-left-radius: 0;
				border-top-right-radius: 0;
			}
		}
		&.open.square-bottom {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			&::after,
			&::before {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}
		}
		& :global(.fs-flyout) {
			padding: 0 5px;
			width: calc(100% + 2px);
			&:global(.top-shadow) {
				box-shadow: 0 -0.5rem 0.8rem #00000024;
			}
		}
		&:has(:focus-visible):after,
		&.open:after {
			width: calc(100% + 0.125rem);
			left: -0.063rem;
			background-color: var(--fs-accent-fill-default);
		}
		& :global(> .indicator) {
			width: 1rem;
			position: absolute;
			right: 0.6rem;
			pointer-events: none;
			color: var(--fs-text-secondary);
		}
	}
</style>
