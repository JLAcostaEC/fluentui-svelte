<script lang="ts" generics="Tag extends 'ul' | 'ol' | 'div' = 'ul'">
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

	/**
	 * The tag the invariant rules over. The markup renders it through here, so it is checked
	 * during SSR and on every prop update rather than only once on mount.
	 */
	const _as = $derived.by(() => {
		if (!TAG.includes(as)) throw new Error(`Invalid tag: ${as}. Must be one of ${TAG.join(', ')}`);
		return as;
	});

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

	const CONTEXT: ListViewContext = $state({
		config: {
			get shape() {
				return shape;
			}
		},
		state: {
			get selectedItems() {
				return selectedItems;
			},
			set selectedItems(v) {
				selectedItems = v;
			},
			get anchorIndex() {
				return anchorIndex;
			},
			set anchorIndex(v) {
				anchorIndex = v;
			}
		},
		events: null,
		methods: {
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
					selectedItems = Array.from(new Set([...selectedItems, ...rangeValues]));
				} else if (MULTISELECTABLE && (e.ctrlKey || e.metaKey)) {
					selectedItems = selectedItems.includes(value)
						? selectedItems.filter((v) => v !== value)
						: [...selectedItems, value];
					anchorIndex = itemIndex;
				} else {
					selectedItems = [value];
					anchorIndex = itemIndex;
				}
				onSelectionChange?.(e, selectedItems);
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
		}
	});

	setListViewContext(CONTEXT);
</script>

<svelte:element
	this={_as}
	bind:this={ref as ListViewDOM[Tag]}
	class="fs-list-view"
	role={ROLE}
	aria-multiselectable={MULTISELECTABLE || undefined}
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
