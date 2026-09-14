<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import { getTabspotAttributes, tabspotVirtual } from 'tabspot';
	import {
		getTreeViewContext,
		getTreeViewDepth,
		setTreeViewContext,
		setTreeViewDepth,
		getTreeViewItemContext,
		traversalSync,
		traversalSyncSingleSelection
	} from './tree-view.svelte.ts';
	import type { TreeViewProps, TreeViewContext, TreeViewNode } from './types.js';

	const CONTEXT = getTreeViewContext();
	const TREE_NODES = new SvelteMap<string, TreeViewNode>();
	const DEPTH = getTreeViewDepth() || 0;
	const ITEM_CONTEXT = getTreeViewItemContext();
	const IS_SUB_TREE = $derived(!!CONTEXT);

	if (CONTEXT) setTreeViewDepth(DEPTH + 1);

	let {
		virtualizer,
		navigationMode = CONTEXT?.config.navigationMode ?? 'tree',
		checkedItems = $bindable(CONTEXT?.state.checkedItems ?? (virtualizer !== undefined ? new SvelteSet<string>() : [])),
		openItems = $bindable(CONTEXT?.state.openItems ?? (virtualizer !== undefined ? new SvelteSet<string>() : [])),
		ref = $bindable(),
		onOpenChange,
		onCheckedChange,
		selectionMode = CONTEXT?.state.selectionMode ?? 'multiple',
		size = 'medium',
		children,
		...attributes
	}: TreeViewProps = $props();

	let forceVirtualRender = $state(false);

	const treeViewContext: TreeViewContext = $state({
		config: {
			get navigationMode() {
				return CONTEXT?.config.navigationMode || navigationMode;
			},
			get size() {
				return CONTEXT?.config.size || size;
			},
			get virtualized() {
				return CONTEXT?.config.virtualized ?? !!virtualizer;
			},
			get virtualCount() {
				return CONTEXT?.config.virtualCount ?? virtualizer?.size;
			}
		},
		state: {
			get openItems() {
				return openItems;
			},
			get checkedItems() {
				return checkedItems;
			},
			get selectionMode() {
				return selectionMode;
			},
			get TREE_NODES() {
				return CONTEXT?.state.TREE_NODES ?? TREE_NODES;
			},
			get forceVirtualRender() {
				return CONTEXT?.state.forceVirtualRender ?? forceVirtualRender;
			},
			set forceVirtualRender(v) {
				if (CONTEXT?.state.forceVirtualRender) {
					CONTEXT.state.forceVirtualRender = v;
				} else {
					forceVirtualRender = v;
				}
			}
		},
		events: {
			onCheckedChange: CONTEXT?.events.onCheckedChange ?? ((e, data) => onCheckedChange?.(e, data)),
			onOpenChange: CONTEXT?.events.onOpenChange ?? ((e, data) => onOpenChange?.(e, data))
		},
		methods: {
			handleCheck: async (e, id, checked) => {
				const { state } = treeViewContext;

				if (virtualizer) {
					state.forceVirtualRender = true;
					await tick();
				}

				if (selectionMode === 'single') {
					traversalSyncSingleSelection(id, state.TREE_NODES, checkedItems);
					return;
				}

				traversalSync(id, state.TREE_NODES, checkedItems, checked);
			},
			openItem: (e, id) => {
				if (openItems instanceof SvelteSet) {
					openItems.add(id);
				} else {
					openItems = [...openItems, id];
				}
				const node = treeViewContext.state.TREE_NODES.get(id)!;

				node.open = true;
			},
			closeItem: (e, id) => {
				const { state } = treeViewContext;

				if (openItems instanceof SvelteSet) {
					openItems.delete(id);
				} else {
					openItems = openItems.filter((itemId) => itemId !== id);
				}
				const node = state.TREE_NODES.get(id)!;

				node.open = false;

				// If
				if (virtualizer && state.forceVirtualRender) {
					state.forceVirtualRender = false;
				}
			},
			registerItem: (node) => {
				treeViewContext.state.TREE_NODES.set(node.id, node);
			},
			unregisterItem: (id) => {
				treeViewContext.state.TREE_NODES.delete(id);
			}
		}
	});

	setTreeViewContext(treeViewContext);

	const tabspotAttributes = $derived(
		!IS_SUB_TREE
			? getTabspotAttributes({
					root: {
						manageSpecialKeys: true
					},
					mover: { axis: 'vertical', items: '.fs-tree-view-item', skip: '[aria-disabled="true"]' }
				})
			: getTabspotAttributes({
					mover: { axis: 'vertical', items: '.fs-tree-view-item', skip: '[aria-disabled="true"]' },
					grouper: { enterDirection: 'right', exitDirection: 'left' }
				})
	);

	let typeBuffer = $state('');
	let typeTimer: ReturnType<typeof setTimeout> | undefined = $state();

	// APG type-ahead: typing printable characters moves focus to the next visible
	// treeitem whose label starts with the typed string. Only the root tree listens;
	// nav/activation keys are handled by tabspot and the treeitems themselves.
	const handleTypeahead = (e: KeyboardEvent) => {
		if (IS_SUB_TREE || !ref) return;
		if (e.key.length !== 1 || e.key === ' ' || e.altKey || e.ctrlKey || e.metaKey) return;

		typeBuffer += e.key.toLowerCase();
		clearTimeout(typeTimer);
		typeTimer = setTimeout(() => {
			typeBuffer = '';
		}, 500);

		const items = Array.from(ref.querySelectorAll<HTMLElement>('.fs-tree-view-item')).filter((el) =>
			el.checkVisibility ? el.checkVisibility() : el.offsetParent !== null
		);
		const start = items.indexOf(document.activeElement as HTMLElement);

		for (let i = 1; i <= items.length; i++) {
			const item = items[(start + i) % items.length];
			const label = item.querySelector('.fs-tree-view-item-label')?.textContent?.trim().toLowerCase();
			if (label?.startsWith(typeBuffer)) {
				item.focus();
				break;
			}
		}
	};

	// Add tabspot virtualizer for correct focus management
	onMount(() => {
		if (!IS_SUB_TREE || !ref || !virtualizer) return;
		return tabspotVirtual(ref, {
			scrollToIndex: (index) => virtualizer.scrollToIndex?.(index),
			count: () => virtualizer.size
		});
	});
</script>

<!-- Render only when necessary (virtualizer perf) -->
{#if treeViewContext.state.forceVirtualRender || (treeViewContext.config.virtualized && (!IS_SUB_TREE || ITEM_CONTEXT?.open)) || !treeViewContext.config.virtualized}
	<ul
		class="fs-tree-view"
		role={IS_SUB_TREE ? 'group' : 'tree'}
		aria-multiselectable={selectionMode !== 'single'}
		onkeydown={!IS_SUB_TREE ? handleTypeahead : undefined}
		bind:this={ref}
		{...tabspotAttributes}
		{...attributes}
	>
		{@render children?.()}
	</ul>
{/if}

<style>
	.fs-tree-view {
		display: flex;
		flex-direction: column;
		list-style: none;
		padding: 0;
		margin: 0;
		gap: 0.125rem;
	}
</style>
