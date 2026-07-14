import { createFSContext, type FSContext } from '$internal';
import type { TabspotInstance } from 'tabspot';

export type FSProviderContext = FSContext<
	null,
	{ readonly rtl: boolean; readonly tabspotInstance: TabspotInstance },
	null,
	null
>;

export const [getGlobalFSContext, setGlobalFSContext] = createFSContext<FSProviderContext>();
