import { createFSContext } from '$internal';

import type { CardContext } from './types.ts';

export const [getCardContext, setCardContext] = createFSContext<CardContext>();
