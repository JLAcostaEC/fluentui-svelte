<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { on } from 'svelte/events';
	import { onClickOutside } from 'runed';
	import { PREFIX } from '$constants';
	import { defineProperty, defineState } from '$internal';
	import { setAutoSuggestBoxContext } from './auto-suggest-box.ts';
	import { Flyout, TextBox, ListView, ListViewItem } from '$lib/index.js';
	import type { AutoSuggestBoxContext, FSAutoSuggestBox, OptionType } from './types.ts';

	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}autosuggestbox-${FALLBACK_ID}`;

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

	let itemsArr: OptionType[] = $derived(Array.from(items.values()).sort((a, b) => a.index - b.index));

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

	async function scrollToIndex(index: number) {
		if (virtualizer?.scrollToIndex) {
			await virtualizer.scrollToIndex(index);
		} else {
			const item = itemsArr.find((item) => item.index === index);
			const optionSize = (document.querySelector('.fs-autosuggest-option') as HTMLElement)?.offsetHeight || 30;

			if (item) document.getElementById(item.id)?.scrollIntoView({ block: 'nearest' });
			else
				listViewRef?.scrollBy({
					top: optionSize * (index - (activeOption?.index || 0)),
					behavior: 'smooth'
				});
		}
	}

	async function findOption(index: number, direction: 'up' | 'down') {
		const listSize = virtualizer?.size || items.size;

		let _index = index;
		let arrIndex = itemsArr.findIndex((item) => item.index === _index);
		let option: OptionType | undefined = itemsArr[arrIndex];

		if (!option && virtualizer) {
			await scrollToIndex(_index);
			arrIndex = itemsArr.findIndex((item) => item.index === _index);
			option = itemsArr[arrIndex];
		}

		if (!option) return;

		while (option?.disabled) {
			if (direction === 'up' && option.index === 0) return;
			if (direction === 'down' && option.index === listSize - 1) return;

			const offset = direction === 'up' ? -1 : 1;

			_index = option.index + offset;
			arrIndex = arrIndex + offset;

			option = itemsArr[arrIndex];
		}

		await scrollToIndex(_index);

		return option;
	}

	async function handleKeyDown(e: KeyboardEvent) {
		if (e.target !== inputRef) return;

		const { key } = e;

		const exit = () => {
			activeOption = null;
			if (selectOnFocus) value = lastTypedValue;
		};

		if (key === 'Escape') {
			e.preventDefault();
			open = false;
			return;
		}

		if (key === 'Enter') {
			e.preventDefault();
			if (activeOption) {
				methods.toggleSelection(e, activeOption.id);
				open = false;
				return;
			} else {
				querySubmitted?.(e, value);
			}
		}

		if (key === 'ArrowUp') {
			e.preventDefault();
			e.stopPropagation();
			open = true;

			await tick();

			let currentIndex = activeOption?.index ?? -1;

			if (currentIndex === -1) {
				await virtualizer?.scrollToBottom?.();
				await tick();

				currentIndex = virtualizer?.size ?? items.size;
			}

			if (currentIndex === 0) return exit();

			const prevIndex = currentIndex - 1;
			let prevItem = await findOption(prevIndex, 'up');

			if (!prevItem) return exit();

			activeOption = items.get(prevItem.id) || null;

			if (selectOnFocus) {
				const item = items.get(prevItem.id);
				if (item) {
					methods.toggleSelection(e, prevItem.id);
					value = item.text || item.value;
				}
			}

			return;
		}
		if (key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();
			open = true;

			await tick();

			let currentIndex = activeOption?.index ?? -1;

			if (currentIndex === -1) {
				await virtualizer?.scrollToTop?.();
				await tick();
			}

			if (!(itemsArr[itemsArr.length - 1].index > currentIndex)) return exit();

			const nextIndex = currentIndex + 1;
			let nextItem = await findOption(nextIndex, 'down');

			if (!nextItem) return exit();

			activeOption = items.get(nextItem.id) || null;

			if (selectOnFocus) {
				const item = items.get(nextItem.id);
				if (item) {
					methods.toggleSelection(e, nextItem.id);
					value = item.text || item.value;
				}
			}

			return;
		}
	}

	async function handleTextChanged(e: InputEvent, val: string) {
		if (val.length > 0 && !open) open = true;
		lastTypedValue = val;
		textChanged?.(e, val);

		await tick();

		// "focus" the element that starts with the typed value for better keyboard navigation
		const match = itemsArr.find((item) => {
			return (
				item.text?.toLowerCase().startsWith(val.toLowerCase()) || item.value.toLowerCase().startsWith(val.toLowerCase())
			);
		});
		if (match) {
			activeOption = match;
			await tick();
			scrollToIndex(match.index);
		}
	}

	function handleClear() {
		value = '';
		lastTypedValue = '';
		activeOption = null;
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

		const off = on(inputRef, 'keydown', handleKeyDown);
		return () => {
			activeOption = null;
			off();
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
		aria-activedescendant={open ? activeOption?.id || '' : undefined}
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
			class="fs-autosuggestbox-flyout {roundClass === 'top' ? 'top-shadow' : ''} {flyoutProps?.class}"
			{...flyoutProps}
		>
			<ListView
				role="listbox"
				navigationMode="items"
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
			top: 100%;
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
