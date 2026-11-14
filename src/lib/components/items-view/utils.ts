import { PREFIX } from '#constants';
import { createFSContext } from '#internal';
import type { ItemsViewContext } from './types.ts';

export const COMPONENT_NAME = `${PREFIX}-items-view`;

export const ITEMS = `.${COMPONENT_NAME}-item[data-items-view-interactive]`;
export const SKIP = '[aria-disabled="true"]';

export const [getItemsViewContext, setItemsViewContext] = createFSContext<ItemsViewContext>();
