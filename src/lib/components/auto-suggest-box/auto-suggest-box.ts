import { createFSContext } from '$internal';
import type { AutoSuggestBoxContext } from './types.ts';

export const [getAutoSuggestBoxContext, setAutoSuggestBoxContext] = createFSContext<AutoSuggestBoxContext>();
