<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import { circularInputShape, dispatchFieldEvents, invokeHandlers, NativeField } from '#internal';
	import { onClickOutside } from 'runed';
	import ChevronDownFilled from 'fluentui-icons-svelte/ChevronDownFilled.svelte';
	import { Flyout, ListView, ListViewItem } from '#lib/index.js';
	import type { DropdownContext, DropdownOptionLabel, DropdownProps } from './types.ts';
	import { tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { clearTabspotActive, setTabspotActive, setTabspotAttributes, unsetTabspotSection } from 'tabspot';
	import { PREFIX } from '../../internal/constants.ts';
	import { getGlobalFSContext } from '#lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { setDropdownContext } from './dropdown-context.ts';

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}-dropdown-${FALLBACK_ID}`;

	const labelContext = claimLabel(() => id);

	let {
		id = labelContext?.fieldId ?? ID,
		name,
		placeholder = 'Select an option',
		shape = 'rounded',
		multiple,
		value = $bindable(multiple ? [] : ''),
		disabled,
		flyoutMaxHeight,
		wrapperRef = $bindable(null),
		wrapperAttributes,
		ref = $bindable(null),
		buttonRef = $bindable(null),
		buttonAttributes,
		flyoutRef = $bindable(null),
		flyoutProps,
		listboxRef = $bindable(null),
		listboxProps,
		onfocus,
		onblur,
		children,
		...attributes
	}: DropdownProps = $props();

	const BUTTON_ID = $derived(buttonAttributes?.id ?? `${id}-button`);

	const native = new NativeField(
		() => ref,
		() => buttonRef,
		labelContext
	);

	let open = $state(false);

	let roundClass = $state('bottom');

	const globalFSContext = getGlobalFSContext();

	const OPEN_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' '];

	// The list stays in the page while closed, so every option is here from the start, and is read live.
	const options = new SvelteSet<DropdownOptionLabel>();
	const optionLabels = $derived(new Map([...options].map((option) => [option.value, option.text])));

	const context: DropdownContext = $state({
		config: null,
		state: null,
		events: null,
		methods: {
			registerOption: (option) => {
				options.add(option);
				return () => options.delete(option);
			}
		}
	});

	setDropdownContext(context);

	const selectedValues = $derived(multiple ? (Array.isArray(value) ? value : []) : value ? [value as string] : []);

	const hasValue = $derived(selectedValues.length > 0);

	const displayLabel = $derived(
		hasValue ? selectedValues.map((v) => optionLabels.get(v) ?? v).join(', ') : placeholder
	);

	onClickOutside(
		() => wrapperRef,
		(event) => {
			if (event.target instanceof Element && event.target.closest('label')?.control === ref) return;
			closeDropdown();
		}
	);

	function handlePlacementChange(newPlacement: string) {
		roundClass = newPlacement.includes('-') ? newPlacement.split('-')[0] : newPlacement;
	}

	async function openDropdown() {
		if (disabled || open) return;
		open = true;
		await tick();
		globalFSContext?.state?.tabspotInstance?.rebuild(wrapperRef ?? undefined);
		// The cursor starts on the selection, or on the first option, so it is announced on open.
		const start =
			listboxRef?.querySelector<HTMLElement>('.fs-list-view-item[aria-selected="true"]:not([aria-disabled="true"])') ??
			listboxRef?.querySelector<HTMLElement>('.fs-list-view-item:not([aria-disabled="true"])');
		if (start) setTabspotActive(start, { nearest: true });
	}

	function closeDropdown() {
		if (!open) return;
		open = false;
		globalFSContext?.state?.tabspotInstance?.update({});
	}

	async function handleKeyDown(e: KeyboardEvent) {
		if (disabled) return;

		const { key } = e;

		if (open && (key === 'Enter' || key === ' ')) {
			e.preventDefault();
			// Focus stays on the button, so the option under the cursor never sees the key: click it here.
			listboxRef?.querySelector<HTMLElement>('[data-active="true"]')?.click();
			return;
		}

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

	async function handleClick() {
		if (open) closeDropdown();
		else await openDropdown();
	}

	/** A label activates the native select it belongs to, which hands the activation to the button. */
	async function openFromField() {
		buttonRef?.focus();
		await openDropdown();
	}

	function select(items: string[] | undefined) {
		const next = multiple ? (items ?? []) : (items?.[0] ?? '');
		if (!multiple && next === value) return;
		value = next;
		dispatchFieldEvents(ref);
	}

	// Force rebuild of tabspot handling tree
	$effect(() => {
		if (!wrapperRef) return;

		if (!open) {
			// The list stays in the page once closed: nothing in it reads as chosen.
			clearTabspotActive(wrapperRef);
			unsetTabspotSection(wrapperRef, 'root');
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
						controller: `#${CSS.escape(BUTTON_ID)}`,
						mode: 'activedescendant',
						mark: {
							attribute: 'data-active'
						}
					}
				}
			},
			element: wrapperRef,
			merge: true
		});
	});
