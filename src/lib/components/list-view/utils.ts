import { PREFIX } from '$constants';
import type { ListViewContext, NavigationMode, SelectionMode } from './types.ts';
import { createFSContext } from '$internal';
import type { Attachment } from 'svelte/attachments';
import {
	setTabspotAttributes,
	type TabspotNodeOptions,
	type TabspotEventListener,
	type TabspotInstance
} from 'tabspot';

export const COMPONENT_NAME = `${PREFIX}list-view-`;

export const TAG = ['ul', 'ol', 'div'];

export const ITEM_TAG = ['li', 'a', 'button', 'div'];
export const LIST_VIEW_SKIP =
	'[disabled], [aria-disabled="true"], [hidden], [hidden] *, [inert], [inert] *, [aria-hidden="true"], [aria-hidden="true"] *';

export const [getListViewItemContext, setListViewItemContext] = createFSContext<{
	readonly as: 'li' | 'a' | 'button' | 'div';
}>();

/** Register roots mounted after the provider starts, and release managed focus on updates/unmount. */
export function attachTabspot(
	config: TabspotNodeOptions | undefined,
	onNavigate?: TabspotEventListener,
	instance?: TabspotInstance
): Attachment<HTMLElement> {
	return (element) => {
		if (!config) return;
		const result = setTabspotAttributes({ element, config });
		const detach = onNavigate && (result.ok ? (result.instance ?? instance) : undefined)?.subscribe(onNavigate);
		return () => {
			detach?.();
			setTabspotAttributes({ element, config: {} });
		};
	};
}

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
