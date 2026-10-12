<script lang="ts" generics="Tag extends 'ul' | 'ol' | 'div' = 'ul'">
	import type { ListViewContext, ListViewProps, ListViewDOM } from './types.ts';
	import {
		attachTabspot,
		getListViewContext,
		getListViewItemContext,
		getRole,
		LIST_VIEW_SKIP,
		TAG,
		setListViewContext
	} from './utils.ts';
	import { getTabspotAttributes, type TabspotNodeOptions } from 'tabspot';

	let {
		as = 'ul' as Tag,
		ref = $bindable(),
		selectionMode = 'none',
		navigationMode = 'items',
		shape = 'rounded',
		selectedItems = $bindable([]),
		onSelectionChange,
		disableTabspot = false,
		toggleOnClick = false,
		children,
		...attributes
	}: ListViewProps<Tag> = $props();

	/**
	 * The tag the invariant rules over. The markup renders it through here, so it is checked
	 * during SSR and on every prop update rather than only once on mount.
	 */
	const itemContext = getListViewItemContext();
	const _as = $derived.by(() => {
		if (!TAG.includes(as)) throw new Error(`Invalid tag: ${as}. Must be one of ${TAG.join(', ')}`);
		if (itemContext?.as === 'a' || itemContext?.as === 'button') {
			throw new Error('Nested ListView must be inside a li or div ListViewItem, outside links and buttons.');
		}
		return as;
	});

	const parent = getListViewContext();
	const tabspotDisabled = $derived(disableTabspot || !!parent?.config.disableTabspot);
	const ROLE = $derived(attributes.role ?? getRole(as, selectionMode, navigationMode));

	const MULTISELECTABLE = $derived(selectionMode === 'multiselect' || selectionMode === 'extended');

	const tabspotConfig: TabspotNodeOptions | undefined = $derived(
		tabspotDisabled
			? undefined
			: {
					...(parent
						? { grouper: { enterDirection: 'right', exitDirection: 'left' } }
						: { root: { manageSpecialKeys: true } }),
					mover: {
						axis: 'vertical',
						items:
							'.fs-list-view-item[data-list-view-interactive], .fs-list-view-item:not([data-list-view-interactive]) :is(a[href], button), .fs-list-view-item-branch-trigger',
						visibilityAware: 'Visible',
						skip: LIST_VIEW_SKIP,
						...(!parent && { activation: { mode: 'focus', roving: navigationMode === 'composite' } })
					}
				}
	);
	const tabspotAttrs = $derived(tabspotConfig && getTabspotAttributes(tabspotConfig));

	let anchorIndex: number | null = $state(null);

	let items: {
		id: string;
		getItem: () => { value: string; disabled: boolean; element: HTMLElement | null };
	}[] = $state([]);

	const CONTEXT: ListViewContext = $state({
		config: {
			get shape() {
				return shape;
			},
			get as() {
				return as;
			},
			get selectionMode() {
				return selectionMode;
			},
			get role() {
				return ROLE;
			},
			get disableTabspot() {
				return tabspotDisabled;
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
			handleSelection: (e: MouseEvent, value: string, toggle = false) => {
				if (selectionMode === 'none') return;

				// Registration order can differ from the DOM after keyed items are reordered.
				const orderedItems = items
					.map((item) => item.getItem())
					.sort((a, b) => {
						if (!a.element || !b.element) return 0;
						return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
					});
				const itemIndex = orderedItems.findIndex((item) => item.value === value);
				if (itemIndex === -1) return;

				const item = orderedItems[itemIndex];
				if (item.disabled) return;

				if (selectionMode === 'extended' && e.shiftKey && anchorIndex !== null) {
					const start = Math.min(anchorIndex, itemIndex);
					const end = Math.max(anchorIndex, itemIndex);
					const rangeValues = orderedItems
						.slice(start, end + 1)
						.filter((i) => !i.disabled)
						.map((i) => i.value);
					selectedItems = Array.from(new Set([...selectedItems, ...rangeValues]));
				} else if (MULTISELECTABLE && (toggle || e.ctrlKey || e.metaKey || toggleOnClick)) {
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
			registerItem: (id, getItem) => {
				items.push({ id, getItem });
			},
			unregisterItem: (id: string) => {
				items = items.filter((item) => item.id !== id);
			},
			getChildrenRole: (_tag: 'li' | 'a' | 'button' | 'div') => {
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
	aria-multiselectable={((ROLE === 'grid' || ROLE === 'listbox') && MULTISELECTABLE) || undefined}
	{...tabspotAttrs}
	{...attributes}
	{@attach attachTabspot(tabspotConfig)}
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
