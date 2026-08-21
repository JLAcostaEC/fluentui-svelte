<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { on } from 'svelte/events';
	import { onClickOutside } from 'runed';
	import { PREFIX } from '$constants';
	import { defineProperty, defineState } from '$internal';
	import { setAutoSuggestBoxContext } from './auto-suggest-box.ts';
	import { Flyout, TextBox, ListView, ListViewItem } from '$lib/index.js';
	import {
		clearTabspotActive,
		setTabspotAttributes,
		tabspotVirtual,
		type TabspotNavigationEvent,
		type TabspotNodeOptions
	} from 'tabspot';
	import { getGlobalFSContext } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';
	import type { AutoSuggestBoxContext, FSAutoSuggestBox, OptionType } from './types.ts';

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}autosuggestbox-${FALLBACK_ID}`;
	const INPUT_ID = `${ID}-input`;

	let {
		placeholder,
		hideActionButtons,
		type = 'search',
		open = $bindable(false),
		multiselect,
		ref = $bindable(),
		value = $bindable(''),
		inputRef = $bindable(),
		selectOnFocus,
		virtualizer,
		flyoutRef = $bindable(),
		flyoutProps,
		listViewRef = $bindable(),
		selectedOptions = $bindable([]),
		listViewProps,
		showTextualMultiselect,
		notFoundText = 'No results found',
		maxItemsInView = 6,
		textChanged,
		querySubmitted,
		suggestionChosen,
		children
	}: FSAutoSuggestBox = $props();

	// svelte-ignore state_referenced_locally
	if (selectOnFocus && multiselect) throw new Error('selectOnFocus is not supported when multiselect is true');

	let items = new SvelteMap<string, OptionType>();

	let lastTypedValue: string = $state('');

	let roundClass = $state('bottom');

	let config: AutoSuggestBoxContext['config'] = $derived({
		selectOnFocus,
		virtualized: virtualizer,
		multiselect
	});

	let activeOption: OptionType | null = $state(null);

	let cursorKey: KeyboardEvent | undefined;

	const OPTIONS = '.fs-autosuggest-option';

	function navigationOver(items: string): TabspotNodeOptions {
		return {
			root: {},
			mover: {
				axis: 'vertical',
				items,
				skip: "[aria-disabled='true']",
				activation: {
					mode: 'activedescendant',
					controller: `#${INPUT_ID}`,
					mark: { attribute: 'data-active' }
				}
			}
		};
	}

	let _state: AutoSuggestBoxContext['state'] = defineState([
		(o) => defineProperty(o, 'lastTypedValue', () => lastTypedValue),
		(o) =>
			defineProperty(
				o,
				'open',
				() => open,
				(v) => (open = v)
			),
		(o) => defineProperty(o, 'textBoxRef', () => inputRef),
		(o) =>
			defineProperty(
				o,
				'activeOption',
				() => activeOption,
				(v) => (activeOption = v)
			)
	]);

	let methods: AutoSuggestBoxContext['methods'] = {
		setOption: ({ id, index, value, text, disabled }) => {
			items.set(id, { id, index, value, text, disabled });
		},
		deleteOption: (id: string) => {
			items.delete(id);
		},
		toggleSelection: (e, id) => {
			const item = items.get(id);

			if (item) {
				if (multiselect) {
					if (selectedOptions?.some((opt) => opt.id === id)) {
						selectedOptions = selectedOptions.filter((opt) => opt.id !== id);
					} else {
						selectedOptions = [...selectedOptions, { id, value: item.value }];
					}

					if (showTextualMultiselect) value = selectedOptions.map((opt) => opt.value).join(', ');
				} else {
					selectedOptions = [item];

					value = item.text || item.value;
				}

				suggestionChosen?.(e, item.value);
			}
		}
	};

	// svelte-ignore state_referenced_locally
	setAutoSuggestBoxContext({ config, state: _state, methods, events: null });

	function applyNavigation() {
		if (listViewRef) setTabspotAttributes({ element: listViewRef, config: navigationOver(OPTIONS) });
	}

	/**
	 * Put the cursor on `option`, or send it home when there is none.
	 *
	 */
	function pointCursorAt(option: OptionType | null) {
		if (!listViewRef || option?.id === activeOption?.id) return;

		clearTabspotActive(listViewRef);

		if (!option) {
			readCursor(null);
			return;
		}

		setTabspotAttributes({ element: listViewRef, config: navigationOver(`#${CSS.escape(option.id)}`) });
		inputRef?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));

		applyNavigation();
	}

	/** The option a query selects on its own: the first one it is a prefix of. */
	function bestMatch(query: string): OptionType | null {
		const needle = query.toLowerCase();
		let best: OptionType | null = null;

		for (const option of items.values()) {
			if (option.disabled) continue;
			if (!option.value.toLowerCase().startsWith(needle) && !option.text?.toLowerCase().startsWith(needle)) continue;
			if (!best || option.index < best.index) best = option;
		}

		return best;
	}

	/** Take in where Tabspot has just put its cursor. `null` means it sits at home. */
	function readCursor(element: HTMLElement | null) {
		const option = element ? (items.get(element.id) ?? null) : null;

		if (option?.id === activeOption?.id) return;

		activeOption = option;

		// Tabspot only scrolls when a move runs off the *rendered* window; inside it
		// the option can still be out of sight, buffered below the fold.
		if (option) document.getElementById(option.id)?.scrollIntoView({ block: 'nearest' });

		// selectOnFocus mirrors the option into the text box, which must not happen
		// while the user is the one typing in it.
		if (!selectOnFocus || !cursorKey) return;

		if (option) {
			methods.toggleSelection(cursorKey, option.id);
			value = option.text || option.value;
		} else {
			value = lastTypedValue;
		}
	}

	/** `atEdge` means the list ran out of options: hand the query back. */
	function navigate(event: TabspotNavigationEvent) {
		if (!event.atEdge) {
			readCursor(event.to);
			return;
		}

		event.preventDefault();
		leaveList();
	}

	/** Send the cursor home and give the user their query back. */
	function leaveList() {
		if (listViewRef) clearTabspotActive(listViewRef);

		readCursor(null);
	}

	/** The two keys that are the box's own business rather than the list's. */
	function handleKeyDown(e: KeyboardEvent) {
		if (e.target !== inputRef) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			open = false;
			return;
		}

		if (e.key !== 'Enter') return;

		e.preventDefault();

		if (activeOption) {
			methods.toggleSelection(e, activeOption.id);
			open = false;
		} else {
			querySubmitted?.(e, value);
		}
	}

	/**
	 * Whether the next arrow would *enter* the list rather than move inside it, and
	 * would enter it in the wrong place if left alone.
	 */
	function entryNeedsScrolling() {
		return !activeOption && (!open || !!virtualizer);
	}

	/** Open, scroll to the end the key is heading for, then let Tabspot enter. */
	async function enterList(key: 'ArrowUp' | 'ArrowDown') {
		open = true;
		await tick();

		await (key === 'ArrowUp' ? virtualizer?.scrollToBottom?.() : virtualizer?.scrollToTop?.());
		await tick();

		// Untrusted, so it passes straight through to Tabspot this time.
		inputRef?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
	}

	async function handleTextChanged(e: InputEvent, val: string) {
		if (val.length > 0 && !open) open = true;
		lastTypedValue = val;
		textChanged?.(e, val);

		await tick();

		// Automatic selection, per the WAI-ARIA combobox pattern: 
		// hook for fetching a fresh set of suggestions.
		cursorKey = undefined;
		pointCursorAt(val ? bestMatch(val) : null);
	}

	function handleClear() {
		value = '';
		lastTypedValue = '';
		open = false;
	}

	function handlePlacementChange(newPlacement: string) {
		roundClass = newPlacement.includes('-') ? newPlacement.split('-')[0] : newPlacement;
	}

	onClickOutside(
		() => ref,
		() => (open = false)
	);

	onMount(() => {
		if (!inputRef) return;

		const off = [
			on(inputRef, 'keydown', handleKeyDown),
			// Tabspot listens on `document` in the capture phase,
			// `window` comes first on the capture path, to note the
			// key that caused a move,and to hold a move back until
			// the list can answer it correctly.
			on(
				window,
				'keydown',
				(event) => {
					if (event.target !== inputRef || !event.isTrusted) return;

					const key = event.key;

					if (key !== 'ArrowUp' && key !== 'ArrowDown') return;

					cursorKey = event;

					if (!entryNeedsScrolling()) return;

					// Keep the key from Tabspot entirely: it would enter on the wrong
					// item, and there would be no undoing that from here.
					event.preventDefault();
					event.stopPropagation();

					enterList(key);
				},
				{ capture: true }
			)
		];

		return () => {
			activeOption = null;
			off.forEach((unsubscribe) => unsubscribe());
		};
	});

	const globalContext = getGlobalFSContext();

	// Closing takes the flyout down, and leaving `activeOption` behind,
	// remove it..
	$effect(() => {
		if (!open) activeOption = null;
	});

	$effect(() => {
		if (!open || !listViewRef) return;

		applyNavigation();

		const instance = globalContext?.state.tabspotInstance;
		const detach = instance?.subscribe(listViewRef, navigate);

		if (!virtualizer || !virtualizer?.scrollToIndex) return detach;

		const detachVirtual = tabspotVirtual(listViewRef, {
			count: () => virtualizer.size,
			scrollToIndex: (index) => virtualizer.scrollToIndex?.(index),
			tick
		});

		return () => {
			detach?.();
			detachVirtual();
		};
	});