</script>

<div
	{...wrapperAttributes}
	class={['fs-dropdown', shape, `square-${roundClass}`, { open, disabled }, wrapperAttributes?.class]}
	bind:this={wrapperRef}
	{@attach shape === 'circular' ? circularInputShape : undefined}
>
	<!-- Hidden while closed, not gone: each option reports its text as it is created, and comes before
	     the button, so the button shows it before the list ever opens, on the server too. -->
	<Flyout
		{...flyoutProps}
		hidden={!open}
		style="{flyoutProps?.style ?? ''}; {flyoutMaxHeight ? `max-height: ${flyoutMaxHeight};` : ''}"
		offset={0}
		bind:ref={flyoutRef}
		floating
		roundCorners="bottom"
		reference={wrapperRef ?? undefined}
		id={`${id}-flyout`}
		onPlacementChange={(place) => {
			handlePlacementChange(place);
			flyoutProps?.onPlacementChange?.(place);
		}}
		placementConfig={{ allowedPlacements: ['bottom', 'top'] }}
		class="fs-dropdown-flyout {roundClass === 'top' ? 'top-shadow' : ''} {flyoutProps?.class}"
	>
		<ListView
			{...listboxProps}
			bind:ref={listboxRef}
			bind:selectedItems={() => selectedValues, select}
			selectionMode={multiple ? 'multiselect' : 'single'}
			toggleOnClick={multiple}
			onSelectionChange={(event, selected) => {
				if (!multiple) closeDropdown();
				listboxProps?.onSelectionChange?.(event, selected);
			}}
			navigationMode="items"
			id={`${id}-listbox`}
			role="listbox"
			disableTabspot
		>
			{#if !children}
				<ListViewItem disabled>No options available</ListViewItem>
			{:else}
				{@render children?.()}
			{/if}
		</ListView>
	</Flyout>
	<ChevronDownFilled class="indicator" />
	<button
		{...buttonAttributes}
		{...native.aria(attributes, buttonAttributes)}
		bind:this={buttonRef}
		type="button"
		role="combobox"
		onclick={(e) => invokeHandlers(e, [disabled], [handleClick, buttonAttributes?.onclick])}
		onkeydown={(e) => invokeHandlers(e, [disabled], [handleKeyDown, buttonAttributes?.onkeydown])}
		onfocus={(e) => invokeHandlers(e, [], [onfocus, buttonAttributes?.onfocus])}
		onblur={(e) => invokeHandlers(e, [], [onblur, buttonAttributes?.onblur])}
		aria-controls={open ? `${id}-listbox` : undefined}
		aria-expanded={open}
		id={BUTTON_ID}
		aria-haspopup="listbox"
		{disabled}
		class={['fs-dropdown-button', hasValue && 'has-value', buttonAttributes?.class]}
	>
		{displayLabel}
	</button>

	<!-- The field of the form: submitted, validated and reset like any select input,
	     behind the button and out of the tab order, since the button is what people use. See `NativeField`. -->
	<!-- Svelte needs a static `multiple` to bind a select, hence the two branches. This is the native form -->
	{#if multiple}
		<select
			{...attributes}
			class="native-field"
			aria-hidden={native.reported ? undefined : 'true'}
			multiple
			tabindex={-1}
			{id}
			{name}
			{disabled}
			bind:value
			bind:this={ref}
			onclick={openFromField}
		>
			{#each selectedValues as option (option)}
				<option value={option}>{optionLabels.get(option) ?? option}</option>
			{/each}
		</select>
	{:else}
		<select
			{...attributes}
			class="native-field"
			aria-hidden={native.reported ? undefined : 'true'}
			tabindex={-1}
			{id}
			{name}
			{disabled}
			bind:value
			bind:this={ref}
			onclick={openFromField}
		>
			<!-- The placeholder makes an empty value missing for `required`, and is what a reset returns to. -->
			<option value="" hidden></option>
			{#if hasValue}
				<option {value}>{displayLabel}</option>
			{/if}
		</select>
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
		&.square {
			border-radius: 0;
			&::before,
			&::after {
				border-radius: 0;
			}
		}

		&.circular {
			border-radius: var(--input-circular-radius, 999px);
			&::before {
				border-radius: inherit;
			}
			/* Clip the underline to the pill instead of drawing square ends outside it. */
			&::after {
				height: calc(100% + 0.125rem);
				border-radius: inherit;
				clip-path: inset(calc(100% - 2px) 0 0);
			}
		}

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
			border-radius: inherit;
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
		&:has(> .native-field:is(:user-invalid, [aria-invalid='true'])):after {
			width: calc(100% + 0.125rem);
			left: -0.063rem;
			background-color: var(--fs-system-critical);
		}
		& .native-field {
			position: absolute;
			inset: 0;
			inline-size: 100%;
			block-size: 100%;
			margin: 0;
			box-sizing: border-box;
			opacity: 0;
			pointer-events: none;
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
