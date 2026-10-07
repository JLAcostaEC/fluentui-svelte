<script lang="ts">
	import { tick } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { onClickOutside } from 'runed';
	import ChevronDownRegular from 'fluentui-icons-svelte/ChevronDownRegular.svelte';
	import { PREFIX } from '$constants';
	import { RenderSoC } from '$internal';
	import { setTagPickerContext } from './tag-picker.ts';
	import { Flyout, ListView, ListViewItem, Tag, TagGroup } from '$lib/index.js';
	import {
		clearTabspotActive,
		setTabspotActive,
		setTabspotAttributes,
		type TabspotNavigationEvent,
		type TabspotNodeOptions
	} from 'tabspot';
	import { getGlobalFSContext } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';
	import type { TagSize } from '../tag/types.ts';
	import type { OptionType, TagPickerContext, TagPickerProps, TagPickerSizes } from './types.ts';

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}-tagpicker-${FALLBACK_ID}`;
	const LIST_ID = `${ID}-list`;

	/** The tag is one step smaller than the control around it. */
	const TAG_SIZES: Record<TagPickerSizes, TagSize> = { medium: 'extra-small', large: 'small', 'extra-large': 'medium' };

	let {
		ref = $bindable(),
		inputRef = $bindable(),
		selectedOptions = $bindable([]),
		value = $bindable(''),
		open = $bindable(false),
		single,
		disabled,
		size = 'medium',
		placeholder,
		notFoundText = 'No options available',
		expandIcon = ChevronDownRegular,
		secondaryAction,
		tag,
		tagGroupProps,
		inputProps,
		onSelectionChange,
		querySubmitted,
		class: classes,
		children,
		...attributes
	}: TagPickerProps = $props();

	const INPUT_ID = $derived(inputProps?.id ?? `${ID}-input`);

	/**
	 * The props the invariants rule over. The markup and the context read them through here, so
	 * reading any of them validates the lot during SSR and on every prop update. A picker with no
	 * list, or a disabled one, can never be open.
	 */
	const _picker = $derived.by(() => {
		if (single && selectedOptions.length > 1) {
			throw new Error('A single TagPicker cannot hold more than one selected option');
		}
		const hasList = !!children;
		return { single, disabled, hasList, open: open && hasList && !disabled };
	});

	/** The options on screen, by id. */
	const options = new SvelteMap<string, OptionType>();

	/** What the tag of each value says. It outlives its option, which leaves the screen when filtered or chosen. */
	const labels = new SvelteMap<string, string>();

	let listViewRef = $state<HTMLUListElement>();

	let roundClass = $state('bottom');

	let activeOption: OptionType | null = $state(null);

	const tagSize = $derived(TAG_SIZES[size]);

	const NAVIGATION: TabspotNodeOptions = $derived({
		root: {},
		mover: {
			axis: 'vertical',
			items: '.fs-tagpicker-option',
			skip: "[aria-disabled='true']",
			activation: {
				mode: 'activedescendant',
				controller: `#${CSS.escape(INPUT_ID)}`,
				mark: { attribute: 'data-active' }
			}
		}
	});

	const context: TagPickerContext = $state({
		config: null,
		state: {
			get query() {
				return value;
			},
			get selectedOptions() {
				return selectedOptions;
			},
			get open() {
				return _picker.open;
			}
		},
		events: null,
		methods: {
			setLabel: (v, text) => {
				labels.set(v, text);
			},
			setOption: (option) => {
				options.set(option.id, option);
			},
			deleteOption: (id) => {
				options.delete(id);
			},
			chooseOption: async (e, id) => {
				const option = options.get(id);

				if (!option || option.disabled || selectedOptions.includes(option.value)) return;

				selectedOptions = _picker.single ? [option.value] : [...selectedOptions, option.value];
				value = '';
				activeOption = null;
				onSelectionChange?.(e, selectedOptions);

				if (_picker.single) open = false;

				// The option under the cursor just left the screen.
				await tick();

				if (listViewRef) clearTabspotActive(listViewRef);
			}
		}
	});

	setTagPickerContext(context);

	/** Put the cursor on `element`, or send it home when there is none. */
	function pointCursorAt(element: HTMLElement | null) {
		if (!listViewRef) return;

		// `nearest` walks past an option the cursor cannot land on.
		if (element && setTabspotActive(element, { nearest: true }).ok) return;

		clearTabspotActive(listViewRef);
		readCursor(null);
	}

	function readCursor(element: HTMLElement | null) {
		const option = element ? (options.get(element.id) ?? null) : null;

		if (option?.id === activeOption?.id) return;

		activeOption = option;

		if (option) element?.scrollIntoView({ block: 'nearest' });
	}

	/** `atEdge` means the list ran out of options: send the cursor back to the input. */
	function navigate(event: TabspotNavigationEvent) {
		if (!event.atEdge) {
			readCursor(event.to);
			return;
		}

		event.preventDefault();

		if (listViewRef) clearTabspotActive(listViewRef);

		readCursor(null);
	}

	/** Open, then let Tabspot enter the list. */
	async function enterList(key: 'ArrowUp' | 'ArrowDown') {
		open = true;
		await tick();

		// The key is replayed rather than turned into a `setTabspotActive` call: a second arrow
		// pressed while this one is still in flight is a second move, and two cursor sets onto
		// the same option would be one. The extra hop lets Tabspot see the list it just got.
		await undefined;
		await tick();

		inputRef?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.isComposing) return;

		switch (e.key) {
			case 'ArrowDown':
			case 'ArrowUp':
				// An arrow inside an open list is Tabspot's. The replay of this one is not trusted.
				if (!e.isTrusted || _picker.open || !_picker.hasList || _picker.disabled) return;

				e.preventDefault();
				enterList(e.key);
				break;
			case 'Enter':
				e.preventDefault();

				if (_picker.open && activeOption) context.methods.chooseOption(e, activeOption.id);
				else if (value) querySubmitted?.(e, value);
				else if (_picker.hasList && !_picker.disabled) open = true;
				break;
			case 'Escape':
				if (!_picker.open) return;

				e.preventDefault();
				open = false;
				break;
			case 'Tab':
				open = false;
				break;
			case 'Backspace':
				if (_picker.disabled || value !== '' || selectedOptions.length === 0) return;

				selectedOptions = selectedOptions.slice(0, -1);
				onSelectionChange?.(e, selectedOptions);
				break;
		}
	}

	async function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		if (!_picker.hasList || _picker.disabled) return;

		if (e.currentTarget.value && !open) open = true;

		await tick();

		// The first match is the one Enter would choose.
		pointCursorAt(value ? (listViewRef?.querySelector<HTMLElement>('.fs-tagpicker-option') ?? null) : null);
	}

	function handleDismiss(e: MouseEvent | KeyboardEvent, data: { value: string }) {
		selectedOptions = selectedOptions.filter((v) => v !== data.value);
		onSelectionChange?.(e, selectedOptions);
		inputRef?.focus();
	}

	function handleControlClick(e: MouseEvent) {
		// Tags and the aside have a job of their own.
		if (_picker.disabled || (e.target as Element).closest('.fs-tag, .fs-tagpicker-aside')) return;

		inputRef?.focus();

		if (_picker.hasList) open = true;
	}

	function handleChevronClick() {
		if (_picker.disabled) return;

		inputRef?.focus();

		if (_picker.hasList) open = !_picker.open;
	}

	/** A click on the secondary action must not strand focus on it: the list is still open, and Escape lives on the input. */
	function handleAsideClick(e: MouseEvent) {
		if (_picker.open && !(e.target as Element).closest('.chevron')) inputRef?.focus();
	}

	/** Focus stays in the input: the chrome around it only forwards the click. */
	function keepFocus(e: MouseEvent) {
		if (!(e.target as Element).closest('input, button')) e.preventDefault();
	}

	function handlePlacementChange(newPlacement: string) {
		roundClass = newPlacement.includes('-') ? newPlacement.split('-')[0] : newPlacement;
	}

	onClickOutside(
		() => ref,
		() => (open = false)
	);

	const globalContext = getGlobalFSContext();

	// Closing takes the list down, and leaving `activeOption` behind would point at nothing.
	$effect(() => {
		if (!_picker.open) activeOption = null;
	});

	$effect(() => {
		if (!_picker.open || !listViewRef) return;

		setTabspotAttributes({ element: listViewRef, config: NAVIGATION });

		return globalContext?.state.tabspotInstance?.subscribe(listViewRef, navigate);
	});

	// Tabspot does not notice an option that left the list, so it learns the options that are left.
	$effect(() => {
		void [...options.keys()];

		if (listViewRef) globalContext?.state.tabspotInstance?.rebuild(listViewRef);
	});
