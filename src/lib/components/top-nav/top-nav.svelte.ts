import { PREFIX } from '$constants';
import { createFSContext } from '$internal';
import type { TopNavContext } from './types.ts';

export const COMPONENT_NAME = `${PREFIX}-top-nav`;

export const [getTopNavContext, setTopNavContext] = createFSContext<TopNavContext>();

/** The items a mover lands on, and what the bar is measured against. */
export const TABSPOT_ITEMS = '.fs-top-nav-item';

/**
 * Items the cursor passes over instead of landing on: a disabled item answers nothing once reached.
 * A button says so with the attribute of its own; an anchor, which has none, says it to ARIA.
 */
export const TABSPOT_SKIP = '[disabled], [aria-disabled="true"]';

/** Reads the top nav context, or fails loudly when an item is rendered outside a `TopNav`. */
export const requireTopNavContext = (): TopNavContext => {
	const context = getTopNavContext();
	if (!context) throw new Error(`No TopNavContext found for ${COMPONENT_NAME}.`);
	return context;
};
