import { createFSContext } from '$internal';
import type { TagPickerContext } from './types.ts';

export const [getTagPickerContext, setTagPickerContext] = createFSContext<TagPickerContext>();
