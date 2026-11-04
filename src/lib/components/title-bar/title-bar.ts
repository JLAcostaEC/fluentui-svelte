import { PREFIX } from '#constants';
import { createFSContext } from '#internal';
import type { TitleBarContext } from './types.ts';

export const COMPONENT_NAME = `${PREFIX}-title-bar`;

export const [getTitleBarContext, setTitleBarContext] = createFSContext<TitleBarContext>();
