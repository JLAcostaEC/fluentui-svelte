import { createFSContext } from '#internal';
import type { AppWindowContext } from './types.ts';

/** Returns the nearest AppWindow context, or null for standalone components. */
export const [getAppWindowContext, setAppWindowContext] = createFSContext<AppWindowContext>();
