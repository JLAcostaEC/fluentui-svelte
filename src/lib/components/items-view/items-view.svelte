<script lang="ts">
	import { getTabspotAttributes, type TabspotNodeOptions } from 'tabspot';
	import { toLength } from '#internal';
	import { attachTabspot } from '../list-view/utils.ts';
	import { COMPONENT_NAME, ITEMS, SKIP, setItemsViewContext } from './utils.ts';
	import type { ItemsViewContext, ItemsViewItemEntry, ItemsViewProps } from './types.ts';

	let {
		layout = 'stack',
		orientation = 'vertical',
		spacing,
		minItemWidth,
		lineHeight,
		selectionMode = 'none',
		showCheckboxes = false,
		selectedItems = $bindable([]),
		onSelectionChange,
		onItemInvoke,
		disableTabspot = false,
		ref = $bindable(null),
		children,
		class: classes,
		...attributes
	}: ItemsViewProps = $props();

	const selectable = $derived(selectionMode !== 'none');
	const multiselectable = $derived(selectionMode === 'multiselect' || selectionMode === 'extended');
	const horizontal = $derived(layout === 'stack' && orientation === 'horizontal');

	const tabspotConfig: TabspotNodeOptions | undefined = $derived.by(() => {
		if (disableTabspot) return undefined;
		const common = { items: ITEMS, skip: SKIP, activation: { mode: 'focus', roving: true } } as const;
		return {
			root: { manageSpecialKeys: { Home: true, End: true, PageUp: true, PageDown: true } },
			// A wrapped layout is a grid whose rows are told apart by geometry.
			mover:
				layout === 'stack'
					? { ...common, axis: orientation }
					: { ...common, layout: 'grid', flow: 'linear', rows: { by: 'geometry' } }
		};
	});
	const tabspotAttrs = $derived(tabspotConfig && getTabspotAttributes(tabspotConfig));

	const items: Record<string, () => ItemsViewItemEntry> = {};
	// The value that anchors a Shift range in the extended mode.
	let anchor: string | null = null;
	// The items selected before the anchor, which every Shift range from that anchor is applied to.
	let rangeBase: string[] = [];
	// The last selection the view wrote, to tell when the consumer changes it.
	let written: string[] = [];
	// The item that holds the tab stop in the server HTML, before Tabspot runs.
	let tabStopId: string | null = null;

	/** The registered items in DOM order, which can differ from the registration order after a keyed reorder. */
	const orderedItems = () =>
		Object.values(items)
			.map((getItem) => getItem())
			.sort((a, b) => {
				if (!a.element || !b.element) return 0;
				return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
			});

	function select(e: MouseEvent | KeyboardEvent, value: string) {
		if (!selectable) return;
		const toggle = e.ctrlKey || e.metaKey;
		if (written.length !== selectedItems.length || written.some((v, i) => v !== selectedItems[i])) rangeBase = [];

		if (selectionMode === 'extended' && e.shiftKey && anchor !== null) {
			const ordered = orderedItems();
			const from = ordered.findIndex((item) => item.value === anchor);
			const to = ordered.findIndex((item) => item.value === value);
			if (from === -1 || to === -1) return;
			const range = ordered
				.slice(Math.min(from, to), Math.max(from, to) + 1)
				.filter((item) => !item.disabled)
				.map((item) => item.value);
			// The range keeps the base: Ctrl + Shift adds it, Shift alone toggles the items they share.
			selectedItems = toggle
				? [...new Set([...rangeBase, ...range])]
				: [...rangeBase.filter((v) => !range.includes(v)), ...range.filter((v) => !rangeBase.includes(v))];
		} else if (selectionMode === 'multiselect' || (selectionMode === 'extended' && toggle)) {
			selectedItems = selectedItems.includes(value)
				? selectedItems.filter((v) => v !== value)
				: [...selectedItems, value];
			anchor = value;
			rangeBase = selectedItems.filter((v) => v !== value);
		} else if (toggle && selectedItems.includes(value)) {
			selectedItems = [];
		} else {
			selectedItems = [value];
			anchor = value;
			rangeBase = [];
		}
		written = [...selectedItems];
		onSelectionChange?.(e, selectedItems);
	}

	const CONTEXT: ItemsViewContext = $state({
		config: {
			get selectionMode() {
				return selectionMode;
			},
			get showCheckboxes() {
				return showCheckboxes;
			},
			get invokable() {
				return !!onItemInvoke;
			},
			get roving() {
				return !disableTabspot;
			}
		},
		state: {
			get selectedItems() {
				return selectedItems;
			}
		},
		events: null,
		methods: {
			select,
			invoke: (e, value) => onItemInvoke?.(e, value),
			registerItem: (id, getItem) => (items[id] = getItem),
			unregisterItem: (id) => delete items[id],
			claimTabStop: (id) => (tabStopId ??= id) === id
		}
	});

	setItemsViewContext(CONTEXT);
</script>

<!--
	@component
	Fluent UI ItemsView: A collection of items arranged as a stack, a uniform grid or lines that keep each item's aspect
	ratio, with single, multiple or extended selection and item invocation.
	- Usage:
	```tsx
		<script>
			import { ItemsView, ItemsViewItem } from 'fluentui-svelte';
			let selectedItems = $state([]);
		</script>

		<ItemsView aria-label="Photos" layout="grid" selectionMode="single" bind:selectedItems>
			<ItemsViewItem value="one"><img src="/one.jpg" alt="One" /></ItemsViewItem>
			<ItemsViewItem value="two"><img src="/two.jpg" alt="Two" /></ItemsViewItem>
		</ItemsView>
		```
-->
<div
	{...attributes}
	bind:this={ref}
	class={[COMPONENT_NAME, `${COMPONENT_NAME}-${layout}`, horizontal && `${COMPONENT_NAME}-horizontal`, classes]}
	role={attributes.role ?? (selectable ? 'listbox' : 'list')}
	aria-multiselectable={multiselectable || undefined}
	aria-orientation={selectable && horizontal ? 'horizontal' : undefined}
	style:--fs-items-view-spacing={spacing === undefined ? undefined : toLength(spacing)}
	style:--fs-items-view-min-item-width={minItemWidth === undefined ? undefined : toLength(minItemWidth)}
	style:--fs-items-view-line-height={lineHeight === undefined ? undefined : toLength(lineHeight)}
	{...tabspotAttrs}
	{@attach attachTabspot(tabspotConfig)}
>
	{@render children?.()}
</div>

<style>
	.fs-items-view {
		display: flex;
		flex-direction: column;
		gap: var(--fs-items-view-spacing, 0.25rem);
		box-sizing: border-box;
		/* Room for the focus rectangle when the consumer clips the overflow. */
		padding: 0.25rem;

		&.fs-items-view-horizontal {
			flex-direction: row;
			align-items: flex-start;
		}

		&.fs-items-view-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(min(var(--fs-items-view-min-item-width, 10rem), 100%), 1fr));
		}

		/* Items keep the line height and grow to fill each line; the last line is not stretched. */
		&.fs-items-view-flow {
			flex-flow: row wrap;
			& > :global(.fs-items-view-item) {
				flex: 1 0 auto;
				block-size: var(--fs-items-view-line-height, 10rem);
			}
			&::after {
				content: '';
				flex: 999 1 auto;
			}
		}
	}
</style>
