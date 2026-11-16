import { createFSContext } from '#internal';

import type { TeachingTipContext } from './types.ts';

export const [getTeachingTipContext, setTeachingTipContext] = createFSContext<TeachingTipContext>();
