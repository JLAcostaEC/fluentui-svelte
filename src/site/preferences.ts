import { createContext } from 'svelte';
import type { PersistedState } from 'runed';
import type { AccentAnchor, accentTextColors, generateAccentRamp } from './utils/accent-ramp.js';

type AccentPreference = {
	readonly color: string;
	readonly anchor: AccentAnchor;
	readonly ramp: ReturnType<typeof generateAccentRamp>;
	readonly textColors: ReturnType<typeof accentTextColors> | undefined;
	setColor: (value: string) => void;
	setAnchor: (value: string) => void;
	setAdjustTextContrast: (value: boolean | null) => void;
};

export const [getDisablePanZoom, setDisablePanZoom] = createContext<PersistedState<boolean>>();
export const [getAccentPreference, setAccentPreference] = createContext<AccentPreference>();
