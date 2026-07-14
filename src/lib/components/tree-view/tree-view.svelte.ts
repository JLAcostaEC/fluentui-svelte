import { createFSContext } from '$internal';
import type { SvelteMap, SvelteSet } from 'svelte/reactivity';
import type { TreeViewContext, TreeViewItemContext, TreeViewNode } from './types.js';

export const [getTreeViewContext, setTreeViewContext] = createFSContext<TreeViewContext>();

export const [getTreeViewDepth, setTreeViewDepth] = createFSContext<number>();

export const [getTreeViewItemContext, setTreeViewItemContext] = createFSContext<TreeViewItemContext>();

/**  */
export function cascadeCheck(itemId: string, state: SvelteMap<string, TreeViewNode>, checked: boolean): boolean {
	const node = state.get(itemId);
	if (!node) throw new Error(`Node with id ${itemId} not found in TREE_NODES.`);

	if (node.disabled) return true;

	let indeterminate = $state(false);

	function checkItem(id: string, _checked: boolean, _indeterminate: boolean = false): void {
		const _node = state.get(id);
		if (!_node) throw new Error(`[checkItem()] - Node with id ${id} not found in TREE_NODES.`);

		_node.checked = _checked;
		_node.indeterminate = _indeterminate;

		state.set(id, _node);
	}

	if (node.type === 'branch') {
		const children = state.values().filter((n) => n.parentId === itemId);

		for (const child of children) {
			if (child.disabled) {
				indeterminate = true;
				continue;
			}

			let childIndeterminate = false;

			if (child.type === 'branch') {
				childIndeterminate = cascadeCheck(child.id, state, checked);

				indeterminate = indeterminate || childIndeterminate;
			}

			checkItem(child.id, checked, childIndeterminate);
		}
	}

	// Check Current (leaf or branch) Node
	checkItem(itemId, checked, checked ? indeterminate : false);

	return indeterminate;
}

export function bubbleCheck(
	itemId: string,
	state: SvelteMap<string, TreeViewNode>,
	checked: boolean,
	indeterminate: boolean = false
): void {
	const node = state.get(itemId);
	if (!node) throw new Error(`Node with id ${itemId} not found in TREE_NODES.`);

	// Get parent here to avoid infinite recursion if parent is not found in TREE_NODES
	const parent = state.get(node?.parentId || '');

	if (!parent) {
		return;
	}

	let _indeterminate = indeterminate;

	if (!_indeterminate) {
		const siblings = state.values().filter((n) => n.parentId === node.parentId);

		const { someSiblingsChecked, allSiblingsChecked } = siblings.reduce(
			(acc, sibling) => {
				if (sibling.disabled) {
					acc.allSiblingsChecked = false;
					return acc;
				}

				if (sibling.checked) acc.someSiblingsChecked = true;
				else acc.allSiblingsChecked = false;

				return acc;
			},
			{ someSiblingsChecked: false, allSiblingsChecked: true }
		);

		_indeterminate = !allSiblingsChecked && someSiblingsChecked;

		parent.checked = allSiblingsChecked;
	}

	parent.indeterminate = _indeterminate;

	bubbleCheck(parent.id, state, checked, _indeterminate);
}

export function traversalSync(
	itemId: string,
	state: SvelteMap<string, TreeViewNode>,
	iterable: SvelteSet<string> | Array<string>,
	checked: boolean
) {
	const node = state.get(itemId);
	if (!node) return;

	const isIndeterminate = cascadeCheck(itemId, state, checked);

	if (node.parentId) {
		bubbleCheck(node.id, state, checked, isIndeterminate);
	}

	const checkedItems = Array.from(state.values()).filter((n) => n.checked);

	if (iterable instanceof Set) {
		iterable.clear();
		for (const { id } of checkedItems) {
			iterable.add(id);
		}
	} else if (Array.isArray(iterable)) {
		iterable.length = 0;
		iterable.push(...checkedItems.map(({ id }) => id));
	}
}

export function traversalSyncSingleSelection(
	itemId: string,
	state: SvelteMap<string, TreeViewNode>,
	iterable: SvelteSet<string> | Array<string>
) {
	const node = state.get(itemId);
	if (!node) return;

	// Uncheck all other nodes
	for (const n of state.values()) {
		if (n.id !== itemId && n.checked) {
			n.checked = false;
			n.indeterminate = false;
		}
	}

	// Check the current node
	node.checked = !node.checked;
	node.indeterminate = false;

	if (iterable instanceof Set) {
		iterable.clear();
		iterable.add(node.id);
	} else if (Array.isArray(iterable)) {
		iterable.length = 0;
		iterable.push(node.id);
	}
}
