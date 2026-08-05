import { createFSContext, type FSContext } from '$internal';
import type { TabspotInstance } from 'tabspot';

export type FSProviderContext = FSContext<
	null,
	{
		readonly rtl: boolean;
		readonly tabspotInstance: TabspotInstance;
		readonly reducedMotion: boolean;
	},
	null,
	{
		setReducedMotion: (value: boolean) => void;
	}
>;

export const [getGlobalFSContext, setGlobalFSContext] = createFSContext<FSProviderContext>();
