import { PREFIX } from '$constants';
import { createFSContext } from '$internal';
import type { TabViewContext } from './types.ts';

export const COMPONENT_NAME = `${PREFIX}-tab-view`;

export const [getTabViewContext, setTabViewContext] = createFSContext<TabViewContext>();

/** The tabs a mover lands on. The new tab button sits outside the list, so it is never one of them. */
export const TABSPOT_ITEMS = '.fs-tab-view-tab';

/** Tabs the cursor passes over instead of landing on: a disabled tab answers nothing once reached. */
export const TABSPOT_SKIP = '[aria-disabled="true"]';

/** Reads the tab view context, or fails loudly when a tab is rendered outside a `TabView`. */
export const requireTabViewContext = (): TabViewContext => {
	const context = getTabViewContext();
	if (!context) throw new Error(`No TabViewContext found for ${COMPONENT_NAME}.`);
	return context;
};
