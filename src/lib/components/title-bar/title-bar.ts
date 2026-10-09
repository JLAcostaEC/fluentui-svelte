import { PREFIX } from '$constants';
import { createFSContext } from '$internal';
import type { TitleBarContext } from './types.ts';

export const COMPONENT_NAME = `${PREFIX}-title-bar`;

export const [getTitleBarContext, setTitleBarContext] = createFSContext<TitleBarContext>();

/** Reads the title bar context, or fails loudly when a control is rendered outside a `TitleBar`. */
export const requireTitleBarContext = (): TitleBarContext => {
	const context = getTitleBarContext();
	if (!context) throw new Error(`No TitleBarContext found for ${COMPONENT_NAME}.`);
	return context;
};
