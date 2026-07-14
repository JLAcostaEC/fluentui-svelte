<script lang="ts" generics="Tag extends 'ul' | 'ol' | 'div' = 'ul'">
	import { defineProperty, defineState } from '$internal';
	import type { ListViewContext, ListViewProps, ListViewDOM } from './types.ts';
	import { getRole, TAG, setListViewContext } from './utils.ts';
	import { getTabspotAttributes } from 'tabspot';

	let {
		as = 'ul' as Tag,
		ref = $bindable(),
		selectionMode = 'none',
		navigationMode = 'items',
		shape = 'rounded',
		selectedItems = $bindable([]),
		onSelectionChange,
		disableTabspot = false,
		children,
		...attributes
	}: ListViewProps<Tag> = $props();

	// svelte-ignore state_referenced_locally
	if (!TAG.includes(as)) throw new Error(`Invalid tag: ${as}. Must be one of ${TAG.join(', ')}`);

	const ROLE = $derived(getRole(as, selectionMode, navigationMode));

	const MULTISELECTABLE = $derived(selectionMode === 'multiselect' || selectionMode === 'extended');

	const tabspotAttrs = $derived(
		!disableTabspot &&
			getTabspotAttributes({
				root: {
					manageSpecialKeys: true
				},
				mover: {
					axis: 'vertical',
					items: '.fs-list-view-item'
				}
			})
	);

	let anchorIndex: number | null = $state(null);

	let items: {
		id: string;
		value: string;
		disabled: boolean;
	}[] = $state([]);

	const config: ListViewContext['config'] = $derived({
		shape
	});

	let _state = defineState<ListViewContext['state']>([
		(o) =>
			defineProperty(
				o,
				'selectedItems',
				() => selectedItems,
				(v) => (selectedItems = v)
			),
		(o) =>
			defineProperty(
				o,
				'anchorIndex',
				() => anchorIndex,
				(v) => (anchorIndex = v)
			)
	]);

	let methods: ListViewContext['methods'] = {
		handleSelection: (e: MouseEvent, value: string) => {
			if (selectionMode === 'none') return;

			const itemIndex = items.findIndex((item) => item.value === value);
			if (itemIndex === -1) return;

			const item = items[itemIndex];
			if (item.disabled) return;

			if (selectionMode === 'extended' && e.shiftKey && anchorIndex !== null) {
				const start = Math.min(anchorIndex, itemIndex);
				const end = Math.max(anchorIndex, itemIndex);
				const rangeValues = items
					.slice(start, end + 1)
					.filter((i) => !i.disabled)
					.map((i) => i.value);
				const newSelectedItems = Array.from(new Set([..._state.selectedItems, ...rangeValues]));
				_state.selectedItems = newSelectedItems;
			} else if (MULTISELECTABLE && (e.ctrlKey || e.metaKey)) {
				_state.selectedItems = _state.selectedItems.includes(value)
					? _state.selectedItems.filter((v) => v !== value)
					: [..._state.selectedItems, value];
				_state.anchorIndex = itemIndex;
			} else {
				_state.selectedItems = [value];
				_state.anchorIndex = itemIndex;
			}
			onSelectionChange?.(e, _state.selectedItems);
		},
		registerItem: (id: string, value: string, disabled: boolean) => {
			items.push({ id, value, disabled });
		},
		unregisterItem: (id: string) => {
			items = items.filter((item) => item.id !== id);
		},
		getChildrenRole: (_tag: 'li' | 'a' | 'div') => {
			if (ROLE === 'grid') return 'row';
			if (ROLE === 'listbox') return 'option';
			return _tag !== 'li' ? 'listitem' : undefined;
		}
	};

	// svelte-ignore state_referenced_locally
	const CONTEXT: ListViewContext = { config, state: _state, events: null, methods };

	setListViewContext(CONTEXT);
</script>

<svelte:element
	this={as}
	bind:this={ref as ListViewDOM[Tag]}
	class="fs-list-view"
	role={ROLE}
	aria-multiselectable={MULTISELECTABLE}
	{...tabspotAttrs}
	{...attributes}
>
	{@render children?.()}
</svelte:element>

<style>
	.fs-list-view {
		list-style: none;
		padding: 0;
		margin: 0;
		width: 100%;
		& :global(.fs-list-view-item) {
			margin: 0.3rem 0;
		}
	}
</style>
