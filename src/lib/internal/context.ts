import { getContext, hasContext, setContext } from 'svelte';

/**
 * Base context shape shared across all FluentUI Svelte components.
 * - `config`: readonly props passed by the consumer (never mutated internally)
 * - `state`: reactive internal state
 * - `events`: callbacks exposed to the parent
 * - `methods`: imperative API exposed to the parent
 */
export type FSContext<
	Config = Record<string, unknown> | null,
	State = Record<string, unknown> | null,
	Events = Record<string, (...args: unknown[]) => void> | null,
	Methods = Record<string, (...args: unknown[]) => void> | null
> = {
	readonly config: Config;
	state: State;
	events: Events;
	methods: Methods;
};

export function createFSContext<T>(): [() => T | null, (context: T) => void] {
	const key = {};

	return [
		() => {
			if (!hasContext(key)) {
				return null;
			}

			return getContext(key);
		},
		(context: T) => setContext(key, context)
	];
}