</script>

<div
	class={['fs-autosuggestbox', { open }]}
	style="--max-items: {maxItemsInView}; --current-items: {items.size};"
	bind:this={ref}
>
	<TextBox
		{type}
		{placeholder}
		{hideActionButtons}
		id={INPUT_ID}
		bind:value
		bind:ref={inputRef}
		querySubmitted={(e) => querySubmitted?.(e, value)}
		textChanged={(e) => handleTextChanged(e, value)}
		onClear={handleClear}
		role="combobox"
		aria-expanded={open}
		aria-autocomplete="list"
		aria-controls={open ? `${ID}-list` : undefined}
		aria-haspopup="listbox"
		class="square-{roundClass}"
	/>
	{#if open}
		<Flyout
			floating
			offset={0}
			reference={ref}
			bind:ref={flyoutRef}
			roundCorners="bottom"
			placementConfig={{ allowedPlacements: ['bottom', 'top'] }}
			onPlacementChange={(place) => handlePlacementChange(place)}
			class={['fs-autosuggestbox-flyout', roundClass === 'top' && 'top-shadow', flyoutProps?.class]}
			{...flyoutProps}
		>
			<ListView
				role="listbox"
				navigationMode="items"
				disableTabspot
				id="{ID}-list"
				selectedItems={Array.from(selectedOptions.values()).map((opt) => opt.value)}
				bind:ref={listViewRef}
				{...listViewProps as any}
			>
				{#if items.size === 0}
					<ListViewItem disabled>{notFoundText}</ListViewItem>
				{/if}
				{@render children?.()}
			</ListView>
		</Flyout>
	{/if}
</div>

<style>
	.fs-autosuggestbox {
		position: relative;
		width: 100%;
		& :global(.fs-flyout) {
			position: absolute;
			padding: 0;
			top: 0;
			left: -1px;
			width: calc(100% + 2px);
		}
		&.open {
			& :global(.fs-flyout) {
				border-color: rgba(0, 0, 0, 0.06);
				z-index: 10;
				max-height: calc(var(--max-items) * 2.7rem);
				height: calc(var(--current-items) * 2.7rem);
				min-height: 3.4rem;
				overflow: hidden;
				&:global(.top-shadow) {
					box-shadow: 0 -0.5rem 0.8rem #00000024;
				}
			}
			& :global(.fs-list-view) {
				overflow-y: auto;
				padding: 4px;
			}
			& :global(.fs-textbox) {
				&:global(.square-top) {
					border-top-left-radius: 0;
					border-top-right-radius: 0;
					&::after,
					&::before {
						border-top-left-radius: 0;
						border-top-right-radius: 0;
					}
				}
				&:global(.square-bottom) {
					border-bottom-left-radius: 0;
					border-bottom-right-radius: 0;
					&::after,
					&::before {
						border-bottom-left-radius: 0;
						border-bottom-right-radius: 0;
					}
				}
			}
			& :global(.fs-textbox:after) {
				width: calc(100% + 0.125rem);
				left: -0.063rem;
				background-color: var(--fs-accent-fill-default);
			}
		}
	}
</style>
