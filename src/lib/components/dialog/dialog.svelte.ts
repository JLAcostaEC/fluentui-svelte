import { createFSContext } from '../../internal/context.ts';
import type { DialogContext } from './types.ts';

export const [getDialogContext, setDialogContext] = createFSContext<DialogContext>();
