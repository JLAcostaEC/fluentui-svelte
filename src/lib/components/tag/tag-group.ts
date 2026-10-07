import { createFSContext } from '$internal';
import type { TagGroupContext } from './types.ts';

export const [getTagGroupContext, setTagGroupContext] = createFSContext<TagGroupContext>();
