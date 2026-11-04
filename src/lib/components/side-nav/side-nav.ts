import { createFSContext } from '#internal';
import type { SideNavContext } from './types.ts';

export const [getSideNavContext, setSideNavContext] = createFSContext<SideNavContext>();