</script>

<!--
@component
A text field and a dropdown that give people a way to choose several options from a list, or to enter their own choice. Every choice is shown as a dismissible Tag in the control.

- Usage:
  ```tsx
  <script>
    import { TagPicker, TagPickerOption } from 'fluentui-svelte';

    let selectedOptions = $state([]);
  </script>

  <TagPicker bind:selectedOptions inputProps={{ 'aria-label': 'Fruits' }}>
    <TagPickerOption value="Apple">Apple</TagPickerOption>
    <TagPickerOption value="Banana">Banana</TagPickerOption>
  </TagPicker>
  ```
-->
<div
	class={['fs-tagpicker', `size-${size}`, { disabled: _picker.disabled, open: _picker.open }, classes]}
	bind:this={ref}
	{...attributes}
>
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class={['control', _picker.open && `square-${roundClass}`]} onclick={handleControlClick} onmousedown={keepFocus}>
		<div class="content">
			{#if selectedOptions.length > 0}
				<TagGroup
					role="list"
					size={tagSize}
					disabled={_picker.disabled}
					dismissible
					onDismiss={handleDismiss}
					{...tagGroupProps}
				>
					{#each selectedOptions as v (v)}
						{@const text = labels.get(v) ?? v}
						{#if tag}
							{@render tag({ value: v, text })}
						{:else}
							<Tag role="listitem" value={v} title={text}>{text}</Tag>
						{/if}
					{/each}
				</TagGroup>
			{/if}
			<input
				bind:this={inputRef}
				type="text"
				autocomplete="off"
				{placeholder}
				id={INPUT_ID}
				disabled={_picker.disabled}
				role={_picker.hasList ? 'combobox' : undefined}
				aria-expanded={_picker.hasList ? _picker.open : undefined}
				aria-haspopup={_picker.hasList ? 'listbox' : undefined}
				aria-autocomplete={_picker.hasList ? 'list' : undefined}
				aria-controls={_picker.open ? LIST_ID : undefined}
				{...inputProps}
				bind:value
				oninput={handleInput}
				onkeydown={handleKeyDown}
			/>
		</div>
		{#if secondaryAction || (expandIcon && _picker.hasList)}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<span class="fs-tagpicker-aside" onclick={handleAsideClick}>
				{@render secondaryAction?.()}
				<!-- Without a list there is nothing to expand. -->
				{#if expandIcon && _picker.hasList}
					<span class="chevron" aria-hidden="true" onclick={handleChevronClick}>
						<RenderSoC SoC={expandIcon} />
					</span>
				{/if}
			</span>
		{/if}
	</div>
	{#if _picker.open && ref}
		<Flyout
			floating
			offset={0}
			reference={ref}
			roundCorners="bottom"
			placementConfig={{ allowedPlacements: ['bottom', 'top'] }}
			onPlacementChange={(place) => handlePlacementChange(place)}
			class={['fs-tagpicker-flyout', roundClass === 'top' && 'top-shadow']}
		>
			<ListView
				role="listbox"
				navigationMode="items"
				disableTabspot
				id={LIST_ID}
				aria-multiselectable={_picker.single ? undefined : 'true'}
				aria-label={inputProps?.['aria-label']}
				aria-labelledby={inputProps?.['aria-labelledby']}
				bind:ref={listViewRef}
				onmousedown={(e: MouseEvent) => e.preventDefault()}
			>
				{#if options.size === 0}
					<ListViewItem role="option" disabled>{notFoundText}</ListViewItem>
				{/if}
				{@render children?.()}
			</ListView>
		</Flyout>
	{:else if children}
		<!-- Nobody sees the options, but each one still tells its tag what to say. -->
		<ListView hidden>
			{@render children()}
		</ListView>
	{/if}
</div>

<style>
	.fs-tagpicker {
		--tp-min-height: 2rem;
		--tp-group-pad: 0.375rem;
		--tp-gap: 0.25rem;
		--tp-input-pad: 0.375rem;
		--tp-icon: 1rem;
		--tp-icon-gap: 0.125rem;

		position: relative;
		box-sizing: border-box;
		inline-size: 100%;
		min-inline-size: 15.625rem;
		&.size-large {
			--tp-min-height: 2.5rem;
			--tp-group-pad: 0.5rem;
			--tp-gap: 0.375rem;
			--tp-input-pad: 0.625rem;
			--tp-icon: 1.25rem;
		}
		&.size-extra-large {
			--tp-min-height: 2.75rem;
			--tp-group-pad: 0.5rem;
			--tp-gap: 0.375rem;
			--tp-input-pad: 0.75rem;
			--tp-icon: 1.5rem;
			--tp-icon-gap: 0.375rem;
		}
	}

	.control {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		box-sizing: border-box;
		min-block-size: var(--tp-min-height);
		padding-inline: 0.75rem;
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-control-fill-default);
		cursor: text;
		&:hover {
			background: var(--fs-control-fill-secondary);
		}
		&::before {
			content: '';
			pointer-events: none;
			inline-size: calc(100% + 0.125rem);
			block-size: calc(100% + 0.125rem);
			position: absolute;
			inset-block-start: -0.063rem;
			inset-inline-start: -0.063rem;
			padding: 0.063rem;
			box-sizing: border-box;
			border-radius: 0.313rem;
			mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			mask-composite: exclude;
			background: var(--fs-elevation-text-border);
			z-index: 1;
		}
		/* The bar grows from the middle on focus. Its clip-path is static: animating it would freeze the page. */
		&::after {
			content: '';
			pointer-events: none;
			inline-size: 0;
			block-size: 10px;
			border-radius: 0 0 5px 5px;
			position: absolute;
			inset-block-end: -0.063rem;
			inset-inline-start: calc(50% - 0.063rem);
			clip-path: polygon(0 75%, 100% 75%, 100% 100%, 0% 100%);
			background: transparent;
			transition:
				inline-size var(--fs-normal-duration) var(--fs-point-to-point),
				inset-inline-start var(--fs-normal-duration) var(--fs-point-to-point);
			z-index: 2;
		}
		&.square-top {
			border-start-start-radius: 0;
			border-start-end-radius: 0;
			&::before,
			&::after {
				border-start-start-radius: 0;
				border-start-end-radius: 0;
			}
		}
		&.square-bottom {
			border-end-start-radius: 0;
			border-end-end-radius: 0;
			&::before,
			&::after {
				border-end-start-radius: 0;
				border-end-end-radius: 0;
			}
		}
	}

	.fs-tagpicker:focus-within .control,
	.open .control {
		&::after {
			inline-size: calc(100% + 0.125rem);
			inset-inline-start: -0.063rem;
			background-color: var(--fs-accent-fill-default);
		}
	}
	.fs-tagpicker:focus-within .control {
		background: var(--fs-control-fill-input-active);
		& input::placeholder {
			color: var(--fs-text-tertiary);
		}
	}

	.content {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: var(--tp-gap);
		min-inline-size: 0;
		/* The tags are flex items of the control, so the input follows the last one instead of starting a row. */
		& :global(.fs-tag-group) {
			display: contents;
		}
		/* A long tag shortens itself instead of overflowing the control. */
		& :global(.fs-tag) {
			max-inline-size: 100%;
			margin-block: var(--tp-group-pad);
		}
		& :global(.fs-tag-primary-text) {
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	input {
		flex: 1 1 0;
		min-inline-size: 1.5rem;
		max-inline-size: 100%;
		box-sizing: border-box;
		margin: 0;
		padding: var(--tp-input-pad) 0;
		appearance: none;
		background: transparent;
		border: none;
		outline: none;
		color: var(--fs-text-primary);
		font-family: inherit;
		font-size: var(--fs-body2-font-size);
		&::placeholder {
			color: var(--fs-text-secondary);
		}
		&[readonly] {
			caret-color: transparent;
			cursor: pointer;
		}
	}

	.fs-tagpicker-aside {
		display: flex;
		align-items: center;
		align-self: start;
		block-size: var(--tp-min-height);
		color: var(--fs-text-secondary);
		/* The control sits above the border mask, and the action must stay clickable. */
		z-index: 2;
		/* The action sits inside the control, whatever size its own button has. */
		& :global(.fs-button) {
			block-size: calc(var(--tp-min-height) - 0.25rem);
			padding-block: 0;
			font-size: var(--fs-body2-font-size);
			line-height: var(--fs-body2-line-height);
		}
	}
	/* The arrow behaves like a subtle button. Its negative margins keep the icon where it was. */
	.chevron {
		display: flex;
		margin-inline: calc(var(--tp-icon-gap) - 0.25rem) -0.25rem;
		padding: 0.25rem;
		border-radius: var(--fs-control-border-radius);
		cursor: pointer;
		&:hover {
			background: var(--fs-subtle-fill-secondary);
		}
		&:active {
			color: var(--fs-text-tertiary);
			background: var(--fs-subtle-fill-tertiary);
		}
		& :global(svg) {
			display: block;
			inline-size: var(--tp-icon);
			block-size: var(--tp-icon);
			fill: currentColor;
		}
	}

	.disabled .control {
		cursor: not-allowed;
		background: var(--fs-control-fill-disabled);
		&::before {
			background: var(--fs-control-stroke-default);
		}
		& input,
		& input::placeholder,
		& .fs-tagpicker-aside {
			color: var(--fs-text-disabled);
		}
		& .chevron {
			cursor: not-allowed;
			&:hover,
			&:active {
				color: inherit;
				background: none;
			}
		}
	}

	.fs-tagpicker :global(.fs-flyout) {
		padding: 0;
		left: -1px;
		width: calc(100% + 2px);
		z-index: 10;
		overflow: hidden;
		max-block-size: min(80vh, 20rem);
		&:global(.top-shadow) {
			box-shadow: 0 -0.5rem 0.8rem #00000024;
		}
	}
	.fs-tagpicker :global(.fs-list-view) {
		overflow-y: auto;
		padding: 4px;
	}
</style>
