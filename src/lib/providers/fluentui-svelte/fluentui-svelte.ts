import { createFSContext, type FSContext } from '$internal';
import { prefersReducedMotion } from 'svelte/motion';
import type { THEME } from '$lib/types/index.js';
import type { TabspotInstance } from 'tabspot';

export type FSProviderContext = FSContext<
	null,
	{
		readonly tabspotInstance: TabspotInstance;
		readonly reducedMotion: boolean;
		readonly theme: Omit<THEME, 'system'> | undefined;
	},
	null,
	{
		/** `true`/`false` is the app's own preference and outranks the OS; `null` defers to it again. */
		setReducedMotion: (value: boolean | null) => void;
		/** `'light'`/`'dark'` is the app's own preference and outranks the OS; `null` defers to it again. */
		setTheme: (value: THEME) => void;
	}
>;

export const [getGlobalFSContext, setGlobalFSContext] = createFSContext<FSProviderContext>();

/**
 * `reducedMotion` from the global context, for components that have to hand the value to something
 * that cannot read context itself — a transition function or a plain class.
 */
export function getReducedMotion() {
	const context = getGlobalFSContext();

	return () => context?.state.reducedMotion ?? prefersReducedMotion.current;
}
