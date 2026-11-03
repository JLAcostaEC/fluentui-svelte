import { createContext } from 'svelte';
import type { PersistedState } from 'runed';

export const [getDisablePanZoom, setDisablePanZoom] = createContext<PersistedState<boolean>>();
