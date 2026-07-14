import { createFSContext } from '$internal';
import type { DropdownContext } from './types.ts';

export const [getDropdownContext, setDropdownContext] = createFSContext<DropdownContext>();
