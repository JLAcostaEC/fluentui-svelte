import { createFSContext } from '#internal';

import type { DrawerContext } from './types.ts';

export const [getDrawerContext, setDrawerContext] = createFSContext<DrawerContext>();
