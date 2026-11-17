import { createFSContext } from '#internal';

import type { LiteFilterContext } from './types.ts';

export const [getLiteFilterContext, setLiteFilterContext] = createFSContext<LiteFilterContext>();
