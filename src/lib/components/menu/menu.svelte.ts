import { createFSContext } from '$internal';
import type { MenuContext } from './types.ts';

export const COMPONENT_NAME = 'fs-menu-';

export const [getMenuContext, setMenuContext] = createFSContext<MenuContext>();
