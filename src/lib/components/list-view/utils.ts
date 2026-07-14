import { PREFIX } from '$constants';
import type { ListViewContext, NavigationMode, SelectionMode } from './types.ts';
import { createFSContext } from '$internal';

export const COMPONENT_NAME = `${PREFIX}list-view-`;

export const TAG = ['ul', 'ol', 'div'];

export const ITEM_TAG = ['li', 'a', 'div'];

export function getRole(
	tag: 'ul' | 'ol' | 'div',
	selectionMode: SelectionMode,
	navigationMode: NavigationMode
): 'grid' | 'listbox' | 'list' | undefined {
	if (selectionMode !== 'none') {
		return navigationMode === 'composite' ? 'grid' : 'listbox';
	}
	return tag === 'div' ? 'list' : undefined;
}

export const [getListViewContext, setListViewContext] = createFSContext<ListViewContext>();
